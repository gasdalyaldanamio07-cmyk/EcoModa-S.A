import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Droplet, 
  Sparkles, 
  Check, 
  Tag, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { CartItem, PromoCoupon } from '../types/ecommerce';
import { PROMO_COUPONS, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: PromoCoupon | null;
  onApplyCoupon: (coupon: PromoCoupon | null) => void;
  onNavigateToCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onNavigateToCatalog
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  // Calculos de totales
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalWaterSaved = items.reduce((sum, item) => sum + (item.product.waterSavedLiters * item.quantity), 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Descuento
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'ENVIOGRATIS') {
      discountAmount = 0;
    } else {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    }
  }

  // Costo de envio
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.code === 'ENVIOGRATIS';
  const shippingCost = items.length === 0 ? 0 : (qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_COST);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) return;

    const found = PROMO_COUPONS.find(c => c.code === cleanCode);
    if (!found) {
      setCouponError('Cupón no válido. Prueba con ECOMODA10');
      return;
    }
    if (subtotal < found.minAmount) {
      setCouponError(`Este cupón requiere una compra mínima de S/ ${found.minAmount.toFixed(2)}`);
      return;
    }

    onApplyCoupon(found);
    setCouponSuccess(`¡Cupón ${found.code} aplicado con éxito!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro transparente */}
      <div 
        className="absolute inset-0 bg-[#1F4D36]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside 
          className="w-screen max-w-md bg-[#FFFDF8] border-l border-[#DFD4BE] shadow-2xl flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras de EcoModa"
        >
          {/* Encabezado del Carrito */}
          <div className="px-5 py-4 border-b border-[#DFD4BE] bg-[#F7F1E3] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1E8E5A] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#1F4D36] font-title leading-tight">
                  Tu Carrito Sostenible
                </h2>
                <p className="text-xs text-[#435E50]">
                  {totalItemsCount} {totalItemsCount === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#1F4D36] hover:bg-[#1E8E5A]/10 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de progreso de envío gratis a todo el Perú */}
          <div className="px-5 py-3 bg-[#1E8E5A]/10 border-b border-[#1E8E5A]/20">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1F4D36] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#1E8E5A]" />
                {qualifiesForFreeShipping ? (
                  <strong className="text-[#1E8E5A]">¡Felicitaciones! Tienes Envío Gratis a todo el Perú</strong>
                ) : (
                  <span>Te faltan <strong>S/ {remainingForFreeShipping.toFixed(2)}</strong> para Envío Gratis</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-[#1E8E5A]">{shippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#DFD4BE] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1E8E5A] transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Lista de Prendas */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#F7F1E3] border border-[#DFD4BE] flex items-center justify-center mb-4 text-[#435E50]">
                  <ShoppingBag className="w-8 h-8 text-[#1E8E5A]" />
                </div>
                <h3 className="font-extrabold text-[#1F4D36] text-lg font-title mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs sm:text-sm text-[#435E50] max-w-xs mb-6">
                  Descubre prendas con fibras naturales y lino regenerativo que cuidan el planeta y tu estilo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToCatalog();
                  }}
                  className="px-6 py-3 bg-[#1E8E5A] text-white text-xs font-bold rounded-xl hover:bg-[#163827] transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <article 
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3.5 p-3.5 bg-white border border-[#DFD4BE] rounded-xl shadow-2xs hover:border-[#7CC242] transition-colors"
                >
                  {/* Foto de la prenda */}
                  <div className="w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-[#F7F1E3] border border-[#DFD4BE]/60">
                    <img
                      src={item.product.imageSrc}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Datos de la prenda */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-[#1F4D36] text-sm leading-snug truncate font-title">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="text-[#435E50] hover:text-[#E0643A] p-1 transition-colors cursor-pointer"
                          aria-label={`Eliminar ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#435E50] mt-0.5">
                        Talla: <span className="font-semibold text-[#1F4D36]">{item.selectedSize}</span> · Color: {item.product.color}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-[#1E8E5A] mt-1 font-semibold">
                        <Droplet className="w-3 h-3" />
                        <span>Ahorra {item.product.waterSavedLiters * item.quantity} L de agua</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DFD4BE]/50">
                      {/* Control de cantidad */}
                      <div className="flex items-center border border-[#DFD4BE] rounded-lg bg-[#F7F1E3]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#1F4D36] hover:bg-[#7CC242]/20 rounded-l-lg transition-colors cursor-pointer"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#1F4D36]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#1F4D36] hover:bg-[#7CC242]/20 rounded-r-lg transition-colors cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#E0643A] font-title">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-[#435E50]">
                            S/ {item.product.price.toFixed(2)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Cupón y Resumen de Totales */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#DFD4BE] bg-[#F7F1E3]/80 space-y-3.5">
              
              {/* Impacto ecológico del pedido */}
              <div className="flex items-center gap-2 p-2.5 bg-[#FFFDF8] border border-[#7CC242]/40 rounded-xl text-xs text-[#1F4D36]">
                <Droplet className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                <span className="leading-tight">
                  Este pedido preserva <strong>{totalWaterSaved.toLocaleString('es-PE')} litros de agua limpia</strong> en el Perú.
                </span>
              </div>

              {/* Formulario de Cupón de Descuento */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#1E8E5A]/15 border border-[#1E8E5A]/40 rounded-xl text-xs text-[#1F4D36]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#1E8E5A]" />
                      <span>Cupón {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[#E0643A] hover:underline font-bold text-xs cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupón (ej. ECOMODA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#DFD4BE] rounded-lg text-[#1F4D36] placeholder-[#435E50]/60 focus-visible:outline-2 focus-visible:outline-[#1E8E5A] uppercase tracking-wider font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#1E8E5A] text-white text-xs font-bold rounded-lg hover:bg-[#163827] transition-colors cursor-pointer shrink-0"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-[#E0643A] mt-1 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-[#1E8E5A] mt-1 font-semibold">{couponSuccess}</p>}
              </div>

              {/* Desglose de Precios */}
              <div className="space-y-1.5 text-xs text-[#435E50] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F4D36]">S/ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1E8E5A] font-semibold">
                    <span>Descuento aplicado ({appliedCoupon?.code})</span>
                    <span>- S/ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío a todo el Perú</span>
                  <span className="font-semibold text-[#1F4D36]">
                    {shippingCost === 0 ? (
                      <span className="text-[#1E8E5A] font-bold">¡GRATIS!</span>
                    ) : (
                      `S/ ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#1F4D36] pt-2 border-t border-[#DFD4BE] font-title">
                  <span>Total a pagar</span>
                  <span className="text-[#E0643A]">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 px-4 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
                >
                  <span>Finalizar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-transparent hover:bg-white text-[#1F4D36] font-semibold text-xs rounded-xl border border-[#DFD4BE] transition-colors cursor-pointer"
                >
                  Continuar comprando
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#435E50] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E8E5A]" />
                  Pago 100% seguro
                </span>
                <span>·</span>
                <span>Yape, Plin, Tarjetas, Contra entrega</span>
              </div>

            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
