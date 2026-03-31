'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'INCREMENT'; id: number }
  | { type: 'DECREMENT'; id: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'INCREMENT':
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false }, (initial) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('db_cart');
        if (stored) return { ...initial, items: JSON.parse(stored) };
      } catch {}
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('db_cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCharge = subtotal >= 499 ? 0 : subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryCharge;

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, subtotal, deliveryCharge, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
