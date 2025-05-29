
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import { Button } from '@/components/ui/button';
import { Mail, Phone, FileText, Link as LinkIcon, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Help & Frequently Asked Questions</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about government schemes, application processes, and using our platform.
              </p>
            </div>
          </div>
        </div>
        
        <FAQ />
        
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our support team is available to assist you with any questions or issues you may have.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-scheme-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-4">Send us your questions or concerns</p>
                <a href="mailto:support@schemeaccess.gov.in" className="text-scheme-primary hover:underline">
                  support@schemeaccess.gov.in
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-scheme-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Helpline</h3>
                <p className="text-gray-600 text-sm mb-4">Talk to our support team directly</p>
                <a href="tel:18001234567" className="text-scheme-primary hover:underline">
                  1800-123-4567 (Toll Free)
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-scheme-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">User Guide</h3>
                <p className="text-gray-600 text-sm mb-4">Download our detailed user manual</p>
                <Button variant="outline" className="text-scheme-primary border-scheme-primary hover:bg-scheme-primary/10">
                  Download Guide
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="text-scheme-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Official Website</h3>
                <p className="text-gray-600 text-sm mb-4">Visit the official government portal</p>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="text-scheme-primary hover:underline">
                  www.myscheme.gov.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
