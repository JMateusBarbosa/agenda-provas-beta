
import React, { useState, useEffect } from 'react';
import { CalendarDays, Menu, X, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verifica onde estamos para destacar o botão correto
  // Corrigido: destaque na rota "/dashboard" (Provas Agendadas)
  const isDashboard = location.pathname === '/dashboard';
  const isSchedule = location.pathname === '/schedule';

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

  // Fechar o menu quando a tela for rolada para baixo
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Gerador de iniciais
  const getInitials = (name: string) => name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);

  // Redireciona usuários logados tentando acessar a landing "/" para /dashboard
  useEffect(() => {
    if (user && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-navy text-white shadow-md h-16 z-50 animate-fade-in">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CalendarDays className="h-8 w-8 text-gold" />
          <span className="text-xl font-bold hidden sm:inline">Sistema de Agendamento de Provas</span>
          <span className="text-xl font-bold sm:hidden">Agendamento</span>
        </div>
        {user ? (
          isMobile ? (
            <>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white bg-opacity-10">
                      <Avatar>
                        <AvatarFallback className="bg-white bg-opacity-20 text-white">
                          {user?.name ? getInitials(user.name) : '??'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
              {mobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-navy p-4 flex flex-col space-y-2 shadow-lg animate-fade-in">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <button className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                      isDashboard ? 'bg-gold text-navy font-semibold' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <button className={`px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                    isDashboard
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white bg-opacity-10">
                    <Avatar>
                      <AvatarFallback className="bg-white bg-opacity-20 text-white">
                        {user?.name ? getInitials(user.name) : '??'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        ) : (
          // Não mostra navegação para usuários não autenticados
          <></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
