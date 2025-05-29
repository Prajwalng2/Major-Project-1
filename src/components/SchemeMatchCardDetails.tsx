
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SchemeMatchCardDetailsProps {
  matchingFactors: string[];
}

const SchemeMatchCardDetails = ({ matchingFactors }: SchemeMatchCardDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2 border-t pt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto text-scheme-primary hover:text-scheme-primary/80 hover:bg-transparent">
          <span className="text-sm font-medium">Why this matches you</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="flex flex-wrap gap-2">
          {matchingFactors.map((factor, index) => (
            <Badge key={index} variant="outline" className="bg-scheme-primary/10 text-scheme-primary border-scheme-primary/20">
              {factor}
            </Badge>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SchemeMatchCardDetails;
