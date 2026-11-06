import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Check, 
  Filter, 
  Droplet, 
  Leaf, 
  Recycle, 
  Sun, 
  ArrowRight,
  Eye,
  X,
  Sparkles,
  Zap,
  FileDown
} from 'lucide-react';
import { Product, ProductCategory } from '../types/ecommerce';
import { PRODUCTS } from '../data/products';

interface CatalogSectionProps {
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ onAddToCart, onBuyNow }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Filtro categoria
      if (selectedCategory === 'mujer' && p.category !== 'mujer') return false;
      if (selectedCategory === 'hombre' && p.category !== 'hombre') return false;
      if (selectedCategory === 'accesorio' && p.category !== 'accesorio') return false;
      if (selectedCategory === 'oferta' && !p.isOffer) return false;

      // Filtro busqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesMaterial = p.material.toLowerCase().includes(query);
        const matchesColor = p.color.toLowerCase().includes(query);
        const matchesRef = p.ref.toLowerCase().includes(query);
        if (!matchesName && !matchesMaterial && !matchesColor && !matchesRef) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || product.sizes[0];
    onAddToCart(product, chosenSize);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1800);
  };

  const handleBuy = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || product.sizes[0];
    onBuyNow(product, chosenSize);
  };

  return (
    <section className="space-y-8">
      
      {/* Encabezado y buscador del Catálogo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD4BE] pb-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E0643A] font-title">
            Colección 2026
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-title mt-1">
            Catálogo Oficial EcoModa
          </h3>
          <p className="text-xs sm:text-sm text-[#435E50] max-w-xl mt-1 leading-relaxed">
            Prendas confeccionadas exclusivamente con lino regenerativo, algodón orgánico peruano y tintes vegetales no contaminantes.
          </p>
        </div>

        {/* Buscador de productos y Botón Descargar Catálogo */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por prenda, tela o color..."
              className="w-full px-4 py-2.5 pl-10 text-xs bg-white border border-[#DFD4BE] rounded-xl text-[#1F4D36] placeholder-[#435E50]/60 focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
            />
            <Search className="w-4 h-4 text-[#435E50] absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-[#435E50] hover:text-[#1F4D36]"
              >
                ✕
              </button>
            )}
          </div>

          <a
            href="/catalogo-ecomoda.pdf"
            download="Catalogo-EcoModa-2026.pdf"
            className="px-4 py-2.5 bg-[#1E8E5A] hover:bg-[#163827] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-title shrink-0"
            title="Descargar catálogo oficial en PDF para celular o computadora"
          >
            <FileDown className="w-4 h-4 text-[#7CC242]" />
            <span>Descargar Catálogo (PDF)</span>
          </a>
        </div>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFDF8] border border-[#DFD4BE] rounded-xl shadow-2xs">
          {[
            { id: 'todos', label: 'Todos los productos' },
            { id: 'mujer', label: 'Mujer' },
            { id: 'hombre', label: 'Hombre' },
            { id: 'accesorio', label: 'Accesorios' },
            { id: 'oferta', label: 'En Oferta' }
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer font-title ${
                  isActive
                    ? 'bg-[#1E8E5A] text-white shadow-xs'
                    : 'text-[#1F4D36] hover:bg-[#1E8E5A]/10'
                }`}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-semibold text-[#435E50]">
          Mostrando <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'prenda' : 'prendas'}
        </span>
      </div>

      {/* Cuadrícula de Prendas (3 columnas en desktop, 2 en tablet, 1 en móvil) */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#DFD4BE] rounded-2xl space-y-3">
          <p className="text-sm font-semibold text-[#1F4D36]">
            No encontramos prendas que coincidan con "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }}
            className="px-4 py-2 bg-[#1E8E5A] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((p) => {
            const isAdded = recentlyAddedId === p.id;
            const currentChosenSize = selectedSizes[p.id] || p.sizes[0];

            return (
              <article
                key={p.id}
                className="bg-[#FFFDF8] border-2 border-[#DFD4BE] hover:border-[#7CC242] rounded-2xl overflow-hidden shadow-xs hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Foto de la prenda en proporción 4:5 */}
                  <div className="relative aspect-[4/5] bg-[#F7F1E3] overflow-hidden border-b border-[#DFD4BE]">
                    <img
                      src={p.imageSrc}
                      alt={`${p.name} - ${p.color}`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Insignias de la foto */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {p.isOffer && (
                        <span className="bg-[#E0643A] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs font-title">
                          {p.discountPercent}% OFF
                        </span>
                      )}
                      {p.isNew && (
                        <span className="bg-[#F4B626] text-[#1F4D36] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs font-title">
                          NUEVO
                        </span>
                      )}
                    </div>

                    <span className="absolute top-3 right-3 z-10 bg-[#FFFDF8]/95 backdrop-blur-xs text-[#1F4D36] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#DFD4BE] shadow-2xs">
                      {p.ecoBadge}
                    </span>

                    {/* Botón de vista rápida sobre la foto al hover */}
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(p)}
                      className="absolute bottom-3 right-3 z-10 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-[#1F4D36] hover:bg-[#1E8E5A] hover:text-white transition-all shadow-sm opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Vista rápida del producto"
                      aria-label={`Ver detalles de ${p.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Información de la prenda */}
                  <div className="p-5 space-y-2">
                    
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#435E50] tracking-wider uppercase">
                      <span>{p.categoryLabel}</span>
                      <span className="font-mono text-[#1F4D36]">REF: {p.ref}</span>
                    </div>

                    <h4 
                      onClick={() => setQuickViewProduct(p)}
                      className="font-extrabold text-[#1F4D36] text-base leading-snug font-title line-clamp-2 cursor-pointer hover:text-[#1E8E5A] transition-colors"
                    >
                      {p.name}
                    </h4>

                    <p className="text-xs text-[#435E50] leading-relaxed line-clamp-2">
                      {p.material} · {p.color}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#1E8E5A] font-semibold pt-1">
                      <Droplet className="w-3.5 h-3.5 shrink-0" />
                      <span>Ahorra <strong>{p.waterSavedLiters} L de agua</strong></span>
                    </div>

                    {/* Selector de tallas */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-[#1F4D36] block mb-1">
                        Talla:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.sizes.map((size) => {
                          const isSelected = currentChosenSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSelectSize(p.id, size)}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1F4D36] text-white border-[#1F4D36]'
                                  : 'bg-white text-[#1F4D36] border-[#DFD4BE] hover:border-[#1E8E5A]'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Precios */}
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-2xl font-extrabold text-[#E0643A] font-title">
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

                {/* Botones de Acción (Añadir al carrito y Comprar Ahora) */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdd(p)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      isAdded
                        ? 'bg-[#7CC242] text-[#1F4D36]'
                        : 'bg-[#1E8E5A] hover:bg-[#163827] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBuy(p)}
                    className="py-2.5 px-3 bg-[#E0643A] hover:bg-[#c8542c] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer font-title shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Comprar</span>
                  </button>
                </div>

              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Vista Rápida del Producto */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F4D36]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border-2 border-[#DFD4BE] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full text-[#1F4D36] hover:bg-[#1E8E5A] hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar vista rápida"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="aspect-[4/5] bg-[#F7F1E3] overflow-hidden">
                <img
                  src={quickViewProduct.imageSrc}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E0643A] block">
                    {quickViewProduct.categoryLabel} · REF: {quickViewProduct.ref}
                  </span>
                  <h4 className="text-xl font-extrabold text-[#1F4D36] font-title leading-snug">
                    {quickViewProduct.name}
                  </h4>
                  <p className="text-xs text-[#435E50] leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  <div className="p-3 bg-[#F7F1E3] rounded-xl text-xs space-y-1 text-[#1F4D36]">
                    <p><strong>Material:</strong> {quickViewProduct.material}</p>
                    <p><strong>Color:</strong> {quickViewProduct.color}</p>
                    <p><strong>Origen:</strong> {quickViewProduct.origin}</p>
                    <p className="text-[#1E8E5A] font-semibold flex items-center gap-1 pt-1">
                      <Droplet className="w-3.5 h-3.5" />
                      <span>{quickViewProduct.waterSavedLiters} L de agua preservados</span>
                    </p>
                  </div>

                  <div className="pt-1">
                    <span className="text-xs font-bold text-[#1F4D36] block mb-1">
                      Tallas disponibles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickViewProduct.sizes.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-white border border-[#DFD4BE] text-xs font-semibold rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl font-extrabold text-[#E0643A] font-title">
                      S/ {quickViewProduct.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAdd(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 px-4 bg-[#1E8E5A] hover:bg-[#163827] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir al Carrito</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = quickViewProduct;
                      setQuickViewProduct(null);
                      handleBuy(p);
                    }}
                    className="flex-1 py-3 px-4 bg-[#E0643A] hover:bg-[#c8542c] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-title shadow-sm"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Comprar Ahora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
