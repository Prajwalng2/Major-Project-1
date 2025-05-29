
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, Calendar, FileText, Download, Share2, 
  User, BadgeCheck, Clock, MapPin
} from 'lucide-react';
import schemes from '@/data/schemes';
import { useToast } from "@/components/ui/use-toast";

const SchemeDetailPage = () => {
  const { id } = useParams();
  const scheme = schemes.find(s => s.id === id);
  const { toast } = useToast();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme?.title,
        text: `Check out this government scheme: ${scheme?.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others.",
      });
    }
  };
  
  const handleDownload = () => {
    // Create a simple text representation of the scheme details
    if (!scheme) return;
    
    const schemeDetails = `
      ${scheme.title}
      
      Description: ${scheme.description}
      
      Category: ${scheme.category}
      Ministry: ${scheme.ministry}
      ${scheme.deadline ? `Deadline: ${scheme.deadline}` : ''}
      
      Eligibility: ${scheme.eligibilityText || (typeof scheme.eligibility === 'string' ? scheme.eligibility : 'See website for eligibility details')}
      
      For more information, visit: ${window.location.href}
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
  
  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Scheme Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the scheme you're looking for.</p>
            <Button asChild>
              <Link to="/schemes">Browse All Schemes</Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Mock data for the scheme details
  const schemeDetails = {
    benefits: [
      "Financial assistance of ₹6,000 per year in three equal installments",
      "Direct transfer to bank account",
      "Support for purchasing inputs for agriculture",
      "Assistance to meet agricultural expenses and household needs"
    ],
    documents: [
      "Aadhaar Card",
      "Land Records/Documents",
      "Bank Account Details",
      "Recent Passport Size Photograph",
      "Mobile Number Linked with Aadhaar"
    ],
    steps: [
      "Complete the online registration form on the PM-KISAN portal or through CSCs",
      "Provide necessary documents and details for verification",
      "Local authorities will verify land ownership and eligibility",
      "After successful verification, registration is confirmed",
      "Benefits get credited directly to bank account"
    ],
    faqs: [
      {
        question: "How often will I receive the installment?",
        answer: "Installments are credited three times a year, every four months."
      },
      {
        question: "Can tenant farmers apply for this scheme?",
        answer: "Currently, only landholding farmers are eligible under the scheme guidelines."
      },
      {
        question: "What happens if my bank account details are incorrect?",
        answer: "Payment will fail. You need to update correct bank details through the correction module."
      },
      {
        question: "How can I check my application status?",
        answer: "Visit the PM-KISAN portal, enter your registration number, and check the status online."
      }
    ]
  };

  const isActive = scheme.deadline && scheme.deadline !== 'Closed';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-6 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-scheme-primary">Home</Link>
            {' > '}
            <Link to="/schemes" className="hover:text-scheme-primary">Schemes</Link>
            {' > '}
            <span className="text-gray-700">{scheme.title}</span>
          </div>
          
          {/* Scheme Header */}
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-md mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-scheme-primary/10 text-scheme-primary rounded-full text-sm font-medium">
                    {scheme.category}
                  </span>
                  {scheme.deadline && (
                    <span className="flex items-center text-xs text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      Deadline: {scheme.deadline}
                    </span>
                  )}
                </div>
                
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{scheme.title}</h1>
                <p className="text-gray-600">{scheme.description}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <FileText size={16} className="mr-2" />
                  <span>Provided by: {scheme.ministry}</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {isActive ? (
                    <Button asChild className="bg-scheme-secondary hover:bg-scheme-secondary/90">
                      <Link to={`/schemes/${scheme.id}/apply`}>
                        Apply Now
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="bg-gray-300 cursor-not-allowed">
                      Applications Closed
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 hidden md:flex"
                    onClick={handleDownload}
                  >
                    <Download size={16} />
                    Download Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hidden md:flex" 
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
              
              <Card className="w-full lg:w-80 shrink-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Eligibility Quick Check</h3>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <User size={18} className="text-scheme-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Who can apply</p>
                      <p className="text-sm text-gray-600">{scheme.eligibilityText || (typeof scheme.eligibility === 'string' ? scheme.eligibility : 'See eligibility details')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <BadgeCheck size={18} className="text-scheme-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Benefits</p>
                      <p className="text-sm text-gray-600">Financial assistance of ₹6,000 per year</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <Clock size={18} className="text-scheme-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Processing Time</p>
                      <p className="text-sm text-gray-600">3-4 weeks after verification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-scheme-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Available In</p>
                      <p className="text-sm text-gray-600">All states and union territories</p>
                    </div>
                  </div>

                  {isActive && (
                    <Button asChild className="w-full mt-6 bg-scheme-secondary hover:bg-scheme-secondary/90">
                      <Link to={`/schemes/${scheme.id}/apply`}>
                        Check Eligibility & Apply
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Scheme Details */}
          <Tabs defaultValue="benefits" className="bg-white rounded-lg shadow-md">
            <TabsList className="w-full overflow-x-auto flex-nowrap bg-gray-50 p-0 rounded-t-lg border-b h-auto">
              <TabsTrigger 
                value="benefits" 
                className="flex-1 py-3 md:py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Benefits
              </TabsTrigger>
              <TabsTrigger 
                value="eligibility" 
                className="flex-1 py-3 md:py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Eligibility
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="flex-1 py-3 md:py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="application" 
                className="flex-1 py-3 md:py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Process
              </TabsTrigger>
              <TabsTrigger 
                value="faqs" 
                className="flex-1 py-3 md:py-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                FAQs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="benefits" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-xl font-semibold mb-4">Scheme Benefits</h2>
              <ul className="space-y-3">
                {schemeDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-scheme-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="eligibility" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
              <p className="mb-4">{scheme.eligibilityText || (typeof scheme.eligibility === 'string' ? scheme.eligibility : 'See eligibility details below.')}</p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-6">
                <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle size={18} className="text-scheme-primary" />
                  Important Note
                </h3>
                <p className="text-sm text-gray-600">
                  The scheme is exclusively for farmers. Government employees and institutional landholders are not eligible for the scheme.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
              <ul className="space-y-3">
                {schemeDetails.documents.map((document, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-scheme-primary flex-shrink-0" />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="application" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-xl font-semibold mb-4">Application Process</h2>
              <ol className="space-y-6">
                {schemeDetails.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-scheme-primary text-white flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p>{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                {isActive ? (
                  <Button asChild className="bg-scheme-secondary hover:bg-scheme-secondary/90">
                    <Link to={`/schemes/${scheme.id}/apply`}>
                      Start Application Process
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="bg-gray-300 cursor-not-allowed">
                    Applications Closed
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="faqs" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {schemeDetails.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="text-md font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemeDetailPage;
