export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  weight: string;
  description: string;
  badge: string;
  image: string;
  active: number;
  stock: number;
  created_at: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  subtotal: number;
  delivery_charge: number;
  total: number;
  status: string;
  notes: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ResellerLead {
  id: number;
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  partnership_type: string;
  message: string;
  status: string;
  created_at: string;
}
