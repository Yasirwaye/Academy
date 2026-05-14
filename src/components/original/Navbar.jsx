import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';

const Navbar = ({ activeSection, scrollToSection, onAdminClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'highlights', label: 'Highlights' },
    { id: 'spotlight', label: 'Spotlight' },
    // { id: 'training', label: 'Training' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'squads', label: 'Squads' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-strong' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img
              src="https://yzrqtuusfhicjbwmzwoi.supabase.co/storage/v1/object/public/media/team-logo.jpeg"
              alt="Eastleigh United Logo"
              className="w-12 h-12 rounded-full object-cover shadow-lg shadow-cyan-500/20"
            />
            <div>
              <div className="text-white font-bold font-display tracking-wider text-lg">EASTLEIGH UNITED FC</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`nav-link text-sm font-medium transition-colors ${
                  activeSection === item.id ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('apply')}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-full text-sm hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Apply Now
            </button>
            <button
              onClick={onAdminClick}
              className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Admin Panel"
            >
              <Shield className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={onAdminClick} className="glass p-2 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-400" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden glass-strong rounded-xl mt-2 p-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { scrollToSection(item.id); setIsOpen(false); }}
                className="block w-full text-left text-gray-300 hover:text-cyan-400 py-2 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { scrollToSection('apply'); setIsOpen(false); }}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-full text-sm"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;