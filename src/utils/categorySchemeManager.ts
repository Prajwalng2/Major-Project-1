
import schemes from '@/data/schemes';
import { CategoryProps } from '@/components/CategoryCard';
import { SchemeProps } from '@/components/SchemeCard';

// Define categories with their titles and icons
const categories: CategoryProps[] = [
  { id: 'agriculture', title: 'Agriculture & Rural', count: 0, icon: 'agriculture' },
  { id: 'education', title: 'Education & Learning', count: 0, icon: 'education' },
  { id: 'health', title: 'Health & Wellness', count: 0, icon: 'health' },
  { id: 'finance', title: 'Financial Services', count: 0, icon: 'finance' },
  { id: 'housing', title: 'Housing & Urban', count: 0, icon: 'housing' },
  { id: 'social', title: 'Social Welfare', count: 0, icon: 'social' },
  { id: 'employment', title: 'Jobs & Skills', count: 0, icon: 'employment' },
  { id: 'women', title: 'Women & Child', count: 0, icon: 'women' },
  { id: 'scholarship', title: 'Scholarships', count: 0, icon: 'scholarship' },
  { id: 'digital', title: 'Digital India', count: 0, icon: 'digital' },
  { id: 'industry', title: 'Industry & Business', count: 0, icon: 'industry' },
  { id: 'skills', title: 'Skill Development', count: 0, icon: 'skills' }
];

// Get categories with their scheme count
export const getCategoriesWithSchemeCount = (): CategoryProps[] => {
  return categories.map(category => {
    // Count schemes in this category
    const count = schemes.filter(scheme => {
      // Direct category match
      if (scheme.category === category.id) return true;
      
      // For 'women' category, check eligibility criteria if it's an object
      if (category.id === 'women' && scheme.eligibility && 
          typeof scheme.eligibility !== 'string' &&
          scheme.eligibility.gender && 
          scheme.eligibility.gender.includes('female')) {
        return true;
      }
      
      return false;
    }).length;
    
    return { ...category, count };
  }).sort((a, b) => b.count - a.count); // Sort by count in descending order
};

// Get schemes for a specific category with a limit
export const getCategorySchemesWithLimit = (categoryId: string, limit: number): SchemeProps[] => {
  let filteredSchemes: SchemeProps[];
  
  if (categoryId === 'women') {
    // Special case for women category
    filteredSchemes = schemes.filter(scheme => 
      scheme.eligibility && 
      typeof scheme.eligibility !== 'string' &&
      scheme.eligibility.gender && 
      scheme.eligibility.gender.includes('female')
    );
  } else {
    // Normal category filtering
    filteredSchemes = schemes.filter(scheme => scheme.category === categoryId);
  }
  
  // Sort by popularity and limit
  return filteredSchemes
    .sort((a, b) => (a.isPopular === b.isPopular) ? 0 : a.isPopular ? -1 : 1)
    .slice(0, limit);
};
