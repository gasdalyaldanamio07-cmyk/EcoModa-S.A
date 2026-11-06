import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  Truck, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Printer, 
  ShieldCheck, 
  Lock, 
  Phone, 
  MapPin, 
  Droplet,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { CartItem, PaymentMethodId, ShippingInfo, OrderConfirmation, PromoCoupon } from '../types/ecommerce';
import { PERU_CITIES } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  appliedCoupon: PromoCoupon | null;
  onOrderCompleted: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  shippingCost,
  total,
  appliedCoupon,
  onOrderCompleted
}) => {
  // Pasos: 1 = Envio, 2 = Pago, 3 = Confirmacion
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Datos de entrega
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '',
    lastName: '',
    documentType: 'DNI',
    documentNumber: '',
    phone: '',
    email: '',
    department: 'Lima',
    city: 'Lima Metropolitana',
    address: '',
    reference: '',
    deliveryNotes: ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Metodo de pago seleccionado
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('yape');
  const [paymentReference, setPaymentReference] = useState('');
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'generic'>('generic');

  // Orden completada
  const [completedOrder, setCompletedOrder] = useState<OrderConfirmation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const totalWaterSaved = items.reduce((sum, item) => sum + (item.product.waterSavedLiters * item.quantity), 0);
  const pointsEarned = Math.round(total);

  // Formateo y deteccion de tarjeta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    if (value.startsWith('4')) {
      setCardType('visa');
    } else if (value.startsWith('51') || value.startsWith('52') || value.startsWith('53') || value.startsWith('54') || value.startsWith('55')) {
      setCardType('mastercard');
    } else {
      setCardType('generic');
    }
    // Formatear en bloques de 4
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(value);
  };

  const validateShippingForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!shipping.name.trim()) errors.name = 'Ingresa tu nombre';
    if (!shipping.lastName.trim()) errors.lastName = 'Ingresa tus apellidos';
    if (!shipping.phone.trim() || shipping.phone.length < 9) errors.phone = 'Teléfono celular válido (9 dígitos)';
    if (!shipping.email.trim() || !shipping.email.includes('@')) errors.email = 'Correo electrónico válido';
    if (!shipping.documentNumber.trim() || shipping.documentNumber.length < 8) errors.documentNumber = 'Documento válido (mínimo 8 dígitos)';
    if (!shipping.address.trim()) errors.address = 'Dirección de entrega completa';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep(2);
    }
  };

  const handleProcessPayment = () => {
    // Validaciones segun metodo
    if (paymentMethod === 'yape' || paymentMethod === 'plin') {
      if (!paymentReference.trim() || paymentReference.trim().length < 6) {
        alert('Por favor ingresa el código de aprobación de 6 dígitos emitido por Yape o Plin.');
        return;
      }
    } else if (paymentMethod === 'transferencia') {
      if (!paymentReference.trim() || paymentReference.trim().length < 6) {
        alert('Por favor ingresa el número de operación de la transferencia bancaria.');
        return;
      }
    } else if (paymentMethod === 'tarjeta') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        alert('Por favor ingresa un número de tarjeta válido (16 dígitos).');
        return;
      }
      if (!cardHolder.trim()) {
        alert('Por favor ingresa el nombre del titular tal como figura en la tarjeta.');
        return;
      }
      if (cardExpiry.length < 5) {
        alert('Por favor ingresa la fecha de vencimiento (MM/AA).');
        return;
      }
      if (cardCvv.length < 3) {
        alert('Por favor ingresa el código de seguridad CVV (3 dígitos al reverso).');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderId = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: OrderConfirmation = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...items],
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shippingCost,
        total,
        paymentMethod,
        paymentReference: paymentMethod === 'tarjeta' ? `AUTH-${Math.floor(100000 + Math.random() * 900000)}` : paymentReference,
        shippingInfo: { ...shipping },
        waterSavedTotal: totalWaterSaved,
        pointsEarned
      };

      setCompletedOrder(order);
      setIsProcessing(false);
      setStep(3);
      onOrderCompleted(order);
    }, 1200);
  };

  const handleCopyAccount = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    setTimeout(() => setCopiedBankIndex(null), 2500);
  };

  const handleWhatsAppSend = () => {
    if (!completedOrder) return;
    const itemsList = completedOrder.items
      .map(i => `• ${i.product.name} (Talla: ${i.selectedSize}, Cant: ${i.quantity}) - S/ ${(i.product.price * i.quantity).toFixed(2)}`)
      .join('\n');

    const msg = `*PEDIDO CONFIRMADO ECOMODA* 🌿\n\n` +
      `*Orden:* ${completedOrder.orderId}\n` +
      `*Cliente:* ${completedOrder.shippingInfo.name} ${completedOrder.shippingInfo.lastName}\n` +
      `*Ciudad:* ${completedOrder.shippingInfo.city}\n` +
      `*Dirección:* ${completedOrder.shippingInfo.address} (Ref: ${completedOrder.shippingInfo.reference || 'Sin ref'})\n` +
      `*Teléfono:* ${completedOrder.shippingInfo.phone}\n\n` +
      `*Prendas:* \n${itemsList}\n\n` +
      `*Subtotal:* S/ ${completedOrder.subtotal.toFixed(2)}\n` +
      (completedOrder.discount > 0 ? `*Descuento (${completedOrder.couponCode}):* -S/ ${completedOrder.discount.toFixed(2)}\n` : '') +
      `*Envío:* ${completedOrder.shippingCost === 0 ? 'GRATIS' : `S/ ${completedOrder.shippingCost.toFixed(2)}`}\n` +
      `*TOTAL:* S/ ${completedOrder.total.toFixed(2)}\n` +
      `*Método de Pago:* ${completedOrder.paymentMethod.toUpperCase()}\n` +
      `*Ref / Operación:* ${completedOrder.paymentReference || 'Pago contra entrega'}\n\n` +
      `*Impacto Ecológico:* ${completedOrder.waterSavedTotal.toLocaleString('es-PE')} L de agua ahorrados 💧\n` +
      `*Puntos Verdes:* +${completedOrder.pointsEarned} pts 🌱`;

    window.open(`https://wa.me/51998765432?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F4D36]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        className="w-full max-w-3xl bg-[#FFFDF8] border-2 border-[#DFD4BE] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* Cabecera del Checkout */}
        <div className="px-6 py-4 bg-[#F7F1E3] border-b border-[#DFD4BE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E8E5A] text-white flex items-center justify-center font-bold font-title">
              {step === 3 ? '✓' : step}
            </div>
            <div>
              <h2 id="checkout-title" className="text-lg sm:text-xl font-extrabold text-[#1F4D36] font-title">
                {step === 1 && 'Paso 1: Datos de Entrega en Perú'}
                {step === 2 && 'Paso 2: Selección y Validación de Pago'}
                {step === 3 && '¡Pedido Confirmado con Éxito!'}
              </h2>
              <p className="text-xs text-[#435E50]">
                {step === 1 && 'Indícanos dónde recibirás tus prendas sostenibles'}
                {step === 2 && 'Métodos seguros: Yape, Plin, Transferencias, Tarjetas o Contra entrega'}
                {step === 3 && `Orden oficial registrada a nombre de ${shipping.name}`}
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#1F4D36] hover:bg-[#1E8E5A]/10 transition-colors cursor-pointer"
              aria-label="Cerrar ventana de pago"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Barra de progreso de pasos */}
        <div className="px-6 py-2.5 bg-white border-b border-[#DFD4BE]/70 flex items-center justify-between text-xs font-semibold text-[#435E50]">
          <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#1E8E5A] font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-[#1E8E5A]/15 flex items-center justify-center text-[11px]">1</span>
            Entrega
          </span>
          <span className="w-8 sm:w-16 h-0.5 bg-[#DFD4BE]" />
          <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1E8E5A] font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-[#1E8E5A]/15 flex items-center justify-center text-[11px]">2</span>
            Pago Seguro
          </span>
          <span className="w-8 sm:w-16 h-0.5 bg-[#DFD4BE]" />
          <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-[#1E8E5A] font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-[#1E8E5A]/15 flex items-center justify-center text-[11px]">3</span>
            Confirmación
          </span>
        </div>

        {/* Contenido según el paso */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* ==============================================================
               PASO 1: DATOS DE ENVÍO
               ============================================================== */}
          {step === 1 && (
            <form onSubmit={handleContinueToPayment} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    placeholder="Ej. Carmen"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  />
                  {formErrors.name && <p className="text-xs text-[#E0643A] mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.lastName}
                    onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                    placeholder="Ej. Mendoza Castro"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  />
                  {formErrors.lastName && <p className="text-xs text-[#E0643A] mt-1">{formErrors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Tipo de Doc. *
                  </label>
                  <select
                    value={shipping.documentType}
                    onChange={(e) => setShipping({ ...shipping, documentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  >
                    <option value="DNI">DNI</option>
                    <option value="Carnet Ext.">Carnet de Extranjería</option>
                    <option value="RUC">RUC</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.documentNumber}
                    onChange={(e) => setShipping({ ...shipping, documentNumber: e.target.value })}
                    placeholder="8 u 11 dígitos"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  />
                  {formErrors.documentNumber && <p className="text-xs text-[#E0643A] mt-1">{formErrors.documentNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="999 000 000"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  />
                  {formErrors.phone && <p className="text-xs text-[#E0643A] mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                />
                {formErrors.email && <p className="text-xs text-[#E0643A] mt-1">{formErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Ciudad / Destino en Perú *
                  </label>
                  <select
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  >
                    {PERU_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Dirección Exacta (Calle, Jr, Av, Nro, Dpto) *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="Av. Larco 1045, Dpto 402"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  />
                  {formErrors.address && <p className="text-xs text-[#E0643A] mt-1">{formErrors.address}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                  Referencia de entrega
                </label>
                <input
                  type="text"
                  value={shipping.reference}
                  onChange={(e) => setShipping({ ...shipping, reference: e.target.value })}
                  placeholder="Frente al parque, portón de madera, etc."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                />
              </div>

              {/* Resumen express del pedido */}
              <div className="p-4 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-[#1F4D36]">Total a pagar: </span>
                  <span className="font-extrabold text-[#E0643A] text-base font-title ml-1">S/ {total.toFixed(2)}</span>
                  <span className="text-xs text-[#435E50] ml-2">({items.length} {items.length === 1 ? 'prenda' : 'prendas'})</span>
                </div>
                <div className="text-xs text-[#1E8E5A] font-semibold flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{shippingCost === 0 ? 'Envío GRATIS' : `Envío: S/ ${shippingCost.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-transparent border border-[#DFD4BE] text-[#1F4D36] font-semibold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#E0643A] hover:bg-[#c8542c] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer font-title"
                >
                  <span>Continuar al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ==============================================================
               PASO 2: MÉTODOS DE PAGO
               ============================================================== */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Selector de los 6 Métodos de Pago */}
              <div>
                <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-2.5">
                  Selecciona tu Método de Pago Seguro:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  
                  {/* 1. Yape */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('yape'); setPaymentReference(''); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'yape'
                        ? 'bg-[#1E8E5A]/15 border-[#1E8E5A] shadow-xs'
                        : 'bg-white border-[#DFD4BE] hover:border-[#7CC242]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#742284] text-base font-title">Yape</span>
                      {paymentMethod === 'yape' && <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />}
                    </div>
                    <span className="text-[11px] text-[#435E50] mt-1">QR o número directo</span>
                  </button>

                  {/* 2. Plin */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('plin'); setPaymentReference(''); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'plin'
                        ? 'bg-[#1E8E5A]/15 border-[#1E8E5A] shadow-xs'
                        : 'bg-white border-[#DFD4BE] hover:border-[#7CC242]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#00A4D3] text-base font-title">Plin</span>
                      {paymentMethod === 'plin' && <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />}
                    </div>
                    <span className="text-[11px] text-[#435E50] mt-1">Interbancario al instante</span>
                  </button>

                  {/* 3. Transferencias Bancarias */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('transferencia'); setPaymentReference(''); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'transferencia'
                        ? 'bg-[#1E8E5A]/15 border-[#1E8E5A] shadow-xs'
                        : 'bg-white border-[#DFD4BE] hover:border-[#7CC242]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Building2 className="w-5 h-5 text-[#1F4D36]" />
                      {paymentMethod === 'transferencia' && <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />}
                    </div>
                    <span className="font-bold text-xs text-[#1F4D36] mt-1">Transferencias BCP / BBVA / Interbank</span>
                  </button>

                  {/* 4. Tarjetas Visa y Mastercard */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('tarjeta'); setPaymentReference(''); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-[#1E8E5A]/15 border-[#1E8E5A] shadow-xs'
                        : 'bg-white border-[#DFD4BE] hover:border-[#7CC242]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-[#E0643A]" />
                      {paymentMethod === 'tarjeta' && <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />}
                    </div>
                    <span className="font-bold text-xs text-[#1F4D36] mt-1">Tarjetas Débito y Crédito</span>
                  </button>

                  {/* 5. Billeteras Digitales */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('billetera'); setPaymentReference('WALLET-DIRECT'); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'billetera'
                        ? 'bg-[#1E8E5A]/15 border-[#1E8E5A] shadow-xs'
                        : 'bg-white border-[#DFD4BE] hover:border-[#7CC242]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Wallet className="w-5 h-5 text-[#2BB3A8]" />
                      {paymentMethod === 'billetera' && <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />}
                    </div>
                    <span className="font-bold text-xs text-[#1F4D36] mt-1">Apple Pay / Google Pay / Agora</span>
                  </button>

                  {/* 6. Pago Contra Entrega */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('contraentrega'); setPaymentReference('CONTRA-ENTREGA'); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'contraentrega'
                        ? 'bg-[#1E8E5A]/15 border-[#1E8E5A] shadow-xs'
                        : 'bg-white border-[#DFD4BE] hover:border-[#7CC242]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck className="w-5 h-5 text-[#1E8E5A]" />
                      {paymentMethod === 'contraentrega' && <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" />}
                    </div>
                    <span className="font-bold text-xs text-[#1F4D36] mt-1">Pago Contra Entrega</span>
                  </button>

                </div>
              </div>

              {/* Panel de Instrucciones y Formulario según el Método Seleccionado */}
              <div className="p-5 bg-white border border-[#DFD4BE] rounded-2xl shadow-xs">
                
                {/* 1. YAPE */}
                {paymentMethod === 'yape' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      
                      {/* Código QR Ilustrado de Yape */}
                      <div className="p-3 bg-[#742284] rounded-2xl shadow-md text-white flex flex-col items-center shrink-0">
                        <div className="w-36 h-36 bg-white rounded-xl p-2 flex flex-col items-center justify-center border-2 border-white">
                          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                            <rect width="100" height="100" fill="white"/>
                            {/* Marcadores QR esquinas */}
                            <rect x="10" y="10" width="24" height="24" fill="#742284" rx="3"/>
                            <rect x="14" y="14" width="16" height="16" fill="white" rx="2"/>
                            <rect x="18" y="18" width="8" height="8" fill="#742284"/>
                            
                            <rect x="66" y="10" width="24" height="24" fill="#742284" rx="3"/>
                            <rect x="70" y="14" width="16" height="16" fill="white" rx="2"/>
                            <rect x="74" y="18" width="8" height="8" fill="#742284"/>
                            
                            <rect x="10" y="66" width="24" height="24" fill="#742284" rx="3"/>
                            <rect x="14" y="70" width="16" height="16" fill="white" rx="2"/>
                            <rect x="18" y="74" width="8" height="8" fill="#742284"/>

                            {/* Patrón central de QR simulado de EcoModa */}
                            <circle cx="50" cy="50" r="10" fill="#00D2A0" />
                            <text x="50" y="54" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">ECO</text>
                            
                            <rect x="40" y="20" width="6" height="6" fill="#742284"/>
                            <rect x="54" y="20" width="6" height="6" fill="#742284"/>
                            <rect x="42" y="32" width="6" height="6" fill="#742284"/>
                            <rect x="42" y="64" width="6" height="6" fill="#742284"/>
                            <rect x="64" y="44" width="6" height="6" fill="#742284"/>
                            <rect x="74" y="64" width="6" height="6" fill="#742284"/>
                          </svg>
                        </div>
                        <span className="text-xs font-bold mt-1 text-center font-title">QR Oficial Yape</span>
                      </div>

                      <div className="space-y-2 text-xs text-[#435E50] flex-1">
                        <h4 className="font-extrabold text-[#742284] text-base font-title">
                          Instrucciones para pagar con Yape:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                          <li>Abre tu app <strong>Yape</strong> en tu teléfono.</li>
                          <li>Escanea el código QR o transfiere al número: <strong className="text-[#1F4D36] text-sm font-title">998 765 432</strong></li>
                          <li>Titular oficial: <strong className="text-[#1F4D36]">EcoModa Perú S.A.C.</strong></li>
                          <li>Ingresa el monto exacto: <strong className="text-[#E0643A] text-sm">S/ {total.toFixed(2)}</strong></li>
                          <li>Copia el <strong>Código de Aprobación de 6 dígitos</strong> que figura en tu voucher.</li>
                        </ol>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#DFD4BE]">
                      <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                        Código de Aprobación de Yape (6 dígitos) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          maxLength={8}
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ej. 748291"
                          className="flex-1 px-3.5 py-2.5 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl text-sm font-bold text-[#1F4D36] tracking-widest placeholder-[#435E50]/60 focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                        />
                      </div>
                      <p className="text-[11px] text-[#435E50] mt-1">
                        Validación automática y emisión de comprobante de compra.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. PLIN */}
                {paymentMethod === 'plin' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      
                      {/* Código QR Ilustrado de Plin */}
                      <div className="p-3 bg-[#00A4D3] rounded-2xl shadow-md text-white flex flex-col items-center shrink-0">
                        <div className="w-36 h-36 bg-white rounded-xl p-2 flex flex-col items-center justify-center border-2 border-white">
                          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                            <rect width="100" height="100" fill="white"/>
                            <rect x="10" y="10" width="24" height="24" fill="#00A4D3" rx="3"/>
                            <rect x="14" y="14" width="16" height="16" fill="white" rx="2"/>
                            <rect x="18" y="18" width="8" height="8" fill="#00A4D3"/>
                            
                            <rect x="66" y="10" width="24" height="24" fill="#00A4D3" rx="3"/>
                            <rect x="70" y="14" width="16" height="16" fill="white" rx="2"/>
                            <rect x="74" y="18" width="8" height="8" fill="#00A4D3"/>
                            
                            <rect x="10" y="66" width="24" height="24" fill="#00A4D3" rx="3"/>
                            <rect x="14" y="70" width="16" height="16" fill="white" rx="2"/>
                            <rect x="18" y="74" width="8" height="8" fill="#00A4D3"/>

                            <circle cx="50" cy="50" r="10" fill="#00A4D3" />
                            <text x="50" y="54" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">PLIN</text>
                            
                            <rect x="40" y="22" width="6" height="6" fill="#00A4D3"/>
                            <rect x="54" y="22" width="6" height="6" fill="#00A4D3"/>
                            <rect x="42" y="64" width="6" height="6" fill="#00A4D3"/>
                            <rect x="64" y="44" width="6" height="6" fill="#00A4D3"/>
                          </svg>
                        </div>
                        <span className="text-xs font-bold mt-1 text-center font-title">QR Oficial Plin</span>
                      </div>

                      <div className="space-y-2 text-xs text-[#435E50] flex-1">
                        <h4 className="font-extrabold text-[#00A4D3] text-base font-title">
                          Instrucciones para pagar con Plin:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                          <li>Abre la app de tu banco: <strong>BBVA, Interbank, Scotiabank o BanBif</strong>.</li>
                          <li>Selecciona <strong>Plin</strong> y escanea el QR o envía al: <strong className="text-[#1F4D36] text-sm font-title">998 765 432</strong></li>
                          <li>Destinatario: <strong className="text-[#1F4D36]">EcoModa Perú S.A.C.</strong></li>
                          <li>Monto exacto: <strong className="text-[#E0643A] text-sm">S/ {total.toFixed(2)}</strong></li>
                          <li>Ingresa el código o número de operación emitido.</li>
                        </ol>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#DFD4BE]">
                      <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                        Número de Operación de Plin *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ej. 6519283"
                        className="w-full px-3.5 py-2.5 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl text-sm font-bold text-[#1F4D36] tracking-widest placeholder-[#435E50]/60 focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                      />
                    </div>
                  </div>
                )}

                {/* 3. TRANSFERENCIAS BANCARIAS */}
                {paymentMethod === 'transferencia' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#435E50] leading-relaxed">
                      Transfiere el monto de <strong className="text-[#E0643A] font-bold">S/ {total.toFixed(2)}</strong> a cualquiera de nuestras cuentas corrientes corporativas en soles a nombre de <strong>EcoModa Perú S.A.C. (RUC: 20608976543)</strong>:
                    </p>

                    <div className="space-y-2.5">
                      
                      {/* BCP */}
                      <div className="p-3 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-extrabold text-[#002A8F] font-title text-sm">Banco de Crédito (BCP)</span>
                          <p className="text-[#1F4D36] font-mono mt-0.5">Cta Cte: <strong>194-98765432-0-88</strong></p>
                          <p className="text-[11px] text-[#435E50] font-mono">CCI: 002-1940098765432088-91</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount('194-98765432-0-88', 1)}
                          className="px-3 py-1.5 bg-white border border-[#DFD4BE] rounded-lg text-xs font-bold text-[#1F4D36] hover:bg-[#1E8E5A] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copiedBankIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBankIndex === 1 ? '¡Copiado!' : 'Copiar Cta'}</span>
                        </button>
                      </div>

                      {/* BBVA */}
                      <div className="p-3 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-extrabold text-[#004481] font-title text-sm">BBVA Perú</span>
                          <p className="text-[#1F4D36] font-mono mt-0.5">Cta Cte: <strong>0011-0456-0100098765</strong></p>
                          <p className="text-[11px] text-[#435E50] font-mono">CCI: 011-456-000100098765-23</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount('0011-0456-0100098765', 2)}
                          className="px-3 py-1.5 bg-white border border-[#DFD4BE] rounded-lg text-xs font-bold text-[#1F4D36] hover:bg-[#1E8E5A] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copiedBankIndex === 2 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBankIndex === 2 ? '¡Copiado!' : 'Copiar Cta'}</span>
                        </button>
                      </div>

                      {/* Interbank */}
                      <div className="p-3 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-extrabold text-[#009B3A] font-title text-sm">Interbank</span>
                          <p className="text-[#1F4D36] font-mono mt-0.5">Cta Cte: <strong>200-3001987654</strong></p>
                          <p className="text-[11px] text-[#435E50] font-mono">CCI: 003-200-003001987654-15</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount('200-3001987654', 3)}
                          className="px-3 py-1.5 bg-white border border-[#DFD4BE] rounded-lg text-xs font-bold text-[#1F4D36] hover:bg-[#1E8E5A] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copiedBankIndex === 3 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBankIndex === 3 ? '¡Copiado!' : 'Copiar Cta'}</span>
                        </button>
                      </div>

                    </div>

                    <div className="pt-2 border-t border-[#DFD4BE]">
                      <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                        Número de Operación Bancaria *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Ej. Operación N° 8492019"
                        className="w-full px-3.5 py-2.5 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl text-sm font-bold text-[#1F4D36] placeholder-[#435E50]/60 focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                      />
                    </div>
                  </div>
                )}

                {/* 4. TARJETAS DE CRÉDITO Y DÉBITO */}
                {paymentMethod === 'tarjeta' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#F7F1E3] border border-[#DFD4BE] rounded-xl">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#1E8E5A]" />
                        <span className="text-xs font-semibold text-[#1F4D36]">Pasarela SSL 256-Bit con Encriptación Bancaria</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${cardType === 'visa' ? 'bg-[#1A1F71] text-white' : 'bg-slate-200 text-slate-700'}`}>
                          VISA
                        </span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${cardType === 'mastercard' ? 'bg-[#EB001B] text-white' : 'bg-slate-200 text-slate-700'}`}>
                          MC
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                          Número de Tarjeta (16 dígitos) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4000 1234 5678 9010"
                            className="w-full px-3.5 py-2.5 pl-10 bg-white border border-[#DFD4BE] rounded-xl text-sm font-mono font-bold text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                          />
                          <CreditCard className="w-5 h-5 text-[#435E50] absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                          Nombre del Titular (como figura en la tarjeta) *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="CARMEN MENDOZA"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm font-bold text-[#1F4D36] uppercase focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                            Expiración (MM/AA) *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            placeholder="12/28"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm font-mono font-bold text-[#1F4D36] text-center focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                            CVV / CVC (3 dígitos) *
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-sm font-mono font-bold text-[#1F4D36] text-center focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. OTRAS BILLETERAS DIGITALES */}
                {paymentMethod === 'billetera' && (
                  <div className="space-y-4 text-center py-4">
                    <p className="text-xs sm:text-sm text-[#435E50]">
                      Paga en 1 solo clic de forma segura utilizando tu billetera digital predeterminada en tu dispositivo:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div className="px-5 py-3 bg-black text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm">
                        <span> Pay</span>
                        <span>Apple Pay</span>
                      </div>
                      <div className="px-5 py-3 bg-white border border-[#DFD4BE] text-[#1F4D36] rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm">
                        <span>G Pay</span>
                        <span>Google Pay</span>
                      </div>
                      <div className="px-5 py-3 bg-[#E0643A] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm">
                        <span>Agora Pay</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#1E8E5A] font-semibold mt-2">
                      Autenticación biométrica FaceID / Huella dactilar habilitada.
                    </p>
                  </div>
                )}

                {/* 6. PAGO CONTRA ENTREGA */}
                {paymentMethod === 'contraentrega' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3.5 bg-[#F7F1E3] border border-[#7CC242]/50 rounded-xl">
                      <Truck className="w-5 h-5 text-[#1E8E5A] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#435E50] space-y-1">
                        <h4 className="font-bold text-[#1F4D36] text-sm">
                          Disponible para {shipping.city}
                        </h4>
                        <p>
                          Pagarás el total exacto de <strong className="text-[#E0643A]">S/ {total.toFixed(2)}</strong> cuando el motorizado de EcoModa entregue tus prendas en mano en tu dirección ({shipping.address}).
                        </p>
                        <p className="font-semibold text-[#1F4D36]">
                          Opciones al recibir: Efectivo exacto o Tarjetas de débito/crédito con POS móvil inalámbrico.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Botones de navegación del paso 2 */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-transparent border border-[#DFD4BE] text-[#1F4D36] font-semibold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a datos de entrega</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="px-7 py-3.5 bg-[#1E8E5A] hover:bg-[#163827] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer font-title disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Procesando pago seguro...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Validar y Confirmar Pedido (S/ {total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ==============================================================
               PASO 3: CONFIRMACIÓN DEL PEDIDO Y COMPROBANTE
               ============================================================== */}
          {step === 3 && completedOrder && (
            <div className="space-y-6 text-center sm:text-left">
              
              {/* Tarjeta de Éxito */}
              <div className="p-6 bg-[#1E8E5A]/10 border-2 border-[#1E8E5A] rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#1E8E5A] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-[#E0643A] uppercase tracking-wider font-title">
                    ¡Gracias por vestir con propósito!
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#1F4D36] font-title">
                    Orden Oficial: {completedOrder.orderId}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#435E50] leading-relaxed">
                    Hemos registrado tu pedido y preparado el despacho. Se ha enviado un correo con el comprobante detallado a <strong>{completedOrder.shippingInfo.email}</strong>.
                  </p>
                </div>
              </div>

              {/* Impacto ecológico y Puntos Verdes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#FFFDF8] border border-[#7CC242]/40 rounded-xl flex items-center gap-3">
                  <Droplet className="w-6 h-6 text-[#1E8E5A] shrink-0" />
                  <div className="text-left text-xs text-[#1F4D36]">
                    <span className="font-bold block">Huella hídrica preservada:</span>
                    <span>{completedOrder.waterSavedTotal.toLocaleString('es-PE')} litros de agua limpia</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FFFDF8] border border-[#F4B626]/40 rounded-xl flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#E0643A] shrink-0" />
                  <div className="text-left text-xs text-[#1F4D36]">
                    <span className="font-bold block">Puntos Verdes Club EcoModa:</span>
                    <span className="text-[#E0643A] font-extrabold">+{completedOrder.pointsEarned} puntos acumulados</span>
                  </div>
                </div>
              </div>

              {/* Detalle del Pedido */}
              <div className="p-5 bg-white border border-[#DFD4BE] rounded-2xl space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row justify-between border-b border-[#DFD4BE] pb-3 gap-2">
                  <div>
                    <span className="text-[#435E50] block">Destino de entrega:</span>
                    <strong className="text-[#1F4D36] text-sm">{completedOrder.shippingInfo.address}, {completedOrder.shippingInfo.city}</strong>
                    <p className="text-[#435E50]">Receptor: {completedOrder.shippingInfo.name} {completedOrder.shippingInfo.lastName} (DNI: {completedOrder.shippingInfo.documentNumber})</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[#435E50] block">Método de pago:</span>
                    <strong className="text-[#1E8E5A] uppercase text-sm">{completedOrder.paymentMethod}</strong>
                    <p className="text-[#435E50]">Ref: {completedOrder.paymentReference}</p>
                  </div>
                </div>

                {/* Lista de prendas de la orden */}
                <div className="space-y-2">
                  <span className="font-bold text-[#1F4D36] uppercase tracking-wider text-[11px]">Prendas del Pedido:</span>
                  {completedOrder.items.map((i) => (
                    <div key={`${i.product.id}-${i.selectedSize}`} className="flex justify-between items-center py-1 border-b border-[#DFD4BE]/40">
                      <span>
                        <strong>{i.quantity}x</strong> {i.product.name} (Talla: {i.selectedSize})
                      </span>
                      <span className="font-bold text-[#1F4D36]">S/ {(i.product.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="pt-2 space-y-1 text-right">
                  <div>Subtotal: <strong className="text-[#1F4D36]">S/ {completedOrder.subtotal.toFixed(2)}</strong></div>
                  {completedOrder.discount > 0 && (
                    <div className="text-[#1E8E5A]">Descuento: <strong>- S/ {completedOrder.discount.toFixed(2)}</strong></div>
                  )}
                  <div>Envío: <strong className="text-[#1F4D36]">{completedOrder.shippingCost === 0 ? 'GRATIS' : `S/ ${completedOrder.shippingCost.toFixed(2)}`}</strong></div>
                  <div className="text-base font-extrabold text-[#E0643A] font-title pt-1 border-t border-[#DFD4BE]">
                    Total Pagado: S/ {completedOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Botones de Acción de la Confirmación */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full sm:w-auto flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Confirmación a WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="w-full sm:w-auto py-3.5 px-4 bg-white border border-[#DFD4BE] text-[#1F4D36] font-semibold text-xs rounded-xl hover:bg-[#F7F1E3] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Comprobante</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto py-3.5 px-5 bg-[#1E8E5A] hover:bg-[#163827] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Volver a la Tienda
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
