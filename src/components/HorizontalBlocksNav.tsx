import React, { useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Sparkles, 
  Layers, 
  Compass, 
  Tag, 
  Leaf, 
  Award,
  ScrollText,
  MessageCircle
} from 'lucide-react';

export interface BlockChapter {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
}

export const BLOCKS: BlockChapter[] = [
  { id: 'block-hero', number: '01', title: 'Inicio & Pasarela', shortTitle: 'Inicio', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 'block-catalog', number: '02', title: 'Catálogo & Tienda', shortTitle: 'Catálogo', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'block-outfit', number: '03', title: 'Armador de Outfits', shortTitle: 'Armar Look', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'block-promos', number: '04', title: 'Ofertas & Promociones', shortTitle: 'Ofertas', icon: <Tag className="w-3.5 h-3.5" /> },
  { id: 'block-club', number: '05', title: 'Club EcoModa & Puntos', shortTitle: 'Club VIP', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'block-contact', number: '06', title: 'Contacto & Sostenibilidad', shortTitle: 'Contacto', icon: <MessageCircle className="w-3.5 h-3.5" /> }
];

interface HorizontalBlocksNavProps {
  activeBlockIndex: number;
  onSelectBlock: (index: number) => void;
  isBlockMode: boolean;
  onToggleBlockMode: () => void;
}

export const HorizontalBlocksNav: React.FC<HorizontalBlocksNavProps> = ({
  activeBlockIndex,
  onSelectBlock,
  isBlockMode,
  onToggleBlockMode
}) => {
  const currentBlock = BLOCKS[activeBlockIndex];

  // Navegación por teclado (Flechas izquierda y derecha)
  useEffect(() => {
    if (!isBlockMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight') {
        if (activeBlockIndex < BLOCKS.length - 1) {
          onSelectBlock(activeBlockIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeBlockIndex > 0) {
          onSelectBlock(activeBlockIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBlockMode, activeBlockIndex, onSelectBlock]);

  return (
    <nav 
      aria-label="Navegación horizontal de bloques EcoModa"
      className="sticky top-20 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#DFD4BE] py-2 px-4 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Selector de bloques horizontal (Tabs) */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {BLOCKS.map((block, idx) => {
            const isActive = activeBlockIndex === idx;
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => onSelectBlock(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E8E5A] text-white shadow-xs font-bold'
                    : 'text-[#1F4D36] hover:bg-[#1E8E5A]/10 hover:text-[#1E8E5A]'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={`text-[10px] font-mono opacity-80 ${isActive ? 'text-white' : 'text-[#E0643A]'}`}>
                  {block.number}
                </span>
                <span className="hidden sm:inline">{block.title}</span>
                <span className="inline sm:hidden">{block.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Controles de avance / retroceso y conmutador de modo */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Boton Bloque Anterior */}
          <button
            type="button"
            disabled={activeBlockIndex === 0}
            onClick={() => onSelectBlock(activeBlockIndex - 1)}
            className="p-1.5 rounded-lg border border-[#DFD4BE] text-[#1F4D36] hover:bg-[#1E8E5A]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs font-semibold"
            aria-label="Ir al bloque anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden lg:inline">Anterior</span>
          </button>

          {/* Indicador de progreso actual */}
          <span className="text-xs font-bold text-[#1F4D36] font-mono px-2">
            {activeBlockIndex + 1} / {BLOCKS.length}
          </span>

          {/* Boton Siguiente Bloque */}
          <button
            type="button"
            disabled={activeBlockIndex === BLOCKS.length - 1}
            onClick={() => onSelectBlock(activeBlockIndex + 1)}
            className="p-1.5 rounded-lg bg-[#1E8E5A] text-white hover:bg-[#163827] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs font-semibold shadow-2xs"
            aria-label="Ir al siguiente bloque"
          >
            <span className="hidden lg:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Alternar vista de Bloques Horizontales vs Scroll Continuo */}
          <button
            type="button"
            onClick={onToggleBlockMode}
            className={`ml-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isBlockMode 
                ? 'bg-[#E0643A]/10 border-[#E0643A] text-[#E0643A]' 
                : 'bg-white border-[#DFD4BE] text-[#435E50] hover:text-[#1F4D36]'
            }`}
            title={isBlockMode ? 'Cambiar a vista continua tradicional' : 'Cambiar a navegación por bloques horizontales'}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isBlockMode ? 'Modo Bloques' : 'Modo Continuo'}
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
};
