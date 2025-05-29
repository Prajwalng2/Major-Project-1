
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const benefits = [
    "Easy access to 500+ schemes",
    "Simple application process",
    "Track your applications",
    "Personalized recommendations"
  ];

  return (
    <div className="relative bg-blue-900 text-white py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="w-full max-w-3xl text-center" variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-playfair leading-tight">
              Find the Right 
              <span className="text-scheme-primary"> Schemes</span> for You
            </h1>
            <p className="text-lg mb-8 text-gray-200 max-w-2xl mx-auto">
              Discover, understand, and apply for schemes and services all in one place.
            </p>
            
            <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto mb-8">
              <Input 
                type="search" 
                placeholder="Search for schemes..." 
                className="rounded-r-none border-r-0 bg-white/90 text-gray-800 focus-visible:ring-0 placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none bg-scheme-primary hover:bg-scheme-primary/90 shadow-md">
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </form>
            
            <div className="space-y-2 mb-8 flex flex-col items-start mx-auto max-w-md">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                >
                  <CheckCircle size={16} className="text-scheme-primary" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
