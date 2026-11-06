import React from 'react';
import { Home, ArrowUp } from 'lucide-react';

interface BackToHomeButtonProps {
  isVisible: boolean;
  onGoHome: () => void;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ isVisible, onGoHome }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
      <button
        type="button"
        onClick={onGoHome}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#1F4D36] hover:bg-[#163827] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(31,77,54,0.35)] border-2 border-[#7CC242]/70 hover:border-[#7CC242] transition-all transform hover:-translate-y-1 hover:scale-105 cursor-pointer font-title"
        aria-label="Volver a la página principal de EcoModa"
      >
        <div className="w-6 h-6 rounded-full bg-[#1E8E5A] text-white flex items-center justify-center transition-transform group-hover:rotate-12">
          <Home className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs sm:text-sm font-bold tracking-wide">
          Volver al Inicio
        </span>
        <ArrowUp className="w-3.5 h-3.5 text-[#7CC242] transition-transform group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
};
