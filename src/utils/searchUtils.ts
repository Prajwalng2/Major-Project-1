
import { SchemeProps } from "@/components/SchemeCard";
import { supabase } from "@/integrations/supabase/client";

// Helper function to tokenize and normalize text 
const tokenizeText = (text: string): string[] => {
  if (!text) return [];
  
  // Convert to lowercase and remove special characters
  const normalized = text.toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/gi, ' ')
    .trim();
  
  // Split into words and filter out common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
    'about', 'against', 'between', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
    'now'
  ]);
  
  return normalized.split(' ').filter(word => word.length > 1 && !stopWords.has(word));
};

// Calculate similarity score between query and text
const calculateSimilarity = (queryTokens: string[], text: string): number => {
  if (!text || !queryTokens.length) return 0;
  
  const textTokens = tokenizeText(text);
  if (!textTokens.length) return 0;
  
  let matchCount = 0;
  let exactMatchCount = 0;
  
  // Check for exact and partial matches
  queryTokens.forEach(queryToken => {
    // Check for exact match
    if (textTokens.includes(queryToken)) {
      exactMatchCount++;
      return;
    }
    
    // Check for partial matches (beginning of words)
    for (const textToken of textTokens) {
      if (textToken.startsWith(queryToken) || queryToken.startsWith(textToken)) {
        matchCount += 0.5; // Partial match gets half score
        return;
      }
    }
  });
  
  // Calculate score based on matches and text length
  return (exactMatchCount + matchCount) / Math.max(1, queryTokens.length);
};

// Extend SchemeProps interface to include the _score property for search results
interface SchemeSearchResult extends SchemeProps {
  _score: number;
}

// Function to perform semantic search using multiple criteria
export const performSemanticSearch = async (query: string, filters: any = {}): Promise<SchemeProps[]> => {
  try {
    if (!query.trim() && Object.keys(filters).length === 0) {
      // If no query and no filters, return popular schemes
      const { data, error } = await supabase
        .from('schemes')
        .select('*')
        .eq('is_popular', true)
        .limit(50);
        
      if (error) throw error;
      return formatSchemesData(data || []);
    }
    
    // Start building the query
    let supabaseQuery = supabase.from('schemes').select('*');
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      supabaseQuery = supabaseQuery.ilike('category', `%${filters.category}%`);
    }
    
    // Apply state filter
    if (filters.state && filters.state !== 'all') {
      supabaseQuery = supabaseQuery.ilike('state', `%${filters.state}%`);
    }
    
    // Apply active filter
    if (filters.isActive !== undefined) {
      if (filters.isActive) {
        supabaseQuery = supabaseQuery.not('deadline', 'eq', 'Closed');
      } else {
        supabaseQuery = supabaseQuery.eq('deadline', 'Closed');
      }
    }
    
    // If we have a search query, use it for full text search across multiple columns
    if (query.trim()) {
      // Tokenize the query
      const queryTokens = tokenizeText(query);
      
      // If query has meaningful tokens, apply text search
      if (queryTokens.length > 0) {
        // Create search term with all query words
        const searchTerm = `%${queryTokens.join('%')}%`.toLowerCase();
        
        // Build OR conditions for text search across multiple columns
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,` +
          `description.ilike.%${query}%,` +
          `ministry.ilike.%${query}%,` +
          `category.ilike.%${query}%,` +
          `eligibility_text.ilike.%${query}%,` +
          `beneficiaries.ilike.%${query}%,` +
          `objective.ilike.%${query}%`
        );
      }
    }
    
    // Get data from Supabase
    const { data, error } = await supabaseQuery.limit(100); // Get up to 100 results to rank
    
    if (error) throw error;
    
    // Format schemes data
    let schemes = formatSchemesData(data || []) as SchemeSearchResult[];
    
    // If we have a query, re-rank results using semantic similarity
    if (query.trim()) {
      const queryTokens = tokenizeText(query);
      
      // Calculate similarity scores for each scheme
      schemes = schemes.map(scheme => {
        // Calculate scores for different fields
        const titleScore = calculateSimilarity(queryTokens, scheme.title) * 2.0; // Title is most important
        const descriptionScore = calculateSimilarity(queryTokens, scheme.description) * 1.0;
        const ministryScore = calculateSimilarity(queryTokens, scheme.ministry || '') * 0.5;
        const categoryScore = calculateSimilarity(queryTokens, scheme.category) * 0.8;
        const eligibilityScore = calculateSimilarity(queryTokens, 
          typeof scheme.eligibility === 'string' ? scheme.eligibility : scheme.eligibilityText || '') * 0.7;
        
        // Calculate combined score
        const score = titleScore + descriptionScore + ministryScore + categoryScore + eligibilityScore;
        
        return { ...scheme, _score: score };
      });
      
      // Filter out schemes with very low scores
      schemes = schemes.filter(scheme => scheme._score > 0.1);
      
      // Sort by score (highest first)
      schemes = schemes.sort((a, b) => b._score - a._score);
    }
    
    return schemes as SchemeProps[];
  } catch (error) {
    console.error('Error in semantic search:', error);
    return [];
  }
};

// Helper function to format schemes data
const formatSchemesData = (data: any[]): SchemeProps[] => {
  return data.map(item => {
    let formattedEligibility: string | { minAge?: number; maxAge?: number; maxIncome?: number; category?: string[] } = 
      typeof item.eligibility === 'string' ? item.eligibility : 
      (item.eligibility_text || 'All citizens eligible');
    
    // Handle case where eligibility is an object
    if (typeof item.eligibility === 'object' && item.eligibility !== null) {
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
      eligibility: formattedEligibility,
      eligibilityText: item.eligibility_text || ''
    } as SchemeProps;
  });
};

// Update SearchResultsPage to use the semantic search
export const searchSchemes = async (
  query: string, 
  filters: { 
    category?: string; 
    state?: string; 
    isActive?: boolean 
  } = {}
): Promise<SchemeProps[]> => {
  return performSemanticSearch(query, filters);
};
