
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}>
      {/* Main navigation */}
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex flex-col">
              <span className="font-bold text-navy text-xl">Scheme Access India</span>
              <span className="text-xs text-gray-500">Digital India Initiative</span>
            </div>
          </Link>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {[
                { path: '/', label: 'Home' },
                { path: '/scheme-matcher', label: 'Scheme Matcher' },
                { path: '/faq', label: 'Help & FAQ' }
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm font-medium relative py-1 ${
                      isActive(item.path)
                        ? 'text-scheme-primary'
                        : 'text-gray-700 hover:text-scheme-primary transition-colors'
                    }`}
                  >
                    {item.label}
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-scheme-primary"
                        layoutId="navbar-indicator"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-gray-100 w-[80vw] sm:w-[350px]">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/scheme-matcher" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <span>Scheme Matcher</span>
                  </Link>
                  <Link to="/faq" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <span>Help & FAQ</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
