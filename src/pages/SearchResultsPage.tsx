
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemeCard from '@/components/SchemeCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { searchSchemes } from '@/utils/schemeDataService';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { SchemeProps } from '@/components/SchemeCard';
import LanguageSelector from '@/components/LanguageSelector';
import { Badge } from '@/components/ui/badge';

const categories = [
  { id: "all", name: "All Categories" },
  { id: "agriculture", name: "Agriculture & Farming" },
  { id: "education", name: "Education & Learning" },
  { id: "health", name: "Health & Wellness" },
  { id: "finance", name: "Finance & Subsidies" },
  { id: "housing", name: "Housing" },
  { id: "social", name: "Social Welfare" },
  { id: "employment", name: "Employment" },
  { id: "women", name: "Women & Child" },
  // Add more categories as needed
];

const states = [
  { id: "all", name: "All States/UTs" },
  { id: "andhra-pradesh", name: "Andhra Pradesh" },
  { id: "assam", name: "Assam" },
  { id: "bihar", name: "Bihar" },
  { id: "delhi", name: "Delhi" },
  { id: "gujarat", name: "Gujarat" },
  { id: "karnataka", name: "Karnataka" },
  { id: "kerala", name: "Kerala" },
  { id: "maharashtra", name: "Maharashtra" },
  { id: "tamil-nadu", name: "Tamil Nadu" },
  // Add more states as needed
];

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialState = searchParams.get('state') || 'all';
  
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [state, setState] = useState(initialState);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [filtersMobileOpen, setFiltersMobileOpen] = useState(false);
  
  const [results, setResults] = useState<SchemeProps[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Effect to update search results when parameters change
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        // Set up filters
        const filters: {
          category?: string;
          state?: string;
          isActive?: boolean;
        } = {};
        
        if (category !== 'all') {
          filters.category = category;
        }
        
        if (state !== 'all') {
          filters.state = state;
        }
        
        filters.isActive = isActive;
        
        // Perform search
        const searchResults = await searchSchemes(query, filters);
        setResults(searchResults);
      } catch (error) {
        console.error("Error searching schemes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
    
    // Update URL search params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);
    if (state !== 'all') params.set('state', state);
    setSearchParams(params);
    
  }, [query, category, state, isActive, setSearchParams]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already triggered by the useEffect when query changes
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {query ? `Search Results for "${query}"` : "Browse All Schemes"}
            </h1>
            <p className="text-gray-600 mt-2">
              {results.length} 
              {results.length === 1 ? ' scheme' : ' schemes'} found
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Mobile Filters Toggle */}
            <div className="md:hidden mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => setFiltersMobileOpen(!filtersMobileOpen)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {filtersMobileOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {/* Search and Filters sidebar */}
            <div className={`md:w-64 flex-shrink-0 ${filtersMobileOpen ? 'block' : 'hidden md:block'}`}>
              <Card className="p-4">
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search schemes..." 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="submit" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-10 w-10"
                    >
                      <Search size={18} />
                    </Button>
                  </div>
                </form>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Filter by Category</h3>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Filter by State</h3>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((st) => (
                        <SelectItem key={st.id} value={st.id}>
                          {st.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Scheme Status</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="active-schemes" 
                      checked={isActive}
                      onCheckedChange={(checked) => setIsActive(checked as boolean)} 
                    />
                    <label
                      htmlFor="active-schemes"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show only active schemes
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Language</h3>
                  <LanguageSelector variant="outline" />
                </div>
                
                {/* Applied filters */}
                {(category !== 'all' || state !== 'all') && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Applied Filters:</h3>
                    <div className="flex flex-wrap gap-2">
                      {category !== 'all' && (
                        <Badge variant="outline" className="flex items-center">
                          {categories.find(c => c.id === category)?.name}
                        </Badge>
                      )}
                      {state !== 'all' && (
                        <Badge variant="outline" className="flex items-center">
                          {states.find(s => s.id === state)?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            {/* Search results */}
            <div className="flex-grow">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-t-scheme-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Searching schemes...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((scheme, index) => (
                    <motion.div
                      key={scheme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <SchemeCard scheme={scheme} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Filter className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No schemes found</h2>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    We couldn't find any schemes matching your search. Try adjusting your filters or search term.
                  </p>
                  <Button 
                    onClick={() => {
                      setQuery('');
                      setCategory('all');
                      setState('all');
                      setIsActive(true);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
