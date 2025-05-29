
import { SchemeProps } from '@/components/SchemeCard';
import enhancedSchemes from '@/data/enhancedSchemes';

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  category?: string;
  income?: number;
  annualIncome?: number;
  occupation?: string;
  state?: string;
  education?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  disability?: boolean;
  landOwnership?: boolean;
  businessType?: string;
  employmentStatus?: 'employed' | 'unemployed' | 'self-employed' | 'student' | 'retired';
  interests?: string[];
  bplCardHolder?: boolean;
  farmingLand?: number;
}

export interface MatchingFactor {
  factor: string;
  description: string;
  weight: number;
}

export interface MatchedScheme {
  scheme: SchemeProps;
  score: number;
  matchingFactors: MatchingFactor[];
}

// Enhanced scoring weights for realistic relevancy
const SCORING_WEIGHTS = {
  EXACT_MATCH: 25,
  HIGH_RELEVANCE: 20,
  MODERATE_RELEVANCE: 15,
  LOW_RELEVANCE: 10,
  BONUS_FACTORS: 8,
  BASE_SCORE: 40
};

// Enhanced keyword mapping for better category matching
const categoryKeywords = {
  "Digital India": ["digital", "technology", "online", "internet", "e-governance", "cyber", "IT", "software", "tech", "innovation", "startup", "digital literacy", "broadband", "connectivity", "electronic", "computer", "mobile", "app", "website", "artificial intelligence", "AI", "data", "cloud"],
  "Agriculture": ["agriculture", "farming", "farmer", "crop", "irrigation", "soil", "seed", "fertilizer", "organic", "livestock", "dairy", "fisheries", "horticulture", "rural", "agricultural", "farm", "cultivation", "harvest", "precision farming", "climate resilient"],
  "Agriculture & Farming": ["agriculture", "farming", "farmer", "crop", "irrigation", "soil", "seed", "fertilizer", "organic", "livestock", "dairy", "fisheries", "horticulture", "rural", "agricultural", "farm", "cultivation", "harvest", "precision farming", "climate resilient"],
  "Entrepreneurship": ["business", "startup", "entrepreneur", "MSME", "loan", "credit", "enterprise", "self-employed", "trade", "commerce", "industry", "innovation", "incubation", "venture", "business development", "funding", "investment", "market access"],
  "Education": ["education", "student", "scholarship", "school", "college", "university", "research", "academic", "learning", "training", "skill", "degree", "diploma", "study", "educational", "digital education", "vocational"],
  "Health": ["health", "medical", "hospital", "treatment", "insurance", "medicine", "healthcare", "wellness", "nutrition", "maternal", "child", "vaccination", "clinic", "Ayushman", "medical care"],
  "Housing": ["housing", "home", "construction", "shelter", "accommodation", "property", "residential", "urban", "rural housing", "slum", "affordable housing", "house", "PMAY"],
  "Employment": ["employment", "job", "work", "career", "unemployment", "placement", "training", "apprenticeship", "internship", "vocational", "job creation", "skill development"],
  "Social Welfare": ["welfare", "pension", "disability", "elderly", "women", "child", "widow", "minority", "tribal", "SC", "ST", "OBC", "BPL", "social security", "empowerment"],
  "Skill Development": ["skill", "training", "development", "capacity building", "vocational", "technical", "professional", "certification", "upskilling", "reskilling", "PMKVY"],
  "Finance": ["finance", "loan", "credit", "banking", "insurance", "investment", "subsidy", "grant", "financial assistance", "micro credit", "financial", "MUDRA", "Jan Dhan"]
};

// Occupation-based relevance mapping
const occupationRelevance = {
  "farmer": ["Agriculture", "Agriculture & Farming"],
  "student": ["Education", "Skill Development"],
  "entrepreneur": ["Entrepreneurship", "Digital India"],
  "teacher": ["Education", "Skill Development"],
  "software engineer": ["Digital India", "Entrepreneurship"],
  "doctor": ["Health", "Education"],
  "unemployed": ["Employment", "Skill Development", "Entrepreneurship"],
  "self-employed": ["Entrepreneurship", "Finance"],
  "business owner": ["Entrepreneurship", "Finance", "Digital India"]
};

// Enhanced scheme matching algorithm with realistic scoring
export function matchSchemesToUser(userProfile: UserProfile): MatchedScheme[] {
  console.log('Advanced Scheme Matching - User Profile:', userProfile);
  console.log('Total schemes in database:', enhancedSchemes.length);
  
  if (enhancedSchemes.length === 0) {
    console.error('No schemes found in database!');
    return [];
  }
  
  const matches: MatchedScheme[] = enhancedSchemes.map(scheme => {
    let score = SCORING_WEIGHTS.BASE_SCORE;
    const matchingFactors: MatchingFactor[] = [];
    
    // Income-based matching with realistic scoring
    const userIncome = userProfile.annualIncome || userProfile.income;
    if (userIncome && scheme.eligibility && typeof scheme.eligibility === 'object') {
      const eligibility = scheme.eligibility as any;
      if (eligibility.income?.max && userIncome <= eligibility.income.max) {
        score += SCORING_WEIGHTS.EXACT_MATCH;
        matchingFactors.push({
          factor: "Income Eligibility",
          description: `Your annual income ₹${userIncome.toLocaleString()} qualifies for this scheme`,
          weight: SCORING_WEIGHTS.EXACT_MATCH
        });
      } else if (eligibility.maxIncome && userIncome <= eligibility.maxIncome) {
        score += SCORING_WEIGHTS.HIGH_RELEVANCE;
        matchingFactors.push({
          factor: "Income Range",
          description: `Income requirement satisfied`,
          weight: SCORING_WEIGHTS.HIGH_RELEVANCE
        });
      }
    }
    
    // Age-based matching with range consideration
    if (userProfile.age && scheme.eligibility && typeof scheme.eligibility === 'object') {
      const eligibility = scheme.eligibility as any;
      
      if (eligibility.ageRange) {
        const { min, max } = eligibility.ageRange;
        if (userProfile.age >= (min || 0) && userProfile.age <= (max || 100)) {
          score += SCORING_WEIGHTS.EXACT_MATCH;
          matchingFactors.push({
            factor: "Perfect Age Match",
            description: `Your age ${userProfile.age} falls within the eligible range (${min || 0}-${max || 100} years)`,
            weight: SCORING_WEIGHTS.EXACT_MATCH
          });
        }
      } else {
        // Fallback to individual min/max age checks
        if (eligibility.minAge && userProfile.age >= eligibility.minAge) {
          score += SCORING_WEIGHTS.MODERATE_RELEVANCE;
          matchingFactors.push({
            factor: "Age Eligibility",
            description: `Meets minimum age requirement of ${eligibility.minAge} years`,
            weight: SCORING_WEIGHTS.MODERATE_RELEVANCE
          });
        }
        if (eligibility.maxAge && userProfile.age <= eligibility.maxAge) {
          score += SCORING_WEIGHTS.MODERATE_RELEVANCE;
        }
      }
    }
    
    // Gender matching with inclusive consideration
    if (userProfile.gender && scheme.eligibility && typeof scheme.eligibility === 'object') {
      const eligibility = scheme.eligibility as any;
      if (eligibility.gender) {
        if (eligibility.gender === 'all' || eligibility.gender.includes(userProfile.gender)) {
          score += SCORING_WEIGHTS.HIGH_RELEVANCE;
          matchingFactors.push({
            factor: "Gender Eligibility",
            description: `Available for ${userProfile.gender} applicants`,
            weight: SCORING_WEIGHTS.HIGH_RELEVANCE
          });
        }
      }
    }
    
    // Category/Caste matching
    if (userProfile.category && scheme.eligibility && typeof scheme.eligibility === 'object') {
      const eligibility = scheme.eligibility as any;
      if (eligibility.category && Array.isArray(eligibility.category)) {
        if (eligibility.category.includes(userProfile.category) || eligibility.category.includes("General")) {
          score += SCORING_WEIGHTS.HIGH_RELEVANCE;
          matchingFactors.push({
            factor: "Category Match",
            description: `Eligible for ${userProfile.category} category`,
            weight: SCORING_WEIGHTS.HIGH_RELEVANCE
          });
        }
      }
    }
    
    // State preference with enhanced logic
    if (userProfile.state) {
      const normalizedUserState = userProfile.state.toLowerCase();
      const normalizedSchemeState = scheme.state?.toLowerCase();
      
      if (normalizedSchemeState === normalizedUserState) {
        score += SCORING_WEIGHTS.EXACT_MATCH;
        matchingFactors.push({
          factor: "State Specific Scheme",
          description: `Exclusive ${userProfile.state} state scheme`,
          weight: SCORING_WEIGHTS.EXACT_MATCH
        });
      } else if (!scheme.state || scheme.state === 'All States' || normalizedSchemeState === 'all states') {
        score += SCORING_WEIGHTS.MODERATE_RELEVANCE;
        matchingFactors.push({
          factor: "Pan India Scheme",
          description: "Available across all Indian states",
          weight: SCORING_WEIGHTS.MODERATE_RELEVANCE
        });
      }
    }
    
    // Occupation relevance with enhanced matching
    if (userProfile.occupation) {
      const occupation = userProfile.occupation.toLowerCase();
      const relevantCategories = occupationRelevance[occupation] || [];
      
      if (relevantCategories.includes(scheme.category)) {
        score += SCORING_WEIGHTS.EXACT_MATCH;
        matchingFactors.push({
          factor: "Perfect Occupation Match",
          description: `Highly relevant for ${userProfile.occupation}`,
          weight: SCORING_WEIGHTS.EXACT_MATCH
        });
      } else {
        // Check for keyword matches in scheme content
        const schemeText = `${scheme.title} ${scheme.description}`.toLowerCase();
        const occupationKeywords = occupation.split(' ');
        
        const keywordMatches = occupationKeywords.filter(keyword => 
          keyword.length > 3 && schemeText.includes(keyword)
        );
        
        if (keywordMatches.length > 0) {
          score += SCORING_WEIGHTS.MODERATE_RELEVANCE;
          matchingFactors.push({
            factor: "Occupation Relevance",
            description: `Related to your occupation field`,
            weight: SCORING_WEIGHTS.MODERATE_RELEVANCE
          });
        }
      }
    }
    
    // Employment status matching
    if (userProfile.employmentStatus) {
      const statusKeywords = {
        'unemployed': ['unemployment', 'employment generation', 'job creation', 'employment', 'PMEGP'],
        'self-employed': ['self-employed', 'entrepreneur', 'business', 'MSME', 'MUDRA'],
        'student': ['student', 'education', 'scholarship', 'academic', 'skill development'],
        'employed': ['skill development', 'training', 'professional development', 'upskilling'],
        'retired': ['pension', 'senior citizen', 'elderly', 'social security']
      };
      
      const relevantKeywords = statusKeywords[userProfile.employmentStatus] || [];
      const schemeText = `${scheme.title} ${scheme.description}`.toLowerCase();
      
      const matchingKeywords = relevantKeywords.filter(keyword => schemeText.includes(keyword));
      if (matchingKeywords.length > 0) {
        const relevanceScore = Math.min(matchingKeywords.length * 8, SCORING_WEIGHTS.HIGH_RELEVANCE);
        score += relevanceScore;
        matchingFactors.push({
          factor: "Employment Status Match",
          description: `Designed for ${userProfile.employmentStatus} individuals`,
          weight: relevanceScore
        });
      }
    }
    
    // Interest-based matching with weighted scoring
    if (userProfile.interests && userProfile.interests.length > 0) {
      const schemeText = `${scheme.title} ${scheme.description} ${scheme.category}`.toLowerCase();
      let interestMatches = 0;
      
      userProfile.interests.forEach(interest => {
        if (schemeText.includes(interest.toLowerCase())) {
          interestMatches++;
        }
      });
      
      if (interestMatches > 0) {
        const interestScore = Math.min(interestMatches * 10, SCORING_WEIGHTS.HIGH_RELEVANCE);
        score += interestScore;
        matchingFactors.push({
          factor: "Interest Alignment",
          description: `Matches ${interestMatches} of your interests`,
          weight: interestScore
        });
      }
    }
    
    // Special eligibility bonuses
    if (userProfile.bplCardHolder) {
      const schemeText = `${scheme.title} ${scheme.description}`.toLowerCase();
      if (schemeText.includes('bpl') || schemeText.includes('below poverty') || schemeText.includes('poor')) {
        score += SCORING_WEIGHTS.HIGH_RELEVANCE;
        matchingFactors.push({
          factor: "BPL Priority",
          description: "Special provisions for BPL families",
          weight: SCORING_WEIGHTS.HIGH_RELEVANCE
        });
      }
    }
    
    // Farming-specific bonuses
    if (userProfile.farmingLand && userProfile.farmingLand > 0) {
      if (scheme.category === 'Agriculture' || scheme.category === 'Agriculture & Farming') {
        const landBonus = userProfile.farmingLand > 5 ? SCORING_WEIGHTS.EXACT_MATCH : SCORING_WEIGHTS.HIGH_RELEVANCE;
        score += landBonus;
        matchingFactors.push({
          factor: "Farming Land Ownership",
          description: `Beneficial for farmers with ${userProfile.farmingLand} acres`,
          weight: landBonus
        });
      }
    }
    
    // Disability considerations
    if (userProfile.disability) {
      const schemeText = `${scheme.title} ${scheme.description}`.toLowerCase();
      if (schemeText.includes('disability') || schemeText.includes('divyang') || schemeText.includes('handicap')) {
        score += SCORING_WEIGHTS.HIGH_RELEVANCE;
        matchingFactors.push({
          factor: "Disability Support",
          description: "Special provisions for persons with disabilities",
          weight: SCORING_WEIGHTS.HIGH_RELEVANCE
        });
      }
    }
    
    // Category keyword matching with enhanced logic
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (scheme.category === category) {
        const schemeText = `${scheme.title} ${scheme.description} ${scheme.tags?.join(' ') || ''}`.toLowerCase();
        const matchingKeywords = keywords.filter(keyword => schemeText.includes(keyword));
        
        if (matchingKeywords.length > 0) {
          const keywordScore = Math.min(matchingKeywords.length * 3, SCORING_WEIGHTS.MODERATE_RELEVANCE);
          score += keywordScore;
          if (keywordScore >= SCORING_WEIGHTS.LOW_RELEVANCE) {
            matchingFactors.push({
              factor: "Sector Relevance",
              description: `Strong alignment with ${category} sector`,
              weight: keywordScore
            });
          }
        }
      }
    });
    
    // Popular scheme bonus (reduced weight for realism)
    if (scheme.isPopular) {
      score += SCORING_WEIGHTS.BONUS_FACTORS;
      matchingFactors.push({
        factor: "Popular Scheme",
        description: "High adoption rate and success stories",
        weight: SCORING_WEIGHTS.BONUS_FACTORS
      });
    }
    
    // Recent schemes bonus
    if (scheme.launchDate) {
      const launchYear = parseInt(scheme.launchDate);
      const currentYear = new Date().getFullYear();
      if (launchYear >= currentYear - 3) {
        score += SCORING_WEIGHTS.BONUS_FACTORS;
        matchingFactors.push({
          factor: "Recent Initiative",
          description: "Recently launched scheme with modern benefits",
          weight: SCORING_WEIGHTS.BONUS_FACTORS
        });
      }
    }
    
    // Normalize score to realistic range (60-95%)
    const normalizedScore = Math.min(Math.max(score, 60), 95);
    
    // Ensure top matches get higher scores
    if (matchingFactors.length >= 4) {
      const finalScore = Math.min(normalizedScore + 5, 95);
      return {
        scheme,
        score: finalScore,
        matchingFactors: matchingFactors.slice(0, 6).sort((a, b) => b.weight - a.weight)
      };
    }
    
    return {
      scheme,
      score: normalizedScore,
      matchingFactors: matchingFactors.slice(0, 5).sort((a, b) => b.weight - a.weight)
    };
  });
  
  // Sort by score and apply final adjustments
  const sortedMatches = matches
    .sort((a, b) => b.score - a.score)
    .map((match, index) => {
      // Slight boost for top 10 matches to create clear hierarchy
      if (index < 10 && match.score < 90) {
        match.score = Math.min(match.score + (10 - index), 95);
      }
      return match;
    });
  
  console.log('Enhanced matching results:', {
    totalSchemes: enhancedSchemes.length,
    processedMatches: sortedMatches.length,
    topScores: sortedMatches.slice(0, 15).map(m => ({ 
      title: m.scheme.title, 
      score: m.score,
      factors: m.matchingFactors.length
    })),
    averageScore: Math.round(sortedMatches.reduce((acc, m) => acc + m.score, 0) / sortedMatches.length)
  });
  
  return sortedMatches;
}

// Enhanced search function with improved scoring
export function searchSchemes(query: string, limit: number = 50): MatchedScheme[] {
  if (!query.trim()) {
    return enhancedSchemes.slice(0, limit).map(scheme => ({
      scheme,
      score: 75,
      matchingFactors: [
        {
          factor: "Available Scheme",
          description: "Open for eligible applicants",
          weight: 75
        }
      ]
    }));
  }
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  const matches = enhancedSchemes.map(scheme => {
    let score = 0;
    const matchingFactors: MatchingFactor[] = [];
    
    const searchableText = `${scheme.title} ${scheme.description} ${scheme.category} ${scheme.ministry} ${scheme.tags?.join(' ') || ''}`.toLowerCase();
    
    // Title matching gets highest weight
    const titleMatches = searchTerms.filter(term => scheme.title.toLowerCase().includes(term));
    if (titleMatches.length > 0) {
      score += titleMatches.length * 25;
      matchingFactors.push({
        factor: "Title Match",
        description: `Title contains "${titleMatches.join(', ')}"`,
        weight: titleMatches.length * 25
      });
    }
    
    // Description matching
    const descriptionMatches = searchTerms.filter(term => scheme.description.toLowerCase().includes(term));
    if (descriptionMatches.length > 0) {
      score += descriptionMatches.length * 15;
      matchingFactors.push({
        factor: "Description Match",
        description: `Description relevant to search terms`,
        weight: descriptionMatches.length * 15
      });
    }
    
    // Category and tag matching
    searchTerms.forEach(term => {
      if (scheme.category.toLowerCase().includes(term)) {
        score += 20;
      }
      if (scheme.tags?.some(tag => tag.toLowerCase().includes(term))) {
        score += 10;
      }
    });
    
    if (score > 0) {
      score = Math.max(score, 70);
      score = Math.min(score, 95);
    }
    
    return {
      scheme,
      score,
      matchingFactors: matchingFactors.slice(0, 3)
    };
  });
  
  return matches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default enhancedSchemes;
