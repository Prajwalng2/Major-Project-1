import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SchemeCard from "@/components/SchemeCard";
import { matchSchemesToUser, UserProfile, MatchedScheme } from "@/utils/schemeMatcher";

const SchemeMatcherResults = () => {
  const navigate = useNavigate();
  const [matchedSchemes, setMatchedSchemes] = useState<MatchedScheme[]>([]);
  const [displayedSchemes, setDisplayedSchemes] = useState<MatchedScheme[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const categories = ["all", "Agriculture", "Agriculture & Farming", "Education", "Health", "Finance", "Housing", "Social Welfare", 
                     "Employment", "Digital India", "Entrepreneurship", "Skill Development"];
  
  useEffect(() => {
    const startTime = performance.now();
    
    const storedData = sessionStorage.getItem("schemeMatcherData");
    
    if (!storedData) {
      navigate("/scheme-matcher");
      return;
    }
    
    try {
      const userData = JSON.parse(storedData) as UserProfile;
      
      // Transform the data to match our UserProfile interface
      const transformedUserData: UserProfile = {
        ...userData,
        income: userData.annualIncome || userData.income, // Use annualIncome as primary
      };
      
      setUserProfile(transformedUserData);
      
      console.log("Processing user profile:", transformedUserData);
      
      const processMatches = () => {
        try {
          const matched = matchSchemesToUser(transformedUserData);
          
          console.log(`Matching completed with ${matched.length} results`);
          
          setMatchedSchemes(matched);
          setDisplayedSchemes(matched);
          setIsLoading(false);
          
          const elapsed = performance.now() - startTime;
          console.log(`Matching completed in ${elapsed.toFixed(2)}ms`);
        } catch (error) {
          console.error("Error in scheme matching:", error);
          setIsLoading(false);
        }
      };
      
      processMatches();
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/scheme-matcher");
    }
  }, [navigate]);
  
  useEffect(() => {
    if (matchedSchemes.length === 0) return;
    
    const filterStartTime = performance.now();
    
    const applyFilters = () => {
      let filtered = [...matchedSchemes];
      
      if (categoryFilter !== "all") {
        filtered = filtered.filter(item => item.scheme.category === categoryFilter);
      }
      
      if (sortOption === "newest") {
        filtered = filtered.sort((a, b) => {
          const dateA = a.scheme.launchDate ? new Date(a.scheme.launchDate).getTime() : 0;
          const dateB = b.scheme.launchDate ? new Date(b.scheme.launchDate).getTime() : 0;
          return dateB - dateA;
        });
      } else if (sortOption === "deadline") {
        filtered = filtered.sort((a, b) => {
          const dateA = a.scheme.deadline ? new Date(a.scheme.deadline).getTime() : 9999999999999;
          const dateB = b.scheme.deadline ? new Date(b.scheme.deadline).getTime() : 9999999999999;
          return dateA - dateB;
        });
      }
      
      setDisplayedSchemes(filtered);
      console.log(`Filter/sort completed in ${performance.now() - filterStartTime}ms`);
    };
    
    applyFilters();
  }, [matchedSchemes, sortOption, categoryFilter]);
  
  const handleBack = () => {
    navigate("/scheme-matcher");
  };

  const handleFindMoreSchemes = () => {
    navigate("/scheme-matcher");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-scheme-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-scheme-primary mb-2">Finding Perfect Schemes For You</h2>
          <p className="text-gray-600">Analyzing your profile to match you with the most relevant government schemes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-2 pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-scheme-primary">
            Your Personalized Scheme Matches
          </h1>
          <p className="text-gray-600 mt-1">
            Found {displayedSchemes.length} schemes matching your profile
            {displayedSchemes.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-green-600">
                (Best match: {displayedSchemes[0]?.score}% relevance)
              </span>
            )}
          </p>
          {userProfile && (
            <div className="mt-2 text-sm text-gray-500">
              Profile: {userProfile.gender ? `${userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)}` : 'Gender not specified'}, 
              Age: {userProfile.age || 'Not specified'}, 
              Income: {userProfile.annualIncome ? `₹${userProfile.annualIncome.toLocaleString()}` : 'Not specified'},
              State: {userProfile.state || 'Not specified'}
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={handleFindMoreSchemes}
            className="whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Refine Search
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center w-full md:w-auto">
            <SlidersHorizontal className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium">Refine Results</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="deadline">Upcoming Deadlines</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {displayedSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSchemes.map((matchedScheme, index) => (
            <motion.div
              key={matchedScheme.scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
            >
              <div className="relative h-full">
                <div className={`absolute top-0 right-0 z-10 px-3 py-1 rounded-tr-lg rounded-bl-lg text-white text-sm font-bold shadow-lg
                  ${matchedScheme.score >= 90 ? 'bg-gradient-to-r from-green-600 to-green-700' : 
                    matchedScheme.score >= 85 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    matchedScheme.score >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    matchedScheme.score >= 65 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                    'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
                  {matchedScheme.score}% Match
                </div>
                <SchemeCard 
                  scheme={matchedScheme.scheme} 
                  showMatchingFactors={true}
                  matchingFactors={matchedScheme.matchingFactors}
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">No schemes found matching your criteria</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or refining your profile</p>
          <Button onClick={handleFindMoreSchemes}>
            Refine Your Profile
          </Button>
        </div>
      )}
      
      {displayedSchemes.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Showing {displayedSchemes.length} schemes matched to your profile.
          </p>
          <Button variant="outline" onClick={handleFindMoreSchemes}>
            Refine Your Profile for Better Matches
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemeMatcherResults;
