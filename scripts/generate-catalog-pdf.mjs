import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

// Crear documento PDF tamaño A4 (210 x 297 mm)
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = 210;
const pageHeight = 297;
const margin = 16;
const contentWidth = pageWidth - (margin * 2);

// Paleta EcoModa
const COLOR_BOSQUE = [31, 77, 54];     // #1F4D36
const COLOR_ESMERALDA = [30, 142, 90]; // #1E8E5A
const COLOR_TERRACOTA = [224, 100, 58];// #E0643A
const COLOR_ARENA = [247, 241, 227];   // #F7F1E3
const COLOR_TEXTO = [67, 94, 80];      // #435E50
const COLOR_BLANCO = [255, 255, 255];

// ==========================================
// PÁGINA 1: PORTADA EDITORIAL
// ==========================================

// Fondo color arena
doc.setFillColor(...COLOR_ARENA);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

// Franja superior verde bosque
doc.setFillColor(...COLOR_BOSQUE);
doc.rect(0, 0, pageWidth, 50, 'F');

// Logo y Título
doc.setTextColor(...COLOR_BLANCO);
doc.setFont('helvetica', 'bold');
doc.setFontSize(32);
doc.text('ECOMODA', margin, 26);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
doc.setTextColor(124, 194, 66); // Verde hoja
doc.text('MODA SOSTENIBLE, ESTILO CON PROPÓSITO', margin, 36);

// Recuadro editorial central
doc.setFillColor(...COLOR_BLANCO);
doc.roundedRect(margin, 60, contentWidth, 160, 4, 4, 'F');
doc.setDrawColor(223, 212, 190);
doc.roundedRect(margin, 60, contentWidth, 160, 4, 4, 'S');

doc.setTextColor(...COLOR_BOSQUE);
doc.setFont('helvetica', 'bold');
doc.setFontSize(22);
doc.text('CATÁLOGO OFICIAL 2026', margin + 10, 80);

doc.setFont('helvetica', 'normal');
doc.setFontSize(11);
doc.setTextColor(...COLOR_TEXTO);
const intro = [
  'EcoModa es una marca peruana comprometida con la honestidad textil, el diseño atemporal y el respeto por los recursos hídricos del Perú.',
  '',
  'Confeccionamos nuestras prendas exclusivamente con:',
  '• 100% Algodón pima orgánico certificado GOTS (Valle de Chincha)',
  '• Lino europeo prelavado y regenerativo de bajo consumo hídrico',
  '• Fibras recicladas de supra-reciclaje en Lurín',
  '• Botones de madera natural de poda y tintes 100% vegetales sin plomo ni ftalatos',
  '',
  'Nuestras colecciones están diseñadas para durar años, reduciendo la huella de carbono y preservando más de 1,200 litros de agua limpia por cada prenda.'
];
let textY = 95;
for (const line of intro) {
  doc.text(line, margin + 10, textY);
  textY += 6.5;
}

// Banda de contacto y redes en portada
doc.setFillColor(...COLOR_ESMERALDA);
doc.rect(0, 240, pageWidth, 57, 'F');

doc.setTextColor(...COLOR_BLANCO);
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.text('CANALES OFICIALES & PEDIDOS:', margin, 252);

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.text('• WhatsApp Oficial: +51 998 765 432 (Atención inmediata para pedidos y tallas)', margin, 260);
doc.text('• Instagram: @ECOMO_DA01 (https://www.instagram.com/ecomo_da01/)', margin, 267);
doc.text('• Facebook: EcoModa Oficial (https://www.facebook.com/share/1DTQTSisre/)', margin, 274);
doc.text('• Web & Tienda Online: WWW.ECOMODA.PE · Envíos a todo el Perú', margin, 281);

// ==========================================
// PÁGINA 2: COLECCIÓN MUJER
// ==========================================
doc.addPage();
doc.setFillColor(...COLOR_ARENA);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

// Header de página
doc.setFillColor(...COLOR_BOSQUE);
doc.rect(0, 0, pageWidth, 28, 'F');
doc.setTextColor(...COLOR_BLANCO);
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.text('COLECCIÓN MUJER · ECOMODA 2026', margin, 18);

const womenItems = [
  { ref: 'ECO-M01', name: 'Blusa de algodón orgánico con mangas abullonadas', mat: '100% Algodón orgánico GOTS · Color Arena Natural', price: 'S/ 95.00', eco: 'Algodón orgánico · Ahorra 950 L de agua', sizes: 'XS, S, M, L, XL' },
  { ref: 'ECO-M02', name: 'Vestido de lino reciclado con estampado botánico', mat: '70% Lino, 30% Fibra reciclada · Color Verde Hoja', price: 'S/ 219.00', eco: 'Lino regenerativo · Ahorra 1,400 L de agua', sizes: 'S, M, L' },
  { ref: 'ECO-M03', name: 'Pantalón palazzo de lino natural', mat: '100% Lino europeo · Color Crema Suave', price: 'S/ 165.00', eco: 'Tinte botánico · Ahorra 1,100 L de agua', sizes: 'XS, S, M, L, XL' },
  { ref: 'ECO-M04', name: 'Falda midi de algodón pima con botones de madera', mat: '100% Algodón pima orgánico · Color Verde Oliva', price: 'S/ 130.00', eco: 'Algodón pima · Ahorra 880 L de agua', sizes: 'XS, S, M, L' },
  { ref: 'ECO-M05', name: 'Chaqueta ligera de fibras recicladas PET', mat: '100% Fibra reciclada · Color Verde Bosque', price: 'S/ 259.00', eco: 'PET reciclado · Ahorra 1,650 L de agua', sizes: 'S, M, L, XL' },
  { ref: 'ECO-M06', name: 'Top de punto de algodón orgánico teñido botánico', mat: '100% Algodón orgánico · Color Terracota Suave', price: 'S/ 79.00', eco: 'Tinte vegetal · Ahorra 700 L de agua', sizes: 'XS, S, M, L' }
];

let itemY = 38;
womenItems.forEach((item, index) => {
  doc.setFillColor(...COLOR_BLANCO);
  doc.roundedRect(margin, itemY, contentWidth, 36, 2, 2, 'F');
  doc.setDrawColor(223, 212, 190);
  doc.roundedRect(margin, itemY, contentWidth, 36, 2, 2, 'S');

  // Badge REF
  doc.setFillColor(...COLOR_ESMERALDA);
  doc.roundedRect(margin + 4, itemY + 4, 24, 6, 1, 1, 'F');
  doc.setTextColor(...COLOR_BLANCO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(item.ref, margin + 6, itemY + 8.5);

  // Nombre
  doc.setTextColor(...COLOR_BOSQUE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(item.name, margin + 32, itemY + 9);

  // Material y tallas
  doc.setTextColor(...COLOR_TEXTO);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Material: ${item.mat}`, margin + 6, itemY + 18);
  doc.text(`Tallas: ${item.sizes}  |  Impacto: ${item.eco}`, margin + 6, itemY + 25);

  // Precio en Terracota
  doc.setTextColor(...COLOR_TERRACOTA);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(item.price, pageWidth - margin - 30, itemY + 28);

  itemY += 41;
});

// Footer de página 2
doc.setFillColor(...COLOR_BOSQUE);
doc.rect(0, 287, pageWidth, 10, 'F');
doc.setTextColor(...COLOR_BLANCO);
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.text('EcoModa · Pedidos directos a WhatsApp +51 998 765 432 · Página 2 de 3', margin, 293);

// ==========================================
// PÁGINA 3: COLECCIÓN HOMBRE & ACCESORIOS
// ==========================================
doc.addPage();
doc.setFillColor(...COLOR_ARENA);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

// Header de página 3
doc.setFillColor(...COLOR_BOSQUE);
doc.rect(0, 0, pageWidth, 28, 'F');
doc.setTextColor(...COLOR_BLANCO);
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.text('COLECCIÓN HOMBRE & ACCESORIOS · ECOMODA 2026', margin, 18);

const menItems = [
  { ref: 'ECO-H01', name: 'Camisa de lino natural prelavado con botones de corozo', mat: '100% Lino orgánico europeo · Color Arena Natural', price: 'S/ 189.00', eco: 'Lino orgánico · Ahorra 1,200 L agua', sizes: 'S, M, L, XL, XXL' },
  { ref: 'ECO-H02', name: 'Pantalón chino de corte relajado con triple puntada', mat: '100% Algodón pima orgánico · Color Verde Oliva Tierra', price: 'S/ 175.00', eco: 'Algodón orgánico · Ahorra 1,350 L agua', sizes: '28, 30, 32, 34, 36' },
  { ref: 'ECO-H03', name: 'Polo de algodón orgánico cuello redondo básico', mat: '100% Algodón pima GOTS · Color Blanco Roto', price: 'S/ 85.00', eco: 'Hipoalergénico · Ahorra 800 L agua', sizes: 'S, M, L, XL, XXL' },
  { ref: 'ECO-H04', name: 'Chaqueta de fibras recicladas bomber con cremallera', mat: '100% Fibra reciclada · Color Verde Bosque', price: 'S/ 279.00', eco: 'PET reciclado · Ahorra 1,750 L agua', sizes: 'M, L, XL, XXL' },
  { ref: 'ECO-A01', name: 'Bolso Tote Bag de lino pesado resistente', mat: 'Lino regenerativo de alto gramaje · Color Arena Rústico', price: 'S/ 85.00', eco: 'Reemplaza bolsas plásticas · Ahorra 480 L agua', sizes: 'Talla Única' },
  { ref: 'ECO-A04', name: 'Gorra clásica de lino fresco estructurada', mat: '100% Lino con visera vegetal · Color Verde Bosque', price: 'S/ 65.00', eco: 'Fibra vegetal · Ahorra 360 L agua', sizes: 'Ajustable' }
];

itemY = 38;
menItems.forEach((item, index) => {
  doc.setFillColor(...COLOR_BLANCO);
  doc.roundedRect(margin, itemY, contentWidth, 36, 2, 2, 'F');
  doc.setDrawColor(223, 212, 190);
  doc.roundedRect(margin, itemY, contentWidth, 36, 2, 2, 'S');

  doc.setFillColor(...COLOR_ESMERALDA);
  doc.roundedRect(margin + 4, itemY + 4, 24, 6, 1, 1, 'F');
  doc.setTextColor(...COLOR_BLANCO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(item.ref, margin + 6, itemY + 8.5);

  doc.setTextColor(...COLOR_BOSQUE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(item.name, margin + 32, itemY + 9);

  doc.setTextColor(...COLOR_TEXTO);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Material: ${item.mat}`, margin + 6, itemY + 18);
  doc.text(`Tallas: ${item.sizes}  |  Impacto: ${item.eco}`, margin + 6, itemY + 25);

  doc.setTextColor(...COLOR_TERRACOTA);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(item.price, pageWidth - margin - 30, itemY + 28);

  itemY += 41;
});

// Footer de página 3
doc.setFillColor(...COLOR_BOSQUE);
doc.rect(0, 287, pageWidth, 10, 'F');
doc.setTextColor(...COLOR_BLANCO);
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.text('EcoModa · Instagram: @ECOMO_DA01 · Facebook: /1DTQTSisre · Página 3 de 3', margin, 293);

// Guardar archivo PDF en /public/catalogo-ecomoda.pdf
const outputBuffer = Buffer.from(doc.output('arraybuffer'));
const outputPath = path.resolve('public/catalogo-ecomoda.pdf');
fs.writeFileSync(outputPath, outputBuffer);
console.log(`PDF generado con éxito en ${outputPath} (${outputBuffer.length} bytes)`);
