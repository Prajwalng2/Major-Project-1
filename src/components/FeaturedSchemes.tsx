
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchemeCard from './SchemeCard';
import schemes from '@/data/schemes';
import categorySchemes from '@/data/categorySchemes';
import { motion } from 'framer-motion';

const FeaturedSchemes = () => {
  const [activeTab, setActiveTab] = useState('popular');
  
  // Filter schemes based on active tab
  const getFilteredSchemes = () => {
    if (activeTab === 'popular') {
      return schemes.filter(scheme => scheme.isPopular).slice(0, 6);
    }
    
    // For category tabs, use category-specific schemes
    const categoryId = activeTab;
    if (categorySchemes[categoryId as keyof typeof categorySchemes]) {
      return categorySchemes[categoryId as keyof typeof categorySchemes].slice(0, 6);
    }
    
    return [];
  };

  const filteredSchemes = getFilteredSchemes();

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

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-scheme-primary to-scheme-accent">Featured Schemes</span>
            <div className="absolute left-1/2 -bottom-2 w-24 h-1 bg-scheme-primary transform -translate-x-1/2 rounded-full"></div>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Explore top schemes across various categories. Find the right support for your needs.
          </p>
        </div>

        <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="popular" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Popular</TabsTrigger>
              <TabsTrigger value="agriculture" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Agriculture</TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Health</TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Education</TabsTrigger>
              <TabsTrigger value="finance" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Finance</TabsTrigger>
              <TabsTrigger value="housing" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Housing</TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Social Welfare</TabsTrigger>
              <TabsTrigger value="women" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Women & Child</TabsTrigger>
              <TabsTrigger value="digital" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Digital India</TabsTrigger>
              <TabsTrigger value="entrepreneur" className="data-[state=active]:bg-scheme-primary data-[state=active]:text-white">Entrepreneur</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="space-y-8">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredSchemes.map((scheme) => (
                <motion.div key={scheme.id} variants={itemVariants}>
                  <SchemeCard scheme={scheme} />
                </motion.div>
              ))}
            </motion.div>
            
            {filteredSchemes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No schemes found in this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeaturedSchemes;
