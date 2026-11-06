export type ProductCategory = 'mujer' | 'hombre' | 'accesorio';

export interface Product {
  id: string;
  ref: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  sizes: string[];
  color: string;
  material: string;
  description: string;
  imageSrc: string;
  ecoBadge: string;
  isNew?: boolean;
  isOffer?: boolean;
  isBestSeller?: boolean;
  waterSavedLiters: number;
  origin: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethodId = 
  | 'yape' 
  | 'plin' 
  | 'transferencia' 
  | 'tarjeta' 
  | 'billetera' 
  | 'contraentrega';

export interface ShippingInfo {
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  reference: string;
  deliveryNotes?: string;
}

export interface OrderConfirmation {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethodId;
  paymentReference: string;
  shippingInfo: ShippingInfo;
  waterSavedTotal: number;
  pointsEarned: number;
}

export interface PromoCoupon {
  code: string;
  discountPercent: number;
  minAmount: number;
  description: string;
}
