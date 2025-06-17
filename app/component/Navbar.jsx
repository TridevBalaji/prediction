"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 h-[80px] w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-purple-500/10' 
          : 'bg-transparent'
      }`}>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 opacity-50"></div>
        
        {/* Logo */}
        <div className="relative z-10 group">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                MediAI
              </h2>
              <p className="text-xs text-gray-400 -mt-1">Disease Predictor</p>
            </div>
          </div>
        </div>

        {/* Desktop Menu Links */}
        <ul className="md:flex hidden items-center gap-8 relative z-10">
          {['Home', 'Services', 'Portfolio', 'Pricing'].map((item, index) => (
            <li key={item} className="relative group">
              <button
                className="text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wider relative py-2 px-1"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop "Get started" Button */}
        <div className="md:flex hidden relative z-10">
          <button
            type="button"
            className="relative group bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="menu-btn"
          type="button"
          className="menu-btn inline-block md:hidden active:scale-90 transition-all duration-200 relative z-10 p-2"
          onClick={toggleMobileMenu}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
          </div>
        </button>

        {/* Mobile Menu Drawer */}
        <div className={`mobile-menu fixed top-[80px] left-0 w-full bg-gray-900/95 backdrop-blur-xl md:hidden transition-all duration-500 border-t border-gray-800/50 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <div className="p-6">
            <ul className="flex flex-col space-y-6">
              {['Home', 'Services', 'Portfolio', 'Pricing'].map((item, index) => (
                <li key={item} className="group">
                  <button 
                    className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium flex items-center space-x-3 w-full text-left py-2 group-hover:translate-x-2"
                    onClick={toggleMobileMenu}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white mt-8 px-8 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 w-full"
              onClick={toggleMobileMenu}
            >
              Get Started
            </button>

            {/* Mobile menu background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-[80px]"></div>
    </>
  );
}