import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  ArrowRight, 
  Percent, 
  Flame, 
  ShoppingBag, 
  Gift 
} from 'lucide-react';
import { Product } from '../types/ecommerce';
import { PRODUCTS, PROMO_COUPONS } from '../data/products';

interface PromotionsSectionProps {
  onAddToCart: (product: Product, size: string) => void;
  onApplyCoupon: (code: string) => void;
  onExploreCatalog: () => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  onAddToCart,
  onApplyCoupon,
  onExploreCatalog
}) => {
  // Temporizador regresivo para Oferta Flash (ej. 14 horas restantes)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Prendas en oferta destacadas
  const offerProducts = PRODUCTS.filter(p => p.isOffer).slice(0, 4);

  return (
    <section className="space-y-10">
      
      {/* Banner Principal de Oferta Relámpago con Contador en Vivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F4D36] via-[#163827] to-[#122b1e] text-white p-6 sm:p-10 border-2 border-[#7CC242]/40 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0643A] text-white text-xs font-extrabold uppercase tracking-wider font-title shadow-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>Oferta Flash de Temporada</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-title tracking-tight text-white leading-tight">
              Hasta <span className="text-[#F4B626]">20% OFF</span> en Selección de Algodón Orgánico y Lino
            </h3>
            <p className="text-xs sm:text-sm text-[#F7F1E3]/85 leading-relaxed">
              Renueva tu armario con prendas éticas certificadas que preservan el agua y la tierra. Precios especiales por tiempo limitado en piezas seleccionadas.
            </p>
          </div>

          {/* Reloj de Cuenta Regresiva */}
          <div className="bg-[#FFFDF8]/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center shrink-0 w-full sm:w-auto">
            <span className="text-xs text-[#F4B626] font-bold uppercase tracking-wider block mb-2 font-title flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Finaliza en:</span>
            </span>
            <div className="flex items-center justify-center gap-2 font-mono">
              <div className="bg-[#1F4D36] px-3.5 py-2.5 rounded-xl border border-[#7CC242]/50 text-center min-w-[58px]">
                <span className="text-xl sm:text-2xl font-extrabold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#F7F1E3]/70 block font-sans">Horas</span>
              </div>
              <span className="text-xl font-bold text-[#F4B626]">:</span>
              <div className="bg-[#1F4D36] px-3.5 py-2.5 rounded-xl border border-[#7CC242]/50 text-center min-w-[58px]">
                <span className="text-xl sm:text-2xl font-extrabold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#F7F1E3]/70 block font-sans">Minutos</span>
              </div>
              <span className="text-xl font-bold text-[#F4B626]">:</span>
              <div className="bg-[#1F4D36] px-3.5 py-2.5 rounded-xl border border-[#7CC242]/50 text-center min-w-[58px]">
                <span className="text-xl sm:text-2xl font-extrabold text-[#E0643A]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#F7F1E3]/70 block font-sans">Segundos</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onExploreCatalog}
              className="mt-4 w-full py-2.5 px-4 bg-[#7CC242] hover:bg-[#68a637] text-[#1F4D36] font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-sm font-title"
            >
              Ver Todas las Ofertas
            </button>
          </div>

        </div>

        {/* Motivo geométrico sutil */}
        <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-[#1E8E5A]/15 blur-2xl pointer-events-none" />
      </div>

      {/* Cupones de Descuento Activos para Clientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-[#1F4D36] font-title">
              Cupones de Descuento Activos
            </h4>
            <p className="text-xs text-[#435E50]">
              Haz clic en cualquier cupón para copiarlo y aplicarlo directamente en tu carrito
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROMO_COUPONS.map((coupon) => (
            <div 
              key={coupon.code}
              className="p-4 bg-white border-2 border-dashed border-[#1E8E5A]/40 rounded-2xl hover:border-[#1E8E5A] transition-all flex flex-col justify-between shadow-2xs group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 bg-[#1E8E5A]/10 text-[#1E8E5A] text-xs font-mono font-extrabold rounded-md tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-xs font-extrabold text-[#E0643A] font-title">
                    {coupon.discountPercent > 0 ? `${coupon.discountPercent}% OFF` : 'ENVÍO GRATIS'}
                  </span>
                </div>
                <p className="text-xs text-[#1F4D36] font-medium leading-relaxed">
                  {coupon.description}
                </p>
                <p className="text-[11px] text-[#435E50] mt-1">
                  Mínimo de compra: S/ {coupon.minAmount.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                className="mt-3 w-full py-2 px-3 bg-[#F7F1E3] group-hover:bg-[#1E8E5A] group-hover:text-white text-[#1F4D36] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#7CC242]" />
                    <span>¡Copiado y Aplicado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#1E8E5A] group-hover:text-white" />
                    <span>Copiar y Usar Cupón</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prendas con Descuento en Cuadrícula */}
      <div className="space-y-4 pt-4 border-t border-[#DFD4BE]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-[#1F4D36] font-title">
              Prendas Destacadas en Promoción
            </h4>
            <p className="text-xs text-[#435E50]">
              Modelos profesionales luciendo piezas con precios reducidos y stock limitado
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreCatalog}
            className="text-xs font-bold text-[#1E8E5A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offerProducts.map((p) => (
            <article 
              key={p.id}
              className="bg-white border-2 border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl overflow-hidden shadow-xs hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Foto en proporción 4:5 */}
                <div className="relative aspect-[4/5] bg-[#F7F1E3] overflow-hidden">
                  <img
                    src={p.imageSrc}
                    alt={p.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {p.discountPercent && (
                    <span className="absolute top-2.5 left-2.5 bg-[#E0643A] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs font-title">
                      {p.discountPercent}% OFF
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 bg-[#FFFDF8]/95 backdrop-blur-xs text-[#1F4D36] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#DFD4BE]">
                    {p.ecoBadge}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#435E50] tracking-wider block">
                    {p.categoryLabel} · Ref: {p.ref}
                  </span>
                  <h5 className="font-bold text-[#1F4D36] text-sm leading-snug font-title line-clamp-2">
                    {p.name}
                  </h5>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-[#E0643A] font-title">
                      S/ {p.price.toFixed(2)}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs text-[#435E50] line-through">
                        S/ {p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => onAddToCart(p, p.sizes[0])}
                  className="w-full py-2.5 px-3 bg-[#1E8E5A] hover:bg-[#163827] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Añadir al Carrito</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
};
