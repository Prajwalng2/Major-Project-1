
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { getSchemeById } from '@/utils/schemeDataService';

const SchemeConfirmationPage = () => {
  const { id } = useParams<{id: string}>();
  const [scheme, setScheme] = React.useState<any>(null);
  const [applicationNumber, setApplicationNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    const fetchScheme = async () => {
      if (!id) return;
      
      try {
        const schemeData = await getSchemeById(id);
        if (schemeData) {
          setScheme(schemeData);
        }
        
        // Generate a random application number
        const randomNum = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
        setApplicationNumber(`APP${randomNum}`);
      } catch (error) {
        console.error("Error fetching scheme:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheme();
  }, [id]);
  
  const handleDownloadReceipt = () => {
    // Generate a simple text receipt
    if (!scheme) return;
    
    const receiptContent = `
      APPLICATION CONFIRMATION
      
      Application Number: ${applicationNumber}
      Date: ${new Date().toLocaleDateString()}
      
      Scheme: ${scheme.title}
      Ministry: ${scheme.ministry}
      
      Your application has been successfully submitted.
      Please keep this application number for future reference.
      
      For any queries, please contact:
      Email: support@myscheme.gov.in
      Phone: 1800-123-4567
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application-${applicationNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-scheme-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading confirmation details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-6 md:p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="text-green-600 w-12 h-12" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Application Submitted Successfully!</h1>
              <p className="text-gray-600">Your application for {scheme?.title} has been received.</p>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6 text-left">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">Application Details:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Application Number</p>
                    <p className="font-medium">{applicationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheme Name</p>
                    <p className="font-medium">{scheme?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ministry</p>
                    <p className="font-medium">{scheme?.ministry}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">What's Next?</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>You will receive a confirmation email with your application details.</li>
                  <li>Your application will be reviewed within 7-10 working days.</li>
                  <li>You may be contacted for additional information if required.</li>
                  <li>Check your email regularly for updates on your application status.</li>
                </ol>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button onClick={handleDownloadReceipt} variant="outline" className="flex items-center gap-2">
                <Download size={18} />
                Download Receipt
              </Button>
              <Button asChild>
                <Link to="/" className="flex items-center gap-2">
                  Return to Home
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemeConfirmationPage;
