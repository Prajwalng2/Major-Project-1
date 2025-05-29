
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SlidersIcon } from 'lucide-react';

const HeroSchemeMatcher = () => {
  return (
    <div className="mt-6">
      <Button 
        asChild 
        size="lg" 
        className="bg-white text-scheme-primary hover:bg-white/90 border border-scheme-primary"
      >
        <Link to="/scheme-matcher" className="flex items-center">
          <SlidersIcon className="mr-2 h-5 w-5" />
          Find Schemes For You
        </Link>
      </Button>
    </div>
  );
};

export default HeroSchemeMatcher;
