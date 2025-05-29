
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemeMatcherForm from '@/components/SchemeMatcherForm';

const SchemeMatcherPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gray-100 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Scheme Matcher</h1>
              <p className="text-gray-600 mb-8">
                Find government schemes that match your profile and eligibility criteria. Fill out the form below to get personalized scheme recommendations.
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-8">
          <div className="container mx-auto px-4">
            <SchemeMatcherForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemeMatcherPage;
