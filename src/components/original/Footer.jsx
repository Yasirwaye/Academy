import React from 'react';
import { Link } from 'react-router-dom'; // Add this import
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Programs', to: '/programs' },
  { label: 'Coaches', to: '/coaches' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Highlights', to: '/#highlights' },
  { label: 'Squads', to: '/#squads' },
  { label: 'Apply Now', to: '/#apply' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0e1a] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid - 4 Columns matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-400 p-[2px]">
                <img 
                  src="https://yzrqtuusfhicjbwmzwoi.supabase.co/storage/v1/object/public/media/team-logo.jpeg" 
                  alt="Eastleigh United FC" 
                  className="w-full h-full object-cover rounded-full bg-[#0a0e1a]"
                />
              </div>
              <span className="font-display font-black text-lg text-white tracking-wide">
                Eastleigh United FC
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Developing champions through excellence in football.
            </p>
          </div>

          {/* Column 2: Quick Links - FIXED with React Router Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/coaches" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Coaches
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
              {/* <li>
                <Link to="/#apply" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Apply Now
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email:</p>
                  <a 
                    href="mailto:eastleigh_unitedfc.com" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    eastleigh_unitedfc.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Phone:</p>
                  <a 
                    href="tel:+254722218608" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    +254 722 218 608
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Location:</p>
                  <p className="text-gray-300 text-sm">Nairobi, Eastleigh</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us with Icons */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Follow Us</h3>
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2] flex items-center justify-center text-[#1877F2] hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              
              <a 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2] flex items-center justify-center text-[#1DA1F2] hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-500/20 hover:from-purple-600 hover:to-pink-500 flex items-center justify-center text-pink-500 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              
              <a 
                href="https://www.tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Eastleigh United FC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;