
import React, { useState } from 'react';
import { CalendarClock, ChevronRight, Building, Users, AlertCircle, CheckCircle2, Clock, MapPin, Award, FileText, Share2, Link2, ExternalLink, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MatchingFactor } from '@/utils/schemeMatcher';
import { useToast } from '@/components/ui/use-toast';

export interface EligibilityCriteria {
  category?: string[];
  gender?: string[];
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  states?: string[];
  education?: string[];
  employmentStatus?: string[];
  disability?: boolean;
}

export interface SchemeProps {
  id: string;
  title: string;
  description: string;
  category: string;
  ministry: string;
  deadline?: string;
  eligibility: EligibilityCriteria | string;
  eligibilityText?: string;
  launchDate?: string;
  isPopular?: boolean;
  benefitAmount?: string;
  documents?: string[];
  tags?: string[];
  applicationUrl?: string;
  schemeCode?: string;
  fundingMinistry?: string;
  state?: string;
  implementingAgency?: string;
  beneficiaries?: string;
  objective?: string;
}

interface SchemeCardProps {
  scheme: SchemeProps;
  showMatchingFactors?: boolean;
  matchingFactors?: MatchingFactor[];
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, showMatchingFactors, matchingFactors }) => {
  const isActive = scheme.deadline && scheme.deadline !== 'Closed';
  const { toast } = useToast();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  // Get eligibility text, using the eligibility field as a fallback if eligibilityText is not provided
  const displayEligibilityText = scheme.eligibilityText || 
    (typeof scheme.eligibility === 'string' ? scheme.eligibility : 'Check eligibility criteria');
  
  const handleShareScheme = () => {
    if (navigator.share) {
      navigator.share({
        title: `${scheme.title} - Government Scheme`,
        text: `Check out this government scheme: ${scheme.title}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/schemes/${scheme.id}`)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Scheme link has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };

  const handleApplyNow = () => {
    if (!isActive) {
      toast({
        title: "Scheme Closed",
        description: "This scheme is no longer accepting applications.",
        variant: "destructive"
      });
      return;
    }

    // Always open the official website in a new tab
    if (scheme.applicationUrl) {
      window.open(scheme.applicationUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to searching for the scheme on the official government portal
      const searchUrl = `https://www.india.gov.in/search/site/${encodeURIComponent(scheme.title)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-500 hover:bg-green-600" : "text-gray-500"}>
              {isActive ? "Active" : "Closed"}
            </Badge>
            
            {scheme.isPopular && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                Popular
              </Badge>
            )}
            
            {scheme.tags && scheme.tags.length > 0 && (
              <Badge variant="outline" className="border-scheme-secondary text-scheme-secondary">
                {scheme.tags[0]}
              </Badge>
            )}
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleShareScheme}>
                  <Share2 size={16} />
                  <span className="sr-only">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this scheme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Link to={`/schemes/${scheme.id}`} className="text-xl font-semibold hover:text-scheme-primary transition-colors mt-2">
          {scheme.title}
        </Link>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Building size={14} className="mr-1" />
          {scheme.ministry || scheme.fundingMinistry || "Government of India"}
          
          {scheme.state && (
            <>
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <MapPin size={14} className="mr-1" />
              {scheme.state}
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <p className="text-gray-600 text-sm mb-3">
          {detailsExpanded ? scheme.description : (
            <>
              {scheme.description.length > 150
                ? `${scheme.description.substring(0, 150)}...`
                : scheme.description
              }
            </>
          )}
          
          {scheme.description.length > 150 && (
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="text-scheme-primary hover:underline ml-1 font-medium text-xs"
            >
              {detailsExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="flex items-center text-gray-600">
            <Users size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{displayEligibilityText.substring(0, 40)}{displayEligibilityText.length > 40 ? "..." : ""}</span>
          </div>
          
          {scheme.deadline && (
            <div className="flex items-center text-gray-600">
              <CalendarClock size={14} className="mr-1 flex-shrink-0" />
              <span>Deadline: {scheme.deadline}</span>
            </div>
          )}
          
          {scheme.benefitAmount && (
            <div className="flex items-center text-gray-600">
              <Award size={14} className="mr-1 flex-shrink-0" />
              <span>Benefit: {scheme.benefitAmount}</span>
            </div>
          )}
          
          {scheme.launchDate && (
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-1 flex-shrink-0" />
              <span>Launched: {scheme.launchDate}</span>
            </div>
          )}
        </div>
        
        {(scheme.documents && scheme.documents.length > 0) && (
          <div className="mb-4">
            <h4 className="text-xs font-medium mb-1 flex items-center">
              <FileText size={14} className="mr-1" />
              Required Documents:
            </h4>
            <ul className="text-xs text-gray-600 ml-5 list-disc">
              {scheme.documents.slice(0, 3).map((doc, i) => (
                <li key={i} className="truncate">{doc}</li>
              ))}
              {scheme.documents.length > 3 && (
                <li className="text-scheme-primary">+ {scheme.documents.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
        
        {showMatchingFactors && matchingFactors && matchingFactors.length > 0 && (
          <Collapsible className="mt-3 bg-gray-50 rounded-md p-2">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-1">
              <span className="flex items-center text-xs font-medium">
                <CheckCircle2 size={14} className="mr-1 text-green-500" />
                Why this matches your profile
              </span>
              <ChevronDown size={14} className="shrink-0 transition-transform duration-200 ui-open:rotate-180" />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pt-2 space-y-1">
              {matchingFactors.slice(0, 4).map((factor, index) => (
                <div key={index} className="text-xs flex items-start gap-1">
                  <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{factor.factor}:</span> {factor.description}
                  </div>
                </div>
              ))}
              
              {matchingFactors.length > 4 && (
                <div className="text-xs text-gray-500 pl-4">
                  +{matchingFactors.length - 4} more factors
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 grid grid-cols-2 gap-2">
        <Button asChild variant="outline" size="sm" className="w-full hover:bg-gray-50 border-gray-300">
          <Link to={`/schemes/${scheme.id}`}>
            View Details
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </Button>
      
      <Button
        variant="default"
        size="sm"
        className={`w-full ${isActive ? 'bg-scheme-primary hover:bg-scheme-primary/90' : 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed'}`}
        onClick={handleApplyNow}
        disabled={!isActive}
      >
        {isActive ? (
          <>
            Apply Now
            {scheme.applicationUrl && <ExternalLink size={14} className="ml-1" />}
          </>
        ) : (
          'Closed'
        )}
      </Button>
    </CardFooter>
    </Card>
  );
};

export default SchemeCard;
