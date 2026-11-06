import React from 'react';
import { 
  X, 
  Sparkles, 
  Tag, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Percent 
} from 'lucide-react';
import { Product } from '../types/ecommerce';
import { PRODUCTS } from '../data/products';

interface PromoEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (product: Product, size: string) => void;
  onViewOffers: () => void;
}

export const PromoEntryModal: React.FC<PromoEntryModalProps> = ({
  isOpen,
  onClose,
  onBuyNow,
  onViewOffers
}) => {
  if (!isOpen) return null;

  // Seleccionar 3 prendas destacadas en oferta
  const promoProducts = [
    PRODUCTS[0], // Blusa de algodón orgánico (20% OFF)
    PRODUCTS[6], // Camisa de lino prelavado (14% OFF)
    PRODUCTS[5]  // Top de punto terracota (20% OFF)
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F4D36]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDF8] border-2 border-[#E0643A]/50 rounded-3xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
      >
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-[#E0643A] hover:text-white text-[#1F4D36] transition-colors shadow-sm cursor-pointer"
          aria-label="Cerrar ventana de ofertas"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del anuncio */}
        <div className="bg-gradient-to-r from-[#1F4D36] via-[#163827] to-[#1F4D36] p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0643A] text-white text-[11px] font-extrabold uppercase tracking-widest font-title mb-2 shadow-xs">
            <Flame className="w-3.5 h-3.5" />
            <span>Ofertas Exclusivas de Temporada</span>
          </div>
          <h2 id="promo-modal-title" className="text-2xl sm:text-3xl font-extrabold font-title tracking-tight text-white leading-tight">
            Hasta <span className="text-[#F4B626]">20% OFF</span> en Moda Sostenible
          </h2>
          <p className="text-xs sm:text-sm text-[#F7F1E3]/90 mt-1 max-w-lg mx-auto leading-relaxed">
            Prendas de lino regenerativo y algodón orgánico peruano con precios especiales y <strong>Envío Gratis</strong> a todo el Perú por compras desde S/ 150.
          </p>

          <div className="mt-3 inline-block px-3 py-1 bg-white/10 rounded-lg border border-white/20 text-xs text-[#F4B626] font-mono font-bold">
            Usa el cupón: <strong>ECOMODA10</strong> para 10% adicional
          </div>
        </div>

        {/* Muestra visual de las 3 prendas en oferta con fotos de modelos */}
        <div className="p-6 space-y-4">
          <span className="text-xs font-bold text-[#435E50] uppercase tracking-wider block">
            Prendas más solicitadas en promoción:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {promoProducts.map((p) => (
              <div 
                key={p.id}
                className="bg-white border border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-[#F7F1E3] overflow-hidden">
                    <img 
                      src={p.imageSrc} 
                      alt={p.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {p.discountPercent && (
                      <span className="absolute top-2 left-2 bg-[#E0643A] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full font-title shadow-xs">
                        {p.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#435E50]">{p.categoryLabel}</span>
                    <h4 className="font-bold text-[#1F4D36] text-xs leading-snug line-clamp-1 font-title">
                      {p.name}
                    </h4>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-sm font-extrabold text-[#E0643A] font-title">
                        S/ {p.price.toFixed(2)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-[#435E50] line-through">
                          S/ {p.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBuyNow(p, p.sizes[0]);
                    }}
                    className="w-full py-2 bg-[#1E8E5A] hover:bg-[#163827] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Comprar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botones principales del modal: "Comprar ahora" y "Ver ofertas" */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onBuyNow(promoProducts[0], promoProducts[0].sizes[0]);
              }}
              className="w-full sm:flex-1 py-3.5 px-6 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar Ahora con Descuento</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewOffers();
              }}
              className="w-full sm:flex-1 py-3.5 px-6 bg-[#1F4D36] hover:bg-[#163827] text-white font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
            >
              <Tag className="w-4 h-4 text-[#F4B626]" />
              <span>Ver Todas las Ofertas</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#435E50] hover:text-[#1F4D36] hover:underline cursor-pointer"
            >
              Continuar explorando la página
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
