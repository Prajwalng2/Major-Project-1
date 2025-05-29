import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCardWithSchemes from '@/components/CategoryCardWithSchemes';
import categories from '@/data/categories';
import { Input } from "@/components/ui/input";
import { Search, Filter, XCircle, Grid3X3, LayoutList, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SchemeCardCompact from '@/components/SchemeCardCompact';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSchemesForCategory } from '@/utils/schemeDataService';
import { SchemeProps } from '@/components/SchemeCard';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categorySchemes, setCategorySchemes] = useState<Record<string, SchemeProps[]>>({});
  
  // Load schemes data for each expanded category
  useEffect(() => {
    const loadSchemesForCategory = async (categoryId: string) => {
      if (expandedCategories.includes(categoryId) && !categorySchemes[categoryId]) {
        try {
          const schemes = await getSchemesForCategory(categoryId);
          setCategorySchemes(prev => ({
            ...prev,
            [categoryId]: schemes
          }));
        } catch (error) {
          console.error(`Error loading schemes for category ${categoryId}:`, error);
        }
      }
    };

    // Initially expand some categories to show schemes
    if (expandedCategories.length === 0) {
      const initialExpanded = categories.slice(0, 3).map(cat => cat.id);
      setExpandedCategories(initialExpanded);
      
      // Load schemes for initially expanded categories
      initialExpanded.forEach(categoryId => {
        loadSchemesForCategory(categoryId);
      });
    }
    
    // Load schemes for newly expanded categories
    expandedCategories.forEach(categoryId => {
      loadSchemesForCategory(categoryId);
    });
  }, [expandedCategories, categorySchemes]);
  
  const sortCategories = (cats: typeof categories) => {
    switch (sortBy) {
      case 'alphabetical':
        return [...cats].sort((a, b) => a.title.localeCompare(b.title));
      case 'schemes':
        return [...cats].sort((a, b) => b.count - a.count);
      default:
        return cats;
    }
  };
  
  const filteredCategories = sortCategories(
    categories.filter(category =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-scheme-primary to-scheme-accent">Browse by Category</span>
              <div className="absolute left-0 -bottom-2 w-24 h-1 bg-scheme-primary rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-6 max-w-2xl">
              Find government schemes organized by different categories to easily discover what's relevant for you.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  className="pl-10 pr-10 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>
              
              <div className="w-full md:w-64">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="schemes">Number of Schemes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? "default" : "outline"} 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? "bg-scheme-primary hover:bg-scheme-primary/90" : ""}
                >
                  <Grid3X3 size={18} />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? "default" : "outline"} 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? "bg-scheme-primary hover:bg-scheme-primary/90" : ""}
                >
                  <LayoutList size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {filteredCategories.length > 0 ? (
            <motion.div 
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCategories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  {viewMode === 'grid' ? (
                    <CategoryCardWithSchemes 
                      {...category} 
                      expanded={expandedCategories.includes(category.id)}
                    />
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-scheme-primary/10 flex items-center justify-center mr-4">
                            {React.createElement(category.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.title}</h3>
                            <p className="text-sm text-gray-500">{category.count} schemes</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCategoryExpansion(category.id)}
                          >
                            {expandedCategories.includes(category.id) ? "Hide Schemes" : "Show Schemes"}
                          </Button>
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm" 
                            className="border-scheme-primary text-scheme-primary hover:bg-scheme-primary/10"
                          >
                            <Link to={`/categories/${category.id}`}>
                              View All
                              <ChevronRight size={14} className="ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      {expandedCategories.includes(category.id) && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t"
                        >
                          <h4 className="text-sm font-medium mb-3">Popular Schemes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(categorySchemes[category.id] || []).map((scheme) => (
                              <SchemeCardCompact key={scheme.id} scheme={scheme} />
                            ))}
                            
                            {(!categorySchemes[category.id] || categorySchemes[category.id].length === 0) && (
                              <div className="col-span-full text-center py-4 text-gray-500">
                                <p>Loading schemes...</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <Filter size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No categories found matching your search.</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="border-scheme-primary text-scheme-primary hover:bg-scheme-primary/10"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
