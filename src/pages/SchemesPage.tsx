
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemeCard from '@/components/SchemeCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from 'lucide-react';
import schemes from '@/data/schemes';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const SchemesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Get unique categories from schemes
  const uniqueCategories = [...new Set(schemes.map(scheme => scheme.category))].sort();
  
  const filteredSchemes = schemes.filter(scheme => {
    // Apply search query filter
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = category === '' || category === 'all' || scheme.category.toLowerCase() === category.toLowerCase();
    
    // Apply active schemes filter
    const matchesActive = !showOnlyActive || (scheme.deadline && scheme.deadline !== 'Closed');
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  // Pagination
  const itemsPerPage = isMobile ? 6 : 12;
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const currentItems = filteredSchemes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setShowOnlyActive(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Handle page change
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update URL when filters change
  useEffect(() => {
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setSearchParams({ page: '1' });
    }
  }, [searchQuery, category, showOnlyActive]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-6 sm:pt-8 pb-12 sm:pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-scheme-primary to-scheme-accent">
                Explore Government Schemes
              </span>
              <div className="absolute w-16 sm:w-24 h-1 bg-scheme-primary mt-1 rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-6 max-w-2xl">
              Browse through all available schemes or use filters to find the ones that match your needs.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 sm:mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-4 sm:mb-6">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search for schemes..."
                    className="pl-10 border-gray-200 focus-visible:ring-scheme-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="w-full sm:w-64">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-gray-200 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="bg-scheme-primary hover:bg-scheme-primary/90 shadow-sm w-full sm:w-auto"
                    onClick={() => {
                      if (isMobile) {
                        setShowAdvancedFilters(!showAdvancedFilters);
                      }
                    }}
                  >
                    <Filter className="mr-2 h-4 w-4" /> 
                    {isMobile ? (showAdvancedFilters ? 'Hide Filters' : 'Show Filters') : 'Filter'}
                  </Button>
                </div>
              </div>
            </div>
            
            {(showAdvancedFilters || !isMobile) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <Checkbox 
                    id="active-schemes" 
                    checked={showOnlyActive}
                    onCheckedChange={(checked) => setShowOnlyActive(!!checked)}
                    className="border-gray-300 data-[state=checked]:bg-scheme-secondary data-[state=checked]:border-scheme-secondary"
                  />
                  <Label htmlFor="active-schemes" className="ml-2 text-sm">
                    Show only active schemes
                  </Label>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{filteredSchemes.length} schemes found</span>
                  
                  {(searchQuery || category || showOnlyActive) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Results */}
          {currentItems.length > 0 ? (
            <>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`page-${currentPage}`}
              >
                {currentItems.map((scheme) => (
                  <motion.div key={scheme.id} variants={itemVariants}>
                    <SchemeCard scheme={scheme} />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => changePage(currentPage - 1)} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        // Show first page, last page, and pages around current page
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink 
                                isActive={currentPage === pageNum}
                                onClick={() => changePage(pageNum)}
                                className={currentPage === pageNum 
                                  ? "bg-scheme-primary text-white border-scheme-primary hover:bg-scheme-primary/90" 
                                  : "cursor-pointer hover:border-scheme-primary hover:text-scheme-primary"}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipses for page ranges
                        if (
                          (pageNum === 2 && currentPage > 3) || 
                          (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={`ellipsis-${pageNum}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => changePage(currentPage + 1)} 
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No schemes found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-scheme-primary text-scheme-primary hover:bg-scheme-primary/10"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemesPage;
