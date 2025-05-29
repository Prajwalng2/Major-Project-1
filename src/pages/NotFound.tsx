
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, Search, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-xl">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-scheme-primary">404</h1>
            <p className="text-2xl font-semibold mt-4 mb-2">Page Not Found</p>
            <p className="text-gray-600 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-scheme-primary hover:bg-scheme-primary/90">
              <Link to="/" className="flex items-center">
                <Home size={16} className="mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/search" className="flex items-center">
                <Search size={16} className="mr-2" />
                Search Schemes
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/faq" className="flex items-center">
                <HelpCircle size={16} className="mr-2" />
                Help & FAQ
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
