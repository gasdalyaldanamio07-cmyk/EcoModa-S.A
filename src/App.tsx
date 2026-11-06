/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * EcoModa - Plataforma Moderna de Moda Sostenible en Perú
 * Diseñada para máxima interactividad, navegación por bloques, carrito de compras,
 * pasarelas de pago peruanas reales (Yape, Plin, Transferencias, Tarjetas, Contra entrega),
 * ofertas flash, club de fidelización y armador de outfits.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Copy, 
  Check, 
  Send, 
  Droplet, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Tag, 
  Award, 
  MessageCircle, 
  Sun, 
  Recycle, 
  CheckCircle2,
  Lock,
  ArrowRight,
  FileDown,
  Instagram,
  Facebook
} from 'lucide-react';

import { Product, CartItem, PromoCoupon, OrderConfirmation } from './types/ecommerce';
import { PRODUCTS, PROMO_COUPONS, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from './data/products';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { HorizontalBlocksNav, BLOCKS } from './components/HorizontalBlocksNav';
import { BackToHomeButton } from './components/BackToHomeButton';
import { CatalogSection } from './components/CatalogSection';
import { PromotionsSection } from './components/PromotionsSection';
import { LoyaltySection } from './components/LoyaltySection';
import { PromoEntryModal } from './components/PromoEntryModal';
import { ContactSection } from './components/ContactSection';

// Rutas de imágenes y video fijadas localmente
const HERO_IMAGE = '/assets/images/hero_sustainable_fashion_1793939690848.jpg';
const MENS_IMAGE = '/assets/images/mens_collection_linen_1793939690888.jpg';
const CRAFT_IMAGE = '/assets/images/durable_clothing_craft_1793939691230.jpg';
const CITIES_IMAGE = '/assets/images/cities_peru_sustainable_1793939692834.jpg';

const HERO_VIDEO_SRC = '/hero_video.mp4';
const HERO_VIDEO_FALLBACK_SRC = '/WhatsApp_Video_2026-11-06_at_12_13_34_AM_1.mp4';

const WHATSAPP_PHONE = '51998765432';

// Helper para iconos de etiquetas sostenibles
function renderEcoTagIcon(badge: string) {
  if (badge.includes('Algodón')) return <Droplet className="w-3.5 h-3.5 text-[#1E8E5A]" />;
  if (badge.includes('Recicla') || badge.includes('recicla') || badge.includes('PET')) return <Recycle className="w-3.5 h-3.5 text-[#1E8E5A]" />;
  if (badge.includes('Tinte') || badge.includes('tinte')) return <Sun className="w-3.5 h-3.5 text-[#E0643A]" />;
  return <Leaf className="w-3.5 h-3.5 text-[#1E8E5A]" />;
}

export function App() {
  // Navegación por bloques y modo
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [isBlockMode, setIsBlockMode] = useState(true);

  // Carrito y Checkout
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Prenda de bienvenida en el carrito para que el usuario pueda explorar de inmediato
    {
      product: PRODUCTS[0],
      selectedSize: 'M',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(true); // Ventana emergente de ofertas al inicio
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(PROMO_COUPONS[0]); // ECOMODA10 aplicado por defecto
  const [lastOrder, setLastOrder] = useState<OrderConfirmation | null>(null);

  // Estado del video Hero de fondo
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Armador de Outfits
  const [selectedTopIndex, setSelectedTopIndex] = useState(0);
  const [selectedBottomIndex, setSelectedBottomIndex] = useState(0);
  const [selectedAccIndex, setSelectedAccIndex] = useState(0);
  const [copiedOutfit, setCopiedOutfit] = useState(false);
  const [outfitAddedAlert, setOutfitAddedAlert] = useState(false);

  // Menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Formulario legal de contacto
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCity, setContactCity] = useState('Lima');
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentWhatsApp, setConsentWhatsApp] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  // Items superiores, inferiores y accesorios para el armador
  const topsList = PRODUCTS.filter(p => p.category === 'mujer' || p.category === 'hombre').slice(0, 4);
  const bottomsList = PRODUCTS.filter(p => p.category === 'mujer' || p.category === 'hombre').slice(4, 8);
  const accessoriesList = PRODUCTS.filter(p => p.category === 'accesorio').slice(0, 4);

  const currentTop = topsList[selectedTopIndex] || PRODUCTS[0];
  const currentBottom = bottomsList[selectedBottomIndex] || PRODUCTS[4];
  const currentAcc = accessoriesList[selectedAccIndex] || PRODUCTS[12];
  const totalWaterSaved = currentTop.waterSavedLiters + currentBottom.waterSavedLiters + currentAcc.waterSavedLiters;

  // Video controles
  const togglePlayVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const toggleMuteVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Carrito handlers
  const handleAddToCart = (product: Product, size: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i => 
          i.product.id === product.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, selectedSize: size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, size: string) => {
    handleAddToCart(product, size);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems(prev => prev.map(i => 
      i.product.id === productId && i.selectedSize === size
        ? { ...i, quantity }
        : i
    ));
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size)));
  };

  // Agregar look completo al carrito
  const handleAddFullOutfitToCart = () => {
    setCartItems(prev => {
      const itemsToAdd = [
        { product: currentTop, selectedSize: currentTop.sizes[0], quantity: 1 },
        { product: currentBottom, selectedSize: currentBottom.sizes[0], quantity: 1 },
        { product: currentAcc, selectedSize: currentAcc.sizes[0], quantity: 1 }
      ];

      let updated = [...prev];
      for (const item of itemsToAdd) {
        const found = updated.find(i => i.product.id === item.product.id && i.selectedSize === item.selectedSize);
        if (found) {
          updated = updated.map(i => i === found ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
          updated.push(item);
        }
      }
      return updated;
    });

    // Auto-aplicar cupón si no hay
    if (!appliedCoupon) {
      setAppliedCoupon(PROMO_COUPONS[0]);
    }

    setOutfitAddedAlert(true);
    setTimeout(() => {
      setOutfitAddedAlert(false);
      setIsCartOpen(true);
    }, 1200);
  };

  // Navegacion a bloque especifico
  const handleSelectBlock = (index: number) => {
    setActiveBlockIndex(index);
    if (!isBlockMode) {
      const blockId = BLOCKS[index].id;
      const el = document.getElementById(blockId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculos de totales para el checkout
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'ENVIOGRATIS') {
      discountAmount = 0;
    } else {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    }
  }
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.code === 'ENVIOGRATIS';
  const shippingCost = cartItems.length === 0 ? 0 : (qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_COST);
  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Formulario de suscripcion legal
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess('');

    if (!contactName.trim()) {
      setContactError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!consentEmail && !consentWhatsApp) {
      setContactError('Selecciona al menos un canal de comunicación (correo o WhatsApp) conforme a la Ley N.° 29733.');
      return;
    }
    if (consentEmail && (!contactEmail.trim() || !contactEmail.includes('@'))) {
      setContactError('Ingresa un correo electrónico válido.');
      return;
    }
    if (consentWhatsApp && (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length < 9)) {
      setContactError('Ingresa un número de celular peruano válido (9 dígitos).');
      return;
    }

    setContactSuccess(`¡Bienvenido(a) a EcoModa, ${contactName}! Hemos registrado tu consentimiento. Te enviamos el cupón ECOMODA10.`);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setConsentEmail(false);
    setConsentWhatsApp(false);
  };

  return (
    <div className="relative min-h-screen bg-[#F7F1E3] text-[#1F4D36] font-sans selection:bg-[#7CC242]/30 selection:text-[#1F4D36]">
      
      {/* 0. VIDEO DE FONDO GLOBAL FIJO EN TODA LA PÁGINA */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#1F4D36]">
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="hero-video-bg w-full h-full object-cover object-center"
            aria-hidden="true"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
            <source src={HERO_VIDEO_FALLBACK_SRC} type="video/mp4" />
          </video>
        )}
        <div 
          className="absolute inset-0 bg-[#1F4D36]/65 pointer-events-none transition-opacity duration-500" 
          style={{ opacity: immersiveMode ? 0.20 : 0.65 }}
          aria-hidden="true" 
        />
      </div>

      {/* 1. BARRA SUPERIOR PROMOCIONAL ROTATIVA */}
      <div className="relative z-50 bg-[#1F4D36] text-[#F7F1E3] px-4 py-2 text-xs border-b border-[#7CC242]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7CC242] animate-pulse" />
            <span>
              <strong>🎉 Envíos GRATIS</strong> a todo el Perú por compras desde S/ 150 · Usa el cupón <strong className="text-[#F4B626] font-mono">ECOMODA10</strong> para 10% OFF
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-[#DFD4BE]">
            <button
              type="button"
              onClick={() => setIsPromoModalOpen(true)}
              className="text-[#F4B626] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Tag className="w-3 h-3 text-[#F4B626]" />
              <span>Ver Ofertas de Temporada</span>
            </button>
            <span className="hidden md:inline">·</span>
            <a 
              href="/catalogo-ecomoda.pdf"
              download="Catalogo-EcoModa-2026.pdf"
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
              title="Descargar catálogo oficial en PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-[#7CC242]" />
              <span>Descargar Catálogo (PDF)</span>
            </a>
            <span className="hidden md:inline">·</span>
            <a 
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola EcoModa, quiero realizar una consulta sobre productos, precios y promociones')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Oficial</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. ENCABEZADO FIJO PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#DFD4BE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Oficial EcoModa */}
          <button 
            type="button"
            onClick={() => handleSelectBlock(0)}
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[#1E8E5A] rounded p-1 cursor-pointer"
            aria-label="EcoModa, volver al inicio"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 520 180" 
              role="img" 
              aria-label="EcoModa, moda sostenible, estilo con propósito" 
              className="h-10 sm:h-12 w-auto"
            >
              <g fill="#1E8E5A">
                <path d="M430 118 C398 110 386 78 400 46 C426 72 436 96 430 118 Z"/>
                <path d="M430 118 C452 102 480 92 494 60 C468 66 444 88 430 118 Z"/>
                <path d="M430 118 L430 92" stroke="#1E8E5A" strokeWidth="5" strokeLinecap="round"/>
              </g>
              <text x="18" y="126" fontFamily="Montserrat, Arial, sans-serif" fontWeight="800" fontSize="74" letterSpacing="-1" fill="#1E8E5A">Eco<tspan fill="#E0643A">Moda</tspan></text>
              <text x="22" y="162" fontFamily="Open Sans, Arial, sans-serif" fontWeight="600" fontSize="17" fill="#1F4D36">Moda sostenible, estilo con propósito</text>
            </svg>
          </button>

          {/* Menú de Navegación por Capítulos en Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-[#1F4D36]">
            {BLOCKS.map((block, idx) => (
              <button
                key={block.id}
                type="button"
                onClick={() => handleSelectBlock(idx)}
                className={`py-1 transition-colors border-b-2 cursor-pointer ${
                  activeBlockIndex === idx
                    ? 'text-[#1E8E5A] border-[#1E8E5A]'
                    : 'border-transparent hover:text-[#E0643A]'
                }`}
              >
                {block.shortTitle}
              </button>
            ))}
          </nav>

          {/* Acciones del Header: Descargar Catálogo, Carrito y CTA */}
          <div className="flex items-center gap-2.5">
            
            {/* Botón Descargar Catálogo en Header */}
            <a
              href="/catalogo-ecomoda.pdf"
              download="Catalogo-EcoModa-2026.pdf"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#F7F1E3] hover:bg-[#1E8E5A] text-[#1F4D36] hover:text-white border border-[#DFD4BE] hover:border-[#1E8E5A] rounded-xl text-xs font-bold transition-all shadow-2xs font-title cursor-pointer"
              title="Descargar catálogo oficial en formato PDF para celular o computadora"
            >
              <FileDown className="w-4 h-4 text-[#1E8E5A] group-hover:text-white" />
              <span>Descargar Catálogo</span>
            </a>

            {/* Botón Carrito de Compras */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#1E8E5A]/40 hover:border-[#1E8E5A] text-[#1F4D36] hover:bg-[#1E8E5A]/10 transition-all cursor-pointer shadow-2xs flex items-center gap-2"
              aria-label={`Ver carrito con ${totalCartCount} prendas`}
            >
              <ShoppingBag className="w-5 h-5 text-[#1E8E5A]" />
              <span className="hidden sm:inline text-xs font-extrabold font-title">
                S/ {subtotal.toFixed(2)}
              </span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E0643A] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Botón Ver Catálogo Rápido */}
            <button
              type="button"
              onClick={() => handleSelectBlock(1)}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 bg-[#E0643A] hover:bg-[#c8542c] text-white font-bold text-xs tracking-wide rounded-xl transition-all shadow-sm cursor-pointer font-title"
            >
              Comprar Ahora
            </button>

            {/* Botón Menú Móvil */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1F4D36] hover:text-[#E0643A] rounded-xl border border-[#DFD4BE]"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Menú desplegable en móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 bg-[#FFFDF8] border-t border-[#DFD4BE] space-y-2.5 text-sm font-bold text-[#1F4D36]">
            {BLOCKS.map((block, idx) => (
              <button
                key={block.id}
                type="button"
                onClick={() => {
                  handleSelectBlock(idx);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between ${
                  activeBlockIndex === idx ? 'bg-[#1E8E5A] text-white' : 'hover:bg-[#F7F1E3]'
                }`}
              >
                <span>{block.number}. {block.title}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            ))}

            <div className="pt-2 border-t border-[#DFD4BE] space-y-2">
              <a
                href="/catalogo-ecomoda.pdf"
                download="Catalogo-EcoModa-2026.pdf"
                className="w-full py-2.5 px-3 rounded-lg bg-[#1E8E5A] text-white font-bold flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  <span>Descargar Catálogo (PDF)</span>
                </span>
                <span className="opacity-80">PDF</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPromoModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-[#E0643A] text-white font-bold flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Ver Ofertas Especiales</span>
                </span>
                <span>🔥</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. NAVEGACIÓN HORIZONTAL POR BLOQUES (Tabs y controles adelante/atrás) */}
      <HorizontalBlocksNav
        activeBlockIndex={activeBlockIndex}
        onSelectBlock={handleSelectBlock}
        isBlockMode={isBlockMode}
        onToggleBlockMode={() => setIsBlockMode(!isBlockMode)}
      />

      {/* 4. CONTENIDO PRINCIPAL (En modo bloque horizontal deslizable o continuo) */}
      <main className="relative z-10 overflow-hidden">
        
        <div 
          className={
            isBlockMode 
              ? 'flex transition-transform duration-700 ease-in-out w-full' 
              : 'space-y-16'
          }
          style={
            isBlockMode 
              ? { transform: `translateX(-${activeBlockIndex * 100}%)` } 
              : undefined
          }
        >
          
          {/* =========================================================================
              BLOQUE 0: INICIO & HERO DE ALTA COSTURA SOSTENIBLE
              ========================================================================= */}
          <div 
            id="block-hero" 
            className={isBlockMode ? 'min-w-full w-full shrink-0' : 'w-full'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
              
              {/* Presentación Hero */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1F4D36]/80 to-[#1F4D36]/95 border-2 border-[#DFD4BE]/60 p-8 sm:p-14 text-white shadow-2xl">
                <div className="max-w-3xl space-y-6">
                  
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8]/15 backdrop-blur-md border border-[#7CC242]/50 text-xs font-bold text-[#F7F1E3]">
                    <Leaf className="w-3.5 h-3.5 text-[#7CC242]" />
                    <span>Moda Sostenible · Hecho éticamente en el Perú</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-title tracking-tight text-white leading-tight">
                    Ropa que se ve bien, <span className="text-[#7CC242]">dura más</span> y cuida el planeta.
                  </h1>

                  <p className="text-base sm:text-xl text-[#F7F1E3]/90 leading-relaxed max-w-2xl">
                    Prendas de lino regenerativo y algodón pima orgánico certificado. Estilo atemporal sin tintes químicos tóxicos ni desperdicio textil.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectBlock(1)}
                      className="px-6 py-4 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer font-title"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Explorar Catálogo 2026</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectBlock(2)}
                      className="px-6 py-4 bg-[#FFFDF8] hover:bg-[#F7F1E3] text-[#1F4D36] font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer font-title"
                    >
                      <Sparkles className="w-4 h-4 text-[#1E8E5A]" />
                      <span>Armar Look en 15s</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPromoModalOpen(true)}
                      className="px-5 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-xs border border-white/30 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-[#F4B626]" />
                      <span>Ver Ofertas Flash</span>
                    </button>

                    <a
                      href="/catalogo-ecomoda.pdf"
                      download="Catalogo-EcoModa-2026.pdf"
                      className="px-5 py-4 bg-[#7CC242] hover:bg-[#68a637] text-[#1F4D36] font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer font-title"
                      title="Descargar catálogo de productos en PDF"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Descargar Catálogo (PDF)</span>
                    </a>
                  </div>

                  {/* Controles del video de fondo */}
                  <div className="pt-4 flex items-center gap-3 text-xs text-[#F7F1E3]/80">
                    <button
                      type="button"
                      onClick={togglePlayVideo}
                      className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isVideoPlaying ? 'Pausar Video' : 'Reproducir'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImmersiveMode(!immersiveMode)}
                      className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      {immersiveMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{immersiveMode ? 'Texto Nítido' : 'Modo Video Cine'}</span>
                    </button>
                  </div>

                </div>

                {/* Métricas destacadas en barra inferior */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/20 text-xs">
                  <div>
                    <span className="text-2xl font-extrabold font-title text-[#7CC242] block">1,200 L</span>
                    <span className="text-[#F7F1E3]/80">Agua ahorrada promedio por prenda</span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold font-title text-[#F4B626] block">100%</span>
                    <span className="text-[#F7F1E3]/80">Fibras orgánicas y lino puro</span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold font-title text-[#2BB3A8] block">4 Ciudades</span>
                    <span className="text-[#F7F1E3]/80">Lima, Arequipa, Trujillo y Piura</span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold font-title text-[#E0643A] block">0 Plásticos</span>
                    <span className="text-[#F7F1E3]/80">Empaques 100% de tela de lino</span>
                  </div>
                </div>
              </div>

              {/* Colecciones Especiales: Masculina y Artesanía de Alta Duración */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <article className="border-2 border-[#DFD4BE] rounded-3xl overflow-hidden bg-[#FFFDF8] shadow-md hover:border-[#7CC242] transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-72 sm:h-80 overflow-hidden bg-[#F7F1E3]">
                      <img 
                        src={MENS_IMAGE} 
                        alt="Hombre vistiendo camisa de lino y chino orgánico EcoModa" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 bg-[#FFFDF8]/95 px-3 py-1 text-xs font-extrabold text-[#1F4D36] rounded-full shadow-xs">
                        Nueva Línea Masculina
                      </span>
                    </div>
                    <div className="p-6 sm:p-8 space-y-3">
                      <h3 className="text-2xl font-extrabold text-[#1F4D36] font-title">
                        Estilo moderno para él, sin dañar el planeta
                      </h3>
                      <p className="text-xs sm:text-sm text-[#435E50] leading-relaxed">
                        Corte moderno y telas responsables. Camisas de lino prelavado y polos en algodón pima que ofrecen frescura térmica natural y tacto ultrasuave.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 pt-0">
                    <button
                      type="button"
                      onClick={() => handleSelectBlock(1)}
                      className="w-full py-3.5 bg-[#1E8E5A] hover:bg-[#163827] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-title"
                    >
                      <span>Ver Colección Masculina</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>

                <article className="border-2 border-[#DFD4BE] rounded-3xl overflow-hidden bg-[#FFFDF8] shadow-md hover:border-[#7CC242] transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-72 sm:h-80 overflow-hidden bg-[#F7F1E3]">
                      <img 
                        src={CRAFT_IMAGE} 
                        alt="Prendas duraderas con costuras dobles y botones de madera natural" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 bg-[#FFFDF8]/95 px-3 py-1 text-xs font-extrabold text-[#E0643A] rounded-full shadow-xs">
                        Artesanía & Alta Calidad
                      </span>
                    </div>
                    <div className="p-6 sm:p-8 space-y-3">
                      <h3 className="text-2xl font-extrabold text-[#1F4D36] font-title">
                        Ropa que dura por años
                      </h3>
                      <p className="text-xs sm:text-sm text-[#435E50] leading-relaxed">
                        Diseñamos con costuras dobles de alta resistencia, botones de semillas naturales y patrones anatómicos que evitan el desgaste prematuro.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 pt-0">
                    <button
                      type="button"
                      onClick={() => handleSelectBlock(2)}
                      className="w-full py-3.5 bg-[#E0643A] hover:bg-[#c8542c] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-title"
                    >
                      <span>Combinar Prendas en el Armador</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>

              </div>

            </div>
          </div>

          {/* =========================================================================
              BLOQUE 1: CATÁLOGO OFICIAL Y TIENDA ONLINE
              ========================================================================= */}
          <div 
            id="block-catalog" 
            className={isBlockMode ? 'min-w-full w-full shrink-0' : 'w-full'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <CatalogSection 
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>

          {/* =========================================================================
              BLOQUE 2: ARMADOR INTERACTIVO DE OUTFITS
              ========================================================================= */}
          <div 
            id="block-outfit" 
            className={isBlockMode ? 'min-w-full w-full shrink-0' : 'w-full'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD4BE] pb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E0643A] font-title">
                    Experiencia Interactiva
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-title mt-1">
                    Arma tu Outfit Sostenible en 15 Segundos
                  </h3>
                  <p className="text-xs sm:text-sm text-[#435E50] max-w-xl mt-1 leading-relaxed">
                    Elige una prenda superior, una inferior y un accesorio artesanal. Descubre tu estilo y el ahorro hídrico exacto que generas en el Perú.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopIndex(Math.floor(Math.random() * topsList.length));
                      setSelectedBottomIndex(Math.floor(Math.random() * bottomsList.length));
                      setSelectedAccIndex(Math.floor(Math.random() * accessoriesList.length));
                    }}
                    className="px-4 py-2.5 bg-white border border-[#1E8E5A] text-[#1E8E5A] hover:bg-[#1E8E5A] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Combinar al Azar</span>
                  </button>
                </div>
              </div>

              {/* Las 3 Tarjetas del Carrusel Paso a Paso */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Paso 1: Superior */}
                <article className="bg-[#FFFDF8] border-2 border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold uppercase text-[#E0643A] font-title">
                        Paso 1 · Superior
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1F4D36]">
                        {selectedTopIndex + 1}/{topsList.length}
                      </span>
                    </div>

                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-[#DFD4BE] bg-[#F7F1E3] group">
                      <img
                        src={currentTop.imageSrc}
                        alt={currentTop.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-[#FFFDF8]/95 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1F4D36] border border-[#DFD4BE] shadow-2xs">
                        {currentTop.ecoBadge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#1F4D36] text-base font-title mb-1">
                      {currentTop.name}
                    </h4>
                    <p className="text-xs text-[#435E50] mb-2">
                      {currentTop.material} · {currentTop.color}
                    </p>
                    <div className="text-xl font-extrabold text-[#E0643A] font-title">
                      S/ {currentTop.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-3 mt-3 border-t border-[#DFD4BE]">
                    {topsList.map((top, idx) => (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => setSelectedTopIndex(idx)}
                        className={`p-2 text-[11px] text-center rounded-lg border font-bold transition-all cursor-pointer truncate ${
                          selectedTopIndex === idx
                            ? 'bg-[#1E8E5A] text-white border-[#1E8E5A]'
                            : 'bg-white text-[#1F4D36] border-[#DFD4BE] hover:border-[#1E8E5A]'
                        }`}
                      >
                        {top.name.split(' ')[0]} {top.name.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </article>

                {/* Paso 2: Inferior */}
                <article className="bg-[#FFFDF8] border-2 border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold uppercase text-[#E0643A] font-title">
                        Paso 2 · Inferior
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1F4D36]">
                        {selectedBottomIndex + 1}/{bottomsList.length}
                      </span>
                    </div>

                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-[#DFD4BE] bg-[#F7F1E3] group">
                      <img
                        src={currentBottom.imageSrc}
                        alt={currentBottom.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-[#FFFDF8]/95 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1F4D36] border border-[#DFD4BE] shadow-2xs">
                        {currentBottom.ecoBadge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#1F4D36] text-base font-title mb-1">
                      {currentBottom.name}
                    </h4>
                    <p className="text-xs text-[#435E50] mb-2">
                      {currentBottom.material} · {currentBottom.color}
                    </p>
                    <div className="text-xl font-extrabold text-[#E0643A] font-title">
                      S/ {currentBottom.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-3 mt-3 border-t border-[#DFD4BE]">
                    {bottomsList.map((bot, idx) => (
                      <button
                        key={bot.id}
                        type="button"
                        onClick={() => setSelectedBottomIndex(idx)}
                        className={`p-2 text-[11px] text-center rounded-lg border font-bold transition-all cursor-pointer truncate ${
                          selectedBottomIndex === idx
                            ? 'bg-[#1E8E5A] text-white border-[#1E8E5A]'
                            : 'bg-white text-[#1F4D36] border-[#DFD4BE] hover:border-[#1E8E5A]'
                        }`}
                      >
                        {bot.name.split(' ')[0]} {bot.name.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </article>

                {/* Paso 3: Accesorio */}
                <article className="bg-[#FFFDF8] border-2 border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold uppercase text-[#E0643A] font-title">
                        Paso 3 · Accesorio
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1F4D36]">
                        {selectedAccIndex + 1}/{accessoriesList.length}
                      </span>
                    </div>

                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-[#DFD4BE] bg-[#F7F1E3] group">
                      <img
                        src={currentAcc.imageSrc}
                        alt={currentAcc.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-[#FFFDF8]/95 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1F4D36] border border-[#DFD4BE] shadow-2xs">
                        {currentAcc.ecoBadge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#1F4D36] text-base font-title mb-1">
                      {currentAcc.name}
                    </h4>
                    <p className="text-xs text-[#435E50] mb-2">
                      {currentAcc.material} · {currentAcc.color}
                    </p>
                    <div className="text-xl font-extrabold text-[#E0643A] font-title">
                      S/ {currentAcc.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-3 mt-3 border-t border-[#DFD4BE]">
                    {accessoriesList.map((acc, idx) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedAccIndex(idx)}
                        className={`p-2 text-[11px] text-center rounded-lg border font-bold transition-all cursor-pointer truncate ${
                          selectedAccIndex === idx
                            ? 'bg-[#1E8E5A] text-white border-[#1E8E5A]'
                            : 'bg-white text-[#1F4D36] border-[#DFD4BE] hover:border-[#1E8E5A]'
                        }`}
                      >
                        {acc.name.split(' ')[0]} {acc.name.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </article>

              </div>

              {/* Resumen de tu Look con Botón de Compra Directa de Combo */}
              <div className="bg-[#FFFDF8] border-2 border-[#1E8E5A] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  
                  <div className="space-y-2 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#E0643A] uppercase tracking-wider font-title">
                      <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />
                      <span>Resumen de tu Look Sostenible</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#1F4D36]">
                      <strong>{currentTop.name}</strong> + <strong>{currentBottom.name}</strong> + <strong>{currentAcc.name}</strong>
                    </p>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 text-[#1E8E5A] font-bold bg-[#1E8E5A]/10 px-3 py-1 rounded-full">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>Ahorro hídrico: {totalWaterSaved.toLocaleString('es-PE')} L de agua</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#1F4D36] font-bold bg-[#F4B626]/25 px-3 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-[#E0643A]" />
                        <span>Total Look: S/ {(currentTop.price + currentBottom.price + currentAcc.price).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleAddFullOutfitToCart}
                      className="px-6 py-4 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer font-title"
                    >
                      {outfitAddedAlert ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>¡Look añadido al Carrito!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Añadir Look Completo al Carrito (10% OFF)</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hola EcoModa, quiero comprar el look completo: ${currentTop.name}, ${currentBottom.name} y ${currentAcc.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Pedir por WhatsApp</span>
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* =========================================================================
              BLOQUE 3: OFERTAS & PROMOCIONES FLASH
              ========================================================================= */}
          <div 
            id="block-promos" 
            className={isBlockMode ? 'min-w-full w-full shrink-0' : 'w-full'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <PromotionsSection 
                onAddToCart={handleAddToCart}
                onApplyCoupon={(code) => {
                  const c = PROMO_COUPONS.find(item => item.code === code);
                  if (c) setAppliedCoupon(c);
                }}
                onExploreCatalog={() => handleSelectBlock(1)}
              />
            </div>
          </div>

          {/* =========================================================================
              BLOQUE 4: CLUB ECOMODA & FIDELIZACIÓN DE CLIENTES
              ========================================================================= */}
          <div 
            id="block-club" 
            className={isBlockMode ? 'min-w-full w-full shrink-0' : 'w-full'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <LoyaltySection 
                onJoinClubWithCoupon={(code) => {
                  const c = PROMO_COUPONS.find(item => item.code === code);
                  if (c) setAppliedCoupon(c);
                  setIsCartOpen(true);
                }}
              />
            </div>
          </div>

          {/* =========================================================================
              BLOQUE 5: SOSTENIBILIDAD, CIUDADES DEL PERÚ & CONTACTO
              ========================================================================= */}
          <div 
            id="block-impact" 
            className={isBlockMode ? 'min-w-full w-full shrink-0' : 'w-full'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
              
              {/* Presencia en 4 Ciudades de Perú */}
              <div>
                <div className="max-w-2xl mb-8">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E0643A] font-title">
                    Presencia Descentralizada
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-title mt-1">
                    Moda Sostenible en cada Ciudad del Perú
                  </h3>
                  <p className="text-xs sm:text-sm text-[#435E50] mt-1 leading-relaxed">
                    Nuestras prendas están formuladas con fibras termorreguladoras adaptadas al clima de cada región.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { city: 'Lima', desc: 'Entregas en bicicleta y showroom con cita previa', tag: 'Lino templado', note: 'Envío en 24h' },
                    { city: 'Arequipa', desc: 'Prendas en tonos tierra y texturas inspiradas en el sillar', tag: 'Algodón pima', note: 'Envío en 48h' },
                    { city: 'Trujillo', desc: 'Ropa duradera con empaque de lino reutilizable', tag: 'Tinte botánico', note: 'Envío en 48h' },
                    { city: 'Piura', desc: 'Lino fresco y algodón ultratranspirable para el norte cálido', tag: 'Frescura térmica', note: 'Envío en 48h' }
                  ].map((c) => (
                    <div 
                      key={c.city}
                      className="bg-white border-2 border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:-translate-y-1"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-[#E0643A] uppercase font-title">{c.tag}</span>
                          <MapPin className="w-4 h-4 text-[#1E8E5A]" />
                        </div>
                        <h4 className="text-2xl font-extrabold text-[#1F4D36] font-title mb-2">{c.city}</h4>
                        <p className="text-xs text-[#435E50] leading-relaxed mb-4">{c.desc}</p>
                      </div>
                      <div className="pt-3 border-t border-[#DFD4BE] text-xs font-bold text-[#1E8E5A]">
                        {c.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fotografía de Ciudades y Cultura Peruana */}
              <div className="border border-[#DFD4BE] rounded-3xl p-6 bg-[#FFFDF8] shadow-xs flex flex-col md:flex-row items-center gap-6">
                <img 
                  src={CITIES_IMAGE} 
                  alt="Moda sostenible en calles históricas peruanas" 
                  className="w-full md:w-64 h-44 object-cover rounded-2xl border border-[#DFD4BE]"
                  loading="lazy"
                />
                <div className="space-y-2">
                  <h4 className="text-lg font-extrabold text-[#1F4D36] font-title">
                    Trazabilidad transparente de Chincha a todo el Perú
                  </h4>
                  <p className="text-xs sm:text-sm text-[#435E50] leading-relaxed">
                    Reutilizamos fotos y videos en varias redes, trabajamos con luz natural y evitamos imprimir material. Nuestros catálogos son 100% digitales y cada compra apoya a tejedores artesanales del sur y norte del país.
                  </p>
                </div>
              </div>

              {/* Formulario de Suscripción Conforme a la Ley N.° 29733 */}
              <div className="bg-[#1F4D36] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-extrabold text-[#7CC242] uppercase tracking-wider font-title">
                      Comunidad EcoModa
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-title">
                      Suscríbete y recibe asesoría de moda ética
                    </h3>
                    <p className="text-xs sm:text-sm text-[#F7F1E3]/85 leading-relaxed">
                      Respetamos tu privacidad. Conforme a la Ley N.° 29733 de Protección de Datos Personales, tus datos solo se usarán para los fines que expresamente autorices.
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#DFD4BE] uppercase mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1F4D36] text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[#7CC242]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#DFD4BE] uppercase mb-1">Ciudad en Perú *</label>
                        <select
                          value={contactCity}
                          onChange={(e) => setContactCity(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1F4D36] text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[#7CC242]"
                        >
                          <option value="Lima">Lima</option>
                          <option value="Arequipa">Arequipa</option>
                          <option value="Trujillo">Trujillo</option>
                          <option value="Piura">Piura</option>
                          <option value="Otra">Otra provincia</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#DFD4BE] uppercase mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1F4D36] text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[#7CC242]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#DFD4BE] uppercase mb-1">WhatsApp (+51)</label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="999 000 000"
                          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#1F4D36] text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[#7CC242]"
                        />
                      </div>
                    </div>

                    {/* Casillas de consentimiento explícito */}
                    <div className="space-y-2 pt-2 text-xs text-[#F7F1E3]/90">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentEmail}
                          onChange={(e) => setConsentEmail(e.target.checked)}
                          className="mt-0.5 accent-[#7CC242] w-4 h-4 rounded"
                        />
                        <span>Autorizo el envío de promociones y novedades a mi correo electrónico.</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentWhatsApp}
                          onChange={(e) => setConsentWhatsApp(e.target.checked)}
                          className="mt-0.5 accent-[#7CC242] w-4 h-4 rounded"
                        />
                        <span>Autorizo el contacto directo y recordatorios de pedidos vía WhatsApp (+51).</span>
                      </label>
                    </div>

                    {contactError && <p className="text-xs text-[#E0643A] font-bold">{contactError}</p>}
                    {contactSuccess && <p className="text-xs text-[#7CC242] font-bold">{contactSuccess}</p>}

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer font-title shadow-md"
                    >
                      Registrarme y Activar Beneficios
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* 5. PIE DE PÁGINA OFICIAL */}
      <footer className="relative z-10 bg-[#163827] text-[#DFD4BE] border-t border-[#7CC242]/30 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-extrabold text-xl text-white font-title block">EcoModa</span>
              <p className="text-xs text-[#DFD4BE]/80 leading-relaxed">
                Moda sostenible, estilo con propósito. Prendas éticas con certificación ambiental para todo el Perú.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-title">Navegación Rápida</h5>
              <ul className="space-y-1.5 text-xs">
                {BLOCKS.map((b, idx) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectBlock(idx)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {b.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-title">Métodos de Pago Aceptados</h5>
              <p className="text-xs text-[#DFD4BE]/80 leading-relaxed mb-3">
                Yape, Plin, Transferencias BCP/BBVA/Interbank, Tarjetas Visa y Mastercard, Pago Contra Entrega.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-[#742284] text-white rounded">YAPE</span>
                <span className="px-2 py-0.5 bg-[#00A4D3] text-white rounded">PLIN</span>
                <span className="px-2 py-0.5 bg-[#1A1F71] text-white rounded">VISA</span>
                <span className="px-2 py-0.5 bg-[#EB001B] text-white rounded">MASTERCARD</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-title">Atención al Cliente</h5>
              <p className="text-xs text-[#DFD4BE]/80 leading-relaxed mb-2">
                Lunes a Sábado de 9:00 am a 8:00 pm.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola EcoModa, necesito soporte con mi pedido')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#7CC242] hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+51 998 765 432</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DFD4BE]/60">
            <span>© {new Date().getFullYear()} EcoModa Perú S.A.C. · Todos los derechos reservados.</span>
            <div className="flex items-center gap-4">
              <span>RUC: 20608976543</span>
              <span>·</span>
              <span className="font-mono text-[#7CC242]">WWW.ECOMODA.PE</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 6. BOTÓN FLOTANTE "VOLVER AL INICIO" (Visible siempre que no estemos en la portada) */}
      <BackToHomeButton
        isVisible={activeBlockIndex > 0}
        onGoHome={() => handleSelectBlock(0)}
      />

      {/* 7. DRAWER LATERAL DE CARRITO DE COMPRAS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onNavigateToCatalog={() => handleSelectBlock(1)}
      />

      {/* 8. MODAL COMPLETO DE CHECKOUT CON PASARELAS PERUANAS REALES */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        discount={discountAmount}
        shippingCost={shippingCost}
        total={total}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={(order) => {
          setLastOrder(order);
          setCartItems([]); // Vaciar carrito tras compra exitosa
        }}
      />

    </div>
  );
}

export default App;
