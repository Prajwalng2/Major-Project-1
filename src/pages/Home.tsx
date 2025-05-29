
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedSchemes from '@/components/FeaturedSchemes';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import SchemesGrid from '@/components/SchemesGrid';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedSchemes />
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">All Government Schemes</h2>
          <SchemesGrid />
        </div>
        <HowItWorks />
        <FAQ />
      </main>
      
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default Home;
