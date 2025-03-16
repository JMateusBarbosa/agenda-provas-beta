
import React, { useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSchedule = location.pathname === '/schedule';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-navy text-white shadow-md h-16 z-50 animate-fade-in">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CalendarDays className="h-8 w-8 text-gold" />
          <span className="text-xl font-bold hidden sm:inline">Sistema de Agendamento de Provas</span>
          <span className="text-xl font-bold sm:hidden">Agendamento</span>
        </div>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {mobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-navy p-4 flex flex-col space-y-2 shadow-lg animate-fade-in">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <button className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                    isHome ? 'bg-gold text-navy font-semibold' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}>
                    Página Inicial
                  </button>
                </Link>
                <Link to="/schedule" onClick={() => setMobileMenuOpen(false)}>
                  <button className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                    isSchedule ? 'bg-gold text-navy font-semibold' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}>
                    Agendar Nova Prova
                  </button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/">
              <button className={`px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                isHome 
                  ? 'bg-gold text-navy font-semibold hover:opacity-90' 
                  : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
              }`}>
                Página Inicial
              </button>
            </Link>
            <Link to="/schedule">
              <button className={`px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                isSchedule 
                  ? 'bg-gold text-navy font-semibold hover:opacity-90' 
                  : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
              }`}>
                Agendar Nova Prova
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
