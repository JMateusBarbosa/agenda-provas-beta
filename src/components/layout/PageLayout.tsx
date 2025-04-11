
import React from 'react';
import Navbar from '@/components/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 container pt-24 pb-20 px-4 sm:px-6">
        {(title || description) && (
          <div className="mb-6">
            {title && <h1 className="text-3xl font-bold text-navy mb-2">{title}</h1>}
            {description && <p className="text-gray-600">{description}</p>}
          </div>
        )}
        {children}
      </main>
      
      <footer className="bg-navy text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} Sistema de Agendamento de Provas - Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default PageLayout;
