import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'backdrop-blur-xl border-b border-gray-700/50 py-4 shadow-lg' 
          : 'bg-transparent py-8'
      }`}
      style={scrolled ? { backgroundColor: 'rgba(22, 22, 24, 0.8)' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="z-50 relative group flex items-center">
          <img 
            src="/logo.svg" 
            alt="aflow logo" 
            className="h-8 w-8 hover:opacity-80 transition-opacity"
          />
        </a>
        
        <div className="hidden md:flex space-x-1 p-1 bg-white/10 backdrop-blur-md rounded-full border border-gray-700/50">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-black hover:bg-aflow-accent transition-all duration-300 tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Icon Placeholder */}
        <div className="md:hidden text-white p-2 bg-white/10 backdrop-blur-md rounded-lg border border-gray-700/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;