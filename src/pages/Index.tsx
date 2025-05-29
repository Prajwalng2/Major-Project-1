
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedSchemes from '@/components/FeaturedSchemes';
import BrowseCategories from '@/components/BrowseCategories';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import StatisticsSection from '@/components/StatisticsSection';
import FAQ from '@/components/FAQ';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <StatisticsSection />
        <FeaturedSchemes />
        <BrowseCategories />
        <HowItWorks />
        <TestimonialSection />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
