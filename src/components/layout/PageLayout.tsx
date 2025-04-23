
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from './Footer';

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
          <div className="mb-6 text-center max-w-3xl mx-auto">
            {title && <h1 className="text-3xl font-bold text-navy mb-2">{title}</h1>}
            {description && <p className="text-gray-600">{description}</p>}
          </div>
        )}
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
