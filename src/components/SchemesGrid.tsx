
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SchemeCard from "./SchemeCard";
import { SchemeProps } from "./SchemeCard";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

const SchemesGrid = () => {
  const [schemes, setSchemes] = useState<SchemeProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetchSchemes();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('schemes-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schemes' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchSchemes(); // Reload schemes when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, pageSize]); // Re-fetch when page or page size changes

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      
      // First, get the total count
      const countQuery = await supabase
        .from('schemes')
        .select('id', { count: 'exact', head: true });
      
      if (countQuery.error) throw countQuery.error;
      setTotalCount(countQuery.count || 0);

      // Then fetch the current page of data
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error } = await supabase
        .from('schemes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Convert eligibility from Json to the expected format
      const formattedData = data?.map(item => {
        let formattedEligibility: string | { minAge?: number; maxAge?: number; maxIncome?: number; category?: string[] } = 
          typeof item.eligibility === 'string' ? item.eligibility : 
          (item.eligibility_text || 'All citizens eligible');
        
        // Handle case where eligibility is an object
        if (typeof item.eligibility === 'object' && item.eligibility !== null) {
          // Type assertion to tell TypeScript we know what we're doing
          const eligibilityObj = item.eligibility as Record<string, any>;
          
          formattedEligibility = {
            minAge: eligibilityObj.minAge as number | undefined,
            maxAge: eligibilityObj.maxAge as number | undefined,
            maxIncome: eligibilityObj.maxIncome as number | undefined,
            category: eligibilityObj.category as string[] | undefined
          };
        }
        
        return {
          ...item,
          eligibility: formattedEligibility
        } as SchemeProps;
      }) || [];

      setSchemes(formattedData);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schemes. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to trigger scheme sync
  const syncSchemes = async () => {
    try {
      setIsSyncing(true);
      toast({
        title: "Syncing",
        description: "Fetching latest schemes from MyScheme API...",
      });

      const response = await supabase.functions.invoke('sync-schemes');
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast({
        title: "Success",
        description: response.data.message || "Schemes synced successfully!",
      });
      
      // Refresh schemes
      fetchSchemes();
    } catch (error) {
      console.error('Error syncing schemes:', error);
      toast({
        title: "Error",
        description: `Failed to sync schemes: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Change page handler
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Render pagination elements
  const renderPagination = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => changePage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => changePage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => changePage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scheme-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {schemes.length} of {totalCount} schemes
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Schemes per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="12" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={syncSchemes}
            disabled={isSyncing}
            className="ml-2"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" /> Sync Schemes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => changePage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {renderPagination()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => changePage(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SchemesGrid;
