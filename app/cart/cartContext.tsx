// cartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the cart item and context
type CartItem = {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number; // Add the quantity property
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex > -1) {
          const updatedCart = prevCart.map((cartItem, index) =>
            index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
          return updatedCart;
        } else {
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });
    };

  const removeFromCart = (id: string) => {
      setCart((prevCart) => {
          const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === id);

            if (existingItemIndex > -1) {
                const existingItem = prevCart[existingItemIndex];
                if(existingItem.quantity > 1) {
                     const updatedCart = prevCart.map((cartItem, index) =>
                        index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
                    );
                  return updatedCart;

                } else {
                  return prevCart.filter((item) => item.id !== id)
                }

          }
           return prevCart;
      });
    };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};