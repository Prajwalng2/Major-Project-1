
import React, { useState } from 'react';
import { CalendarClock, Building, ChevronRight, Share2, Download, ExternalLink, Award, Users, MapPin, Briefcase, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { SchemeProps } from './SchemeCard';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SchemeCardCompactProps {
  scheme: SchemeProps;
}

const SchemeCardCompact: React.FC<SchemeCardCompactProps> = ({ scheme }) => {
  const isActive = scheme.deadline && scheme.deadline !== 'Closed';
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: scheme.title,
        text: `Check out this government scheme: ${scheme.title}`,
        url: window.location.origin + `/schemes/${scheme.id}`,
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "The scheme has been shared.",
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard();
      });
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    const url = window.location.origin + `/schemes/${scheme.id}`;
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "Link copied",
          description: "Scheme link copied to clipboard.",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Create a more detailed text representation of the scheme details
    const schemeDetails = `
      ${scheme.title}
      
      Description: ${scheme.description}
      
      Category: ${scheme.category}
      Ministry: ${scheme.ministry || scheme.fundingMinistry || "Government of India"}
      ${scheme.implementingAgency ? `Implementing Agency: ${scheme.implementingAgency}` : ''}
      ${scheme.deadline ? `Deadline: ${scheme.deadline}` : ''}
      ${scheme.launchDate ? `Launch Date: ${scheme.launchDate}` : ''}
      ${scheme.benefitAmount ? `Benefit Amount: ${scheme.benefitAmount}` : ''}
      
      Eligibility: ${scheme.eligibilityText || (typeof scheme.eligibility === 'string' ? scheme.eligibility : 'See website for eligibility details')}
      
      ${scheme.objective ? `Objective: ${scheme.objective}` : ''}
      ${scheme.beneficiaries ? `Beneficiaries: ${scheme.beneficiaries}` : ''}
      
      ${scheme.documents && scheme.documents.length > 0 ? 
        `Required Documents:\n${scheme.documents.map(doc => `- ${doc}`).join('\n')}` : ''}
      
      For more information and to apply, visit: ${window.location.origin}/schemes/${scheme.id}
      ${scheme.applicationUrl ? `Official application link: ${scheme.applicationUrl}` : ''}
    `;
    
    // Create a Blob with the text content
    const blob = new Blob([schemeDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scheme.title.replace(/\s+/g, '-').toLowerCase()}-details.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Details downloaded",
      description: "Scheme details have been downloaded as a text file.",
    });
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetails(!showDetails);
  };
  
  const getSchemeTypeIcon = () => {
    const schemeType = determineSchemeType(scheme);
    
    switch (schemeType) {
      case 'central':
        return <BadgeCheck size={14} className="mr-1 text-blue-600" />;
      case 'state':
        return <MapPin size={14} className="mr-1 text-green-600" />;
      case 'scholarship':
        return <Award size={14} className="mr-1 text-amber-600" />;
      case 'employment':
        return <Briefcase size={14} className="mr-1 text-purple-600" />;
      default:
        return <Building size={14} className="mr-1" />;
    }
  };
  
  const determineSchemeType = (scheme: SchemeProps): string => {
    const title = scheme.title.toLowerCase();
    const desc = scheme.description.toLowerCase();
    
    if (title.includes('scholarship') || desc.includes('scholarship') || scheme.category === 'Education & Learning') {
      return 'scholarship';
    } else if (title.includes('employment') || desc.includes('employment') || desc.includes('job')) {
      return 'employment';
    } else if (scheme.ministry?.includes('State') || title.includes('state government')) {
      return 'state';
    } else {
      return 'central';
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardContent className="py-3 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-500 hover:bg-green-600" : "text-gray-500"}>
            {isActive ? "Active" : "Closed"}
          </Badge>
          
          {scheme.isPopular && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              Popular
            </Badge>
          )}
        </div>
        
        <Link to={`/schemes/${scheme.id}`} className="text-base font-semibold hover:text-scheme-primary transition-colors line-clamp-2">
          {scheme.title}
        </Link>
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          {getSchemeTypeIcon()}
          {scheme.ministry || scheme.fundingMinistry || "Government of India"}
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-gray-600">
          {scheme.deadline && (
            <div className="flex items-center">
              <CalendarClock size={12} className="mr-1" />
              <span>Deadline: {scheme.deadline}</span>
            </div>
          )}
          
          {scheme.benefitAmount && (
            <div className="flex items-center">
              <Award size={12} className="mr-1" />
              <span>Benefit: {scheme.benefitAmount}</span>
            </div>
          )}
          
          {scheme.beneficiaries && (
            <div className="flex items-center">
              <Users size={12} className="mr-1" />
              <span>For: {scheme.beneficiaries}</span>
            </div>
          )}
        </div>
        
        {showDetails && (
          <div className="mt-3 pt-2 border-t text-xs text-gray-700">
            <p className="mb-2">{scheme.description}</p>
            
            {typeof scheme.eligibility === 'string' && (
              <div className="mt-2">
                <strong>Eligibility:</strong> {scheme.eligibility}
              </div>
            )}
            
            {scheme.documents && scheme.documents.length > 0 && (
              <div className="mt-2">
                <strong>Required Documents:</strong>
                <ul className="list-disc pl-4 mt-1">
                  {scheme.documents.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {scheme.implementingAgency && (
              <div className="mt-2">
                <strong>Implementing Agency:</strong> {scheme.implementingAgency}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-3">
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={toggleDetails}
                  >
                    {showDetails ? "Hide" : "Show"} Details
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showDetails ? "Hide" : "View"} scheme details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={handleShare}
                  >
                    <Share2 size={12} className="mr-1" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this scheme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={handleDownload}
                  >
                    <Download size={12} className="mr-1" />
                    Info
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download scheme details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {scheme.applicationUrl ? (
              <Button 
                asChild
                size="sm" 
                className="flex-1 bg-scheme-secondary hover:bg-scheme-secondary/90 text-xs h-8"
                disabled={!isActive}
              >
                <a 
                  href={scheme.applicationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      toast({
                        title: "Application closed",
                        description: "This scheme is no longer accepting applications.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Apply
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </Button>
            ) : (
              isActive ? (
                <Button 
                  asChild
                  size="sm" 
                  className="flex-1 bg-scheme-secondary hover:bg-scheme-secondary/90 text-xs h-8"
                >
                  <Link to={`/schemes/${scheme.id}/apply`}>
                    Apply
                    <ChevronRight size={12} className="ml-1" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  disabled
                  size="sm" 
                  className="flex-1 text-xs h-8"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Application closed",
                      description: "This scheme is no longer accepting applications.",
                      variant: "destructive",
                    });
                  }}
                >
                  Closed
                </Button>
              )
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SchemeCardCompact;
