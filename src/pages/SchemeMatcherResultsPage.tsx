
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemeMatcherResults from '@/components/SchemeMatcherResults';
import { searchSchemes } from '@/utils/schemeDataService';
import { SchemeProps } from '@/components/SchemeCard';
import { toast } from 'sonner';

const SchemeMatcherResultsPage = () => {
  const location = useLocation();
  const [matchedSchemes, setMatchedSchemes] = useState<SchemeProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get form data from location state and process it immediately
  useEffect(() => {
    const formData = location.state?.formData;
    if (formData) {
      // Use immediately invoked function for faster processing
      (async () => {
        await loadMatchedSchemes(formData);
      })();
    } else {
      setIsLoading(false);
    }
  }, [location.state]);

  const loadMatchedSchemes = async (formData: any) => {
    setIsLoading(true);
    try {
      // Build filters based on form data
      const filters: { category?: string; state?: string } = {};
      
      if (formData.category) {
        filters.category = formData.category;
      }
      
      if (formData.state) {
        filters.state = formData.state;
      }
      
      // Performance measurement start
      const startTime = performance.now();
      
      // Search for schemes matching the criteria - direct processing for speed
      const schemes = await searchSchemes('', filters);
      
      // Apply optimized filtering algorithm
      const filteredSchemes = filterSchemesOptimized(schemes, formData);
      
      // Update state
      setMatchedSchemes(filteredSchemes);
      setIsLoading(false);
      
      // Performance measurement end
      const processingTime = performance.now() - startTime;
      console.log(`Scheme matching completed in ${processingTime.toFixed(2)}ms`);
      
      // Show toast indicating the number of matches found
      toast.success(`Found ${filteredSchemes.length} matching schemes for you in ${processingTime.toFixed(0)}ms!`);
    } catch (error) {
      console.error("Error loading matched schemes:", error);
      toast.error("Failed to load matching schemes. Please try again.");
      setIsLoading(false);
    }
  };

  // Ultra-optimized filtering function with faster execution
  const filterSchemesOptimized = (schemes: SchemeProps[], formData: any) => {
    // Pre-compute conditions for faster checks
    const hasAge = typeof formData.age === 'number';
    const hasIncome = typeof formData.income === 'number';
    const hasGender = typeof formData.gender === 'string';
    
    // Use faster array methods for performance
    return schemes.filter(scheme => {
      // Skip complex checks if eligibility is just a string
      if (!scheme.eligibility || typeof scheme.eligibility === 'string') {
        return true; // Keep scheme if no structured eligibility data
      }
      
      const eligibility = scheme.eligibility as any;
      
      // Fast path checks with short-circuit evaluation
      if (hasAge && 
          ((eligibility.minAge && formData.age < eligibility.minAge) || 
           (eligibility.maxAge && formData.age > eligibility.maxAge))) {
        return false;
      }
      
      // Income check with fast path
      if (hasIncome && 
          eligibility.maxIncome && 
          formData.income > eligibility.maxIncome) {
        return false;
      }
      
      // Gender check - only if both are specified
      if (hasGender && 
          eligibility.gender && 
          eligibility.gender !== 'all' && 
          !eligibility.gender.includes(formData.gender)) {
        return false;
      }
      
      return true; // Include the scheme if it passes all checks
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-6 bg-gray-50">
        <SchemeMatcherResults />
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemeMatcherResultsPage;
