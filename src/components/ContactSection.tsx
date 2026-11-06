import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Send, 
  Check, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  FileDown, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface ContactSectionProps {
  onDownloadCatalog: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onDownloadCatalog }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Consulta sobre productos y tallas',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const WHATSAPP_PHONE = '51998765432';
  const WHATSAPP_MSG = encodeURIComponent('Hola EcoModa, quisiera consultar sobre productos, precios y promociones vigentes.');
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MSG}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Por favor escribe tu consulta o mensaje.');
      return;
    }

    setFormSubmitted(true);
  };

  const handleOpenMailto = () => {
    const mailtoLink = `mailto:contacto@ecomoda.pe?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Hola EcoModa,\n\nNombre: ${formData.name}\nCorreo: ${formData.email}\n\nMensaje:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contacto" className="space-y-12">
      
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#E0643A] font-title">
          Atención Personalizada
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-title">
          Comunícate con EcoModa
        </h3>
        <p className="text-xs sm:text-sm text-[#435E50] leading-relaxed">
          Estamos aquí para ayudarte a elegir tu prenda ideal, consultar disponibilidad de tallas, precios o resolver cualquier duda sobre tu pedido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Botón de WhatsApp, Redes Sociales y Catálogo PDF (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tarjeta de Contacto Directo por WhatsApp */}
          <div className="bg-[#FFFDF8] border-2 border-[#25D366]/40 hover:border-[#25D366] rounded-3xl p-6 shadow-sm transition-all space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-[#1F4D36] font-title">
                  Chat Directo por WhatsApp
                </h4>
                <p className="text-xs text-[#435E50]">
                  Respuesta inmediata · Lunes a Sábado de 9am a 8pm
                </p>
              </div>
            </div>

            <p className="text-xs text-[#435E50] leading-relaxed">
              Escríbenos directamente para consultar disponibilidad de prendas, asesoría de tallas personalizadas o coordinar pedidos con envío a cualquier provincia del Perú.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Mensaje por WhatsApp (+51 998 765 432)</span>
            </a>
          </div>

          {/* Tarjeta de Redes Sociales Oficiales */}
          <div className="bg-white border-2 border-[#DFD4BE] rounded-3xl p-6 shadow-xs space-y-4">
            <h4 className="text-base font-extrabold text-[#1F4D36] font-title">
              Nuestras Redes Sociales Oficiales
            </h4>
            <p className="text-xs text-[#435E50]">
              Síguenos para conocer nuevos lanzamientos, eventos sostenibles y consejos de moda ética:
            </p>

            <div className="space-y-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/ecomo_da01/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F1E3] hover:bg-[#E1306C]/10 border border-[#DFD4BE] hover:border-[#E1306C] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-2xs">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-[#1F4D36] block group-hover:text-[#DD2A7B] transition-colors">
                      Instagram Oficial
                    </span>
                    <span className="text-[11px] text-[#435E50] font-mono">@ECOMO_DA01</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#435E50] group-hover:text-[#DD2A7B]" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1DTQTSisre/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F1E3] hover:bg-[#1877F2]/10 border border-[#DFD4BE] hover:border-[#1877F2] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-2xs">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-[#1F4D36] block group-hover:text-[#1877F2] transition-colors">
                      Facebook Oficial
                    </span>
                    <span className="text-[11px] text-[#435E50]">EcoModa Perú</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#435E50] group-hover:text-[#1877F2]" />
              </a>
            </div>
          </div>

          {/* Tarjeta de Descargar Catálogo en PDF */}
          <div className="bg-gradient-to-br from-[#1E8E5A] to-[#1F4D36] text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-[#F4B626]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#7CC242] font-title">
                Documento Digital Oficial
              </span>
            </div>
            <h4 className="text-lg font-extrabold font-title">
              Catálogo Completo en Formato PDF
            </h4>
            <p className="text-xs text-[#F7F1E3]/85 leading-relaxed">
              Descarga nuestro catálogo 2026 para ver todas las prendas, fotos, especificaciones técnicas y precios sin conexión a internet.
            </p>
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                href="/catalogo-ecomoda.pdf"
                download="Catalogo-EcoModa-2026.pdf"
                className="flex-1 py-3 px-4 bg-[#E0643A] hover:bg-[#c8542c] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar Catálogo (PDF)</span>
              </a>

              <a
                href="/catalogo-ecomoda.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Visualizar</span>
              </a>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Formulario de Contacto por Correo Electrónico (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border-2 border-[#DFD4BE] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#1E8E5A]/15 text-[#1E8E5A] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-xl font-extrabold text-[#1F4D36] font-title">
                Envíanos un Correo Electrónico
              </h4>
            </div>
            <p className="text-xs text-[#435E50] mb-6 leading-relaxed">
              Completa el formulario y nuestro equipo de atención se pondrá en contacto contigo en un plazo máximo de 2 a 4 horas hábiles.
            </p>

            {formSubmitted ? (
              <div className="p-8 bg-[#1E8E5A]/10 border-2 border-[#1E8E5A] rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1E8E5A] text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h5 className="text-xl font-extrabold text-[#1F4D36] font-title">
                    ¡Mensaje recibido con éxito!
                  </h5>
                  <p className="text-xs sm:text-sm text-[#435E50] mt-1 max-w-md mx-auto leading-relaxed">
                    Gracias por comunicarte, <strong>{formData.name}</strong>. Hemos registrado tu consulta sobre <em>"{formData.subject}"</em> y te responderemos a <strong>{formData.email}</strong> a la brevedad.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenMailto}
                    className="px-4 py-2.5 bg-white border border-[#1E8E5A] text-[#1E8E5A] hover:bg-[#1E8E5A] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Abrir en tu app de correo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'Consulta sobre productos y tallas', message: '' });
                    }}
                    className="px-4 py-2.5 bg-[#1F4D36] text-white rounded-xl text-xs font-bold hover:bg-[#163827] transition-colors cursor-pointer"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Valeria Salazar"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-xs sm:text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="valeria@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-xs sm:text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Asunto de la Consulta *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-xs sm:text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
                  >
                    <option value="Consulta sobre productos y tallas">Consulta sobre productos y tallas</option>
                    <option value="Precios y promociones vigentes">Precios y promociones vigentes</option>
                    <option value="Estado de mi pedido / Envíos">Estado de mi pedido / Envíos a provincias</option>
                    <option value="Ventas corporativas o al por mayor">Ventas corporativas o al por mayor</option>
                    <option value="Asesoría personalizada de estilo">Asesoría personalizada de estilo</option>
                    <option value="Otro asunto">Otro asunto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F4D36] uppercase tracking-wider mb-1">
                    Mensaje o Consulta Detallada *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escribe aquí tu consulta sobre prendas, disponibilidad o envíos..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD4BE] rounded-xl text-xs sm:text-sm text-[#1F4D36] focus-visible:outline-2 focus-visible:outline-[#1E8E5A] resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-[#E0643A] font-bold">{errorMsg}</p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-[#435E50] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E8E5A]" />
                    Protección de datos conforme a la Ley N.° 29733
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-6 bg-[#1E8E5A] hover:bg-[#163827] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-title"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensaje</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};
