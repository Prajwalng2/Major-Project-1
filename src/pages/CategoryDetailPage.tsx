
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemeCard from '@/components/SchemeCard';
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import schemes from '@/data/schemes';
import categories from '@/data/categories';
import categorySchemes from '@/data/categorySchemes';

const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  
  const category = categories.find(cat => cat.id === id);
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the category you're looking for.</p>
            <Button asChild>
              <Link to="/categories">Browse All Categories</Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Get category-specific schemes if available, or fallback to filtering from all schemes
  const getCategorySchemes = () => {
    // Check if we have specific schemes for this category
    if (id && categorySchemes[id as keyof typeof categorySchemes]) {
      return categorySchemes[id as keyof typeof categorySchemes];
    }
    
    // Fallback to filtering from all schemes
    return schemes.filter(scheme => 
      scheme.category.toLowerCase().includes(category.title.toLowerCase())
    );
  };
  
  // Get the schemes for this category
  const categorySpecificSchemes = getCategorySchemes();
  
  // Filter schemes based on search and active status
  const filteredSchemes = categorySpecificSchemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = !showOnlyActive || (scheme.deadline && scheme.deadline !== 'Closed');
    
    return matchesSearch && matchesActive;
  });
  
  // Sort schemes based on selected option
  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    if (sortOption === 'newest') {
      const dateA = new Date(a.launchDate || "2000-01-01");
      const dateB = new Date(b.launchDate || "2000-01-01");
      return dateB.getTime() - dateA.getTime();
    } else if (sortOption === 'closing') {
      const dateA = new Date(a.deadline === 'Ongoing' ? "2999-12-31" : a.deadline || "2999-12-31");
      const dateB = new Date(b.deadline === 'Ongoing' ? "2999-12-31" : b.deadline || "2999-12-31");
      return dateA.getTime() - dateB.getTime();
    }
    // Default: recommended (popular first)
    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
  });
  
  // Pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(sortedSchemes.length / itemsPerPage);
  const currentSchemes = sortedSchemes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
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
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setShowOnlyActive(false);
    setSortOption('recommended');
  };
  
  // Update pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, showOnlyActive, sortOption]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Title and Description */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {category.title} Schemes
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Browse all available government schemes under the {category.title} category. These schemes aim to promote {category.title.toLowerCase()} development and provide various benefits and support.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder={`Search ${category.title} schemes...`}
                    className="pl-10"
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
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="closing">Closing Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <Checkbox 
                  id="active-schemes" 
                  checked={showOnlyActive}
                  onCheckedChange={(checked) => setShowOnlyActive(!!checked)}
                />
                <Label htmlFor="active-schemes" className="ml-2 text-sm">
                  Show only active schemes
                </Label>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{filteredSchemes.length} schemes found</span>
                
                {(searchQuery || showOnlyActive || sortOption !== 'recommended') && (
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
          </div>
          
          {/* Results */}
          {currentSchemes.length > 0 ? (
            <>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`page-${currentPage}`}
              >
                {currentSchemes.map((scheme) => (
                  <motion.div key={scheme.id} variants={itemVariants}>
                    <SchemeCard scheme={scheme} />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;
                        
                        // Show limited pages for better UI
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                isActive={currentPage === page}
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page 
                                  ? "bg-scheme-primary text-white hover:bg-scheme-primary/90" 
                                  : ""}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Add ellipsis
                        if (
                          (page === 2 && currentPage > 3) || 
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)} 
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No schemes found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
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

export default CategoryDetailPage;
