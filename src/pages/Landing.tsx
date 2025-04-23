
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Footer from '@/components/layout/Footer';

const logoUrl = "/lovable-uploads/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Updated to use logo */}
      <header className="bg-navy text-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col items-center text-center">
            <img
              src={logoUrl}
              alt="Logo Indústria do Saber"
              className="mb-4 md:mb-6 w-28 h-28 md:w-40 md:h-40 object-contain rounded bg-white"
              style={{ background: 'white', padding: '0.5rem' }}
            />
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              Sistema de Agendamento de Provas
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl px-4">
              Simplifique o processo de agendamento de provas com nossa plataforma intuitiva e eficiente.
            </p>
            <Button 
              className="bg-gold hover:bg-gold/90 text-navy font-semibold w-full md:w-auto"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section - Updated grid and spacing for mobile */}
      <section className="py-12 md:py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-navy mb-8 md:mb-12">
            Principais Características
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon={<img src={logoUrl} className="h-8 w-8 object-contain" alt="Logo" />}
              title="Agendamento Simplificado"
              description="Interface intuitiva para agendar provas de forma rápida e eficiente."
            />
            <FeatureCard 
              icon={<img src={logoUrl} className="h-8 w-8 object-contain" alt="Logo" />}
              title="Gestão de Alunos"
              description="Acompanhamento completo do histórico de provas de cada aluno."
            />
            <FeatureCard 
              icon={<img src={logoUrl} className="h-8 w-8 object-contain" alt="Logo" />}
              title="Múltiplas Unidades"
              description="Suporte para gerenciamento de várias unidades educacionais."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Feature Card Component - Updated padding and spacing for mobile
const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
    <div className="flex justify-center mb-3 md:mb-4">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-semibold text-navy mb-2">{title}</h3>
    <p className="text-gray-600 text-sm md:text-base">{description}</p>
  </div>
);

export default Landing;

