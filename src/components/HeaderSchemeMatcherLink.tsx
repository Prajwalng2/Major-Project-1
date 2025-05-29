
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SlidersIcon } from 'lucide-react';

const HeaderSchemeMatcherLink = () => {
  return (
    <Link to="/scheme-matcher">
      <Button variant="ghost" className="flex items-center gap-2 text-scheme-primary hover:text-scheme-primary">
        <SlidersIcon className="h-4 w-4" />
        <span>Find Schemes For You</span>
      </Button>
    </Link>
  );
};

export default HeaderSchemeMatcherLink;
