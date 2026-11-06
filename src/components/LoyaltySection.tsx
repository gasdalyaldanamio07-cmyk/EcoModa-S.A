import React, { useState } from 'react';
import { 
  Award, 
  Leaf, 
  Sparkles, 
  Gift, 
  Check, 
  MessageCircle, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Heart,
  Droplet
} from 'lucide-react';

interface LoyaltySectionProps {
  onJoinClubWithCoupon: (couponCode: string) => void;
}

export const LoyaltySection: React.FC<LoyaltySectionProps> = ({ onJoinClubWithCoupon }) => {
  const [emailInput, setEmailInput] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [simulatedPurchase, setSimulatedPurchase] = useState<number>(200);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubscribed(true);
    onJoinClubWithCoupon('ECOMODA10');
  };

  const calculatedPoints = Math.round(simulatedPurchase);
  const calculatedSavings = (calculatedPoints * 0.10).toFixed(2);

  return (
    <section className="space-y-12">
      
      {/* Cabecera del Club EcoModa */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E8E5A]/15 text-[#1E8E5A] text-xs font-extrabold uppercase tracking-wider font-title">
          <Award className="w-4 h-4 text-[#1E8E5A]" />
          <span>Programa de Fidelización & Beneficios</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-title">
          Club EcoModa: Estilo que Recompensa
        </h3>
        <p className="text-xs sm:text-sm text-[#435E50] leading-relaxed">
          Cada vez que eliges prendas sostenibles, sumas <strong>Puntos Verdes</strong> canjeables por descuentos exclusivos, accesos anticipados y regalos hechos a mano por artesanos peruanos.
        </p>
      </div>

      {/* 3 Niveles de Membresía */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Nivel 1: Semilla */}
        <div className="bg-white border-2 border-[#DFD4BE] rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-[#7CC242] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#435E50] uppercase tracking-wider">Nivel 1</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F7F1E3] text-[#1F4D36] text-[11px] font-bold">0 - 250 pts</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#7CC242]/20 text-[#1E8E5A] flex items-center justify-center mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-[#1F4D36] font-title mb-2">
              Semilla
            </h4>
            <p className="text-xs text-[#435E50] mb-4">
              Tu inicio en el mundo de la moda regenerativa.
            </p>
            <ul className="space-y-2 text-xs text-[#1F4D36]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>1 Punto Verde por cada S/ 1 gastado</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Regalo sorpresa en el mes de tu cumpleaños</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Cupón de bienvenida con 10% OFF</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-[#DFD4BE]/60 text-center">
            <span className="text-xs font-bold text-[#1E8E5A]">Inscripción gratuita al registrarte</span>
          </div>
        </div>

        {/* Nivel 2: Brote Verde */}
        <div className="bg-[#FFFDF8] border-2 border-[#1E8E5A] rounded-2xl p-6 shadow-md flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E8E5A] text-white px-3.5 py-0.5 rounded-full text-[11px] font-bold font-title tracking-wider uppercase">
            Más Popular
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#E0643A] uppercase tracking-wider">Nivel 2</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1E8E5A]/15 text-[#1E8E5A] text-[11px] font-bold">251 - 600 pts</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#1E8E5A] text-white flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-[#1F4D36] font-title mb-2">
              Brote Verde
            </h4>
            <p className="text-xs text-[#435E50] mb-4">
              Para amantes del estilo que eligen prendas duraderas.
            </p>
            <ul className="space-y-2 text-xs text-[#1F4D36]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>1.5 Puntos Verdes por cada S/ 1 gastado</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Envío gratis sin monto mínimo (2 veces al mes)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Acceso anticipado a colecciones 48h antes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Funda de lino reutilizable de regalo</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-[#DFD4BE]/60 text-center">
            <span className="text-xs font-bold text-[#E0643A]">Automático al acumular 251 pts</span>
          </div>
        </div>

        {/* Nivel 3: Guardián del Bosque */}
        <div className="bg-white border-2 border-[#DFD4BE] rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-[#F4B626] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#F4B626] uppercase tracking-wider">Nivel 3 VIP</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F4B626]/20 text-[#1F4D36] text-[11px] font-bold">600+ pts</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F4B626] text-[#1F4D36] flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-extrabold text-[#1F4D36] font-title mb-2">
              Guardián del Bosque
            </h4>
            <p className="text-xs text-[#435E50] mb-4">
              El máximo compromiso con el planeta y la moda ética.
            </p>
            <ul className="space-y-2 text-xs text-[#1F4D36]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>2 Puntos Verdes por cada S/ 1 gastado</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Envío gratis ILIMITADO a todo el Perú</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Asesor de moda personal dedicado en WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span>Invitación a visitas de campo en Chincha y Lurín</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-[#DFD4BE]/60 text-center">
            <span className="text-xs font-bold text-[#1F4D36]">Beneficios vitalicios activos</span>
          </div>
        </div>

      </div>

      {/* Calculadora Interactiva de Recompensas */}
      <div className="bg-[#F7F1E3] border border-[#DFD4BE] rounded-3xl p-6 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <div>
            <h4 className="text-xl font-extrabold text-[#1F4D36] font-title mb-1">
              Calcula tus Puntos Verdes
            </h4>
            <p className="text-xs text-[#435E50]">
              Mueve el selector para ver cuántos puntos y ahorro generas con tus compras en EcoModa
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-[#1F4D36]">
              <span>Monto estimado de compra:</span>
              <span className="text-lg text-[#E0643A] font-title">S/ {simulatedPurchase.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="50"
              max="800"
              step="10"
              value={simulatedPurchase}
              onChange={(e) => setSimulatedPurchase(Number(e.target.value))}
              className="w-full accent-[#1E8E5A] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#435E50]">
              <span>S/ 50</span>
              <span>S/ 400</span>
              <span>S/ 800</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-[#DFD4BE]">
              <span className="text-xs text-[#435E50] block">Puntos acumulados</span>
              <span className="text-2xl font-extrabold text-[#1E8E5A] font-title">+{calculatedPoints}</span>
              <span className="text-[10px] text-[#1E8E5A] block mt-0.5">Puntos Verdes listos</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DFD4BE]">
              <span className="text-xs text-[#435E50] block">Descuento canjeable</span>
              <span className="text-2xl font-extrabold text-[#E0643A] font-title">S/ {calculatedSavings}</span>
              <span className="text-[10px] text-[#435E50] block mt-0.5">Para tu siguiente pedido</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Suscripción VIP con Cupón Inmediato */}
      <div className="bg-gradient-to-r from-[#1E8E5A] to-[#1F4D36] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
        <div className="space-y-2 text-center md:text-left max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-[#F4B626]" />
            <span>Regalo de Bienvenida</span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-title leading-tight">
            Únete al Club y recibe 10% OFF inmediato
          </h4>
          <p className="text-xs sm:text-sm text-[#F7F1E3]/85 leading-relaxed">
            Te enviaremos novedades de temporada, acceso anticipado a ofertas y el código de descuento directo a tu correo o WhatsApp.
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0">
          {isSubscribed ? (
            <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/30 text-center space-y-1">
              <Check className="w-8 h-8 text-[#7CC242] mx-auto" />
              <p className="font-bold text-sm">¡Bienvenido al Club EcoModa!</p>
              <p className="text-xs text-[#F7F1E3]">
                Tu cupón <strong>ECOMODA10</strong> ha sido activado en tu carrito.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3 w-full sm:w-80">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 rounded-xl bg-white text-[#1F4D36] text-xs font-medium placeholder-[#435E50]/70 focus-visible:outline-2 focus-visible:outline-[#F4B626]"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer font-title"
              >
                Suscribirme y Obtener Cupón
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Asesoría de Estilo Sostenible Personalizada */}
      <div className="p-6 bg-white border border-[#DFD4BE] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-bold text-[#1F4D36] text-base font-title">
              ¿Dudas con tu talla o cómo combinar tu look?
            </h5>
            <p className="text-xs text-[#435E50]">
              Nuestros asesores de moda en Lima te ayudan en tiempo real sin ningún costo.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/51998765432?text=Hola%2C%20quisiera%20asesor%C3%ADa%20personalizada%20de%20estilo%20en%20EcoModa"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0 font-title"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>

    </section>
  );
};
