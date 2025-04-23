
import React from 'react';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {/* Sobre */}
          <div className="text-center">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-gold" />
              <h3 className="font-semibold text-base md:text-lg">Sistema de Agendamento</h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              Uma solução moderna e eficiente para o gerenciamento e agendamento de provas, 
              desenvolvida para otimizar o processo educacional.
            </p>
          </div>

          {/* Contato */}
          <div className="text-center">
            <h3 className="font-semibold text-base md:text-lg mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 justify-center">
                <Phone className="h-4 w-4" />
                <span className="text-sm md:text-base">(92) 99146-0210</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 justify-center">
                <Mail className="h-4 w-4" />
                <span className="text-sm md:text-base">joaomateusbp7@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 justify-center">
                <MapPin className="h-4 w-4" />
                <span className="text-sm md:text-base">Maués, AM</span>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="text-center">
            <h3 className="font-semibold text-base md:text-lg mb-4">Links Rápidos</h3>
            <div className="space-y-3">
              <a href="/schedule" className="block text-gray-300 hover:text-gold text-sm md:text-base transition-colors">
                Agendar Prova
              </a>
              <a href="/support" className="block text-gray-300 hover:text-gold text-sm md:text-base transition-colors">
                Suporte
              </a>
              <a href="/about" className="block text-gray-300 hover:text-gold text-sm md:text-base transition-colors">
                Sobre
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-gray-700" />

        <div className="text-center text-xs md:text-sm text-gray-400">
          <p>© {currentYear} Sistema de Agendamento de Provas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
