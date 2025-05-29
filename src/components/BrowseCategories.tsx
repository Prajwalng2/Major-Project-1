
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CategoryCardWithSchemes from './CategoryCardWithSchemes';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCategoriesWithSchemeCount, getCategorySchemesWithLimit } from '@/utils/categorySchemeManager';

const BrowseCategories = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Get categories with their scheme counts
  const categoriesWithCounts = getCategoriesWithSchemeCount();
  
  // Display limited categories initially
  const displayedCategories = categoriesWithCounts.slice(0, visibleCount);
  
  // Expand some categories automatically for demonstration
  useEffect(() => {
    // Expand first 2 categories to show schemes (better for mobile)
    const initialExpanded = displayedCategories.slice(0, 2).map(cat => cat.id);
    setExpandedCategories(initialExpanded);
  }, []);
  
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

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, categoriesWithCounts.length));
    
    // Expand the newly added categories
    const newlyAdded = categoriesWithCounts.slice(visibleCount, visibleCount + 6);
    setExpandedCategories(prev => [...prev, ...newlyAdded.slice(0, 2).map(cat => cat.id)]);
  };
  
  return (
    <div className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-scheme-primary to-scheme-accent">Browse by Category</span>
            <div className="absolute left-1/2 -bottom-2 w-16 md:w-24 h-1 bg-scheme-primary transform -translate-x-1/2 rounded-full"></div>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mt-4">
            Find government schemes by category to narrow down your search and discover the most relevant opportunities for you.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 category-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayedCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <CategoryCardWithSchemes 
                {...category} 
                expanded={expandedCategories.includes(category.id)} 
              />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-8 md:mt-12">
          {visibleCount < categoriesWithCounts.length ? (
            <Button 
              onClick={loadMore} 
              variant="outline" 
              size="lg" 
              className="hover-grow border-scheme-primary text-scheme-primary hover:bg-scheme-primary/10 text-sm md:text-base"
            >
              Load More Categories
              <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="hover-grow text-sm md:text-base">
              <Link to="/categories">
                View All Categories
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCategories;
