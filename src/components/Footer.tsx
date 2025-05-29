
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer className={`bg-navy text-white ${isMobile ? 'pt-8 pb-4' : 'pt-12 pb-6'}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">About Us</h3>
            <p className="text-xs md:text-sm text-gray-300">
              Scheme Access India is a unified platform that helps citizens discover, understand, and apply for government schemes and services.
            </p>
            <div className="flex space-x-3 md:space-x-4 mt-3 md:mt-4">
              <a href="#" className="text-white hover:text-scheme-primary">
                <Facebook size={isMobile ? 16 : 20} />
              </a>
              <a href="#" className="text-white hover:text-scheme-primary">
                <Twitter size={isMobile ? 16 : 20} />
              </a>
              <a href="#" className="text-white hover:text-scheme-primary">
                <Instagram size={isMobile ? 16 : 20} />
              </a>
              <a href="#" className="text-white hover:text-scheme-primary">
                <Youtube size={isMobile ? 16 : 20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/schemes" className="text-gray-300 hover:text-white">All Schemes</Link></li>
              <li><Link to="/scheme-matcher" className="text-gray-300 hover:text-white">Scheme Matcher</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">Help & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Us</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li className="flex items-center gap-2">
                <Mail size={isMobile ? 14 : 16} />
                <span className="text-gray-300">support@schemeaccess.gov.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={isMobile ? 14 : 16} />
                <span className="text-gray-300">1800-XXX-XXXX (Toll Free)</span>
              </li>
            </ul>
            
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 mt-4">Government Links</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">National Portal of India</a></li>
              <li><a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">MyScheme Portal</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-4 md:pt-6 text-center text-xs md:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Scheme Access India. All Rights Reserved.</p>
          <div className="mt-2 space-x-3 md:space-x-4">
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
