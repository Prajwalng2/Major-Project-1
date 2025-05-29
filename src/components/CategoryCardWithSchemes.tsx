
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  ChevronRight, Book, Briefcase, Building, BookOpen, Home, Heart, 
  Users, User, GraduationCap, MonitorSmartphone, Lightbulb, 
  Filter, Search, List
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import SchemeCardCompact from './SchemeCardCompact';
import { motion } from 'framer-motion';
import { CategoryProps } from './CategoryCard';
import { SchemeProps } from './SchemeCard';
import { getSchemesForCategory } from '@/utils/schemeDataService';

// Map category IDs to Lucide icons - using only allowed icons from lucide-react
const iconMap: Record<string, React.ElementType> = {
  agriculture: List,
  education: List,
  health: List,
  finance: List,
  housing: List,
  social: List,
  employment: List,
  women: List,
  scholarship: List,
  digital: List,
  industry: List,
  skills: List,
  rural: List,
  power: List,
  tribal: List,
  science: List,
  environment: List,
  water: List,
  legal: List,
  art: List,
  sports: List,
  tourism: List,
  urban: List,
  disability: List,
  startup: List,
  bank: List,
  pension: List,
  transport: List,
  telecom: List,
  food: List,
  insurance: List,
  railway: List,
  sme: List,
  heritage: List,
  medical: List,
  ai: List
};

interface CategoryCardWithSchemesProps extends CategoryProps {
  expanded?: boolean;
}

const CategoryCardWithSchemes: React.FC<CategoryCardWithSchemesProps> = ({ 
  id, 
  title, 
  count, 
  icon, 
  expanded = false 
}) => {
  const [categorySchemes, setCategorySchemes] = useState<SchemeProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load schemes when expanded or on mount
    if (expanded || !isLoading) {
      const fetchCategorySchemes = async () => {
        try {
          const schemes = await getSchemesForCategory(id);
          setCategorySchemes(schemes.slice(0, 3)); // Limit to top 3
        } catch (error) {
          console.error(`Error loading schemes for category ${id}:`, error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCategorySchemes();
    }
  }, [expanded, id, isLoading]);

  // Get the correct icon component based on category ID
  const IconComponent = iconMap[id] || Search; // Default to Search icon if not found

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      <CardContent className="p-3 sm:p-5 flex-grow">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-scheme-primary/10 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
            <IconComponent size={18} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base md:text-lg truncate">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{count} schemes</p>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-2 sm:mt-3 md:mt-4">
            <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Popular Schemes</h4>
            {isLoading ? (
              <div className="text-center py-3">
                <div className="w-6 h-6 border-2 border-t-scheme-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin inline-block"></div>
                <p className="text-xs text-gray-500 mt-1">Loading schemes...</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {categorySchemes.length > 0 ? (
                  categorySchemes.map((scheme) => (
                    <motion.div 
                      key={scheme.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SchemeCardCompact scheme={scheme} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    <Filter className="h-5 w-5 mx-auto mb-1 opacity-50" />
                    <p>No schemes found in this category</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-3 sm:px-5 py-2 sm:py-3 bg-gray-50">
        <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs sm:text-sm hover:bg-scheme-primary/10 hover:text-scheme-primary">
          <Link to={`/categories/${id}`}>
            View All Schemes
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCardWithSchemes;
