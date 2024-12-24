// cartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    description?: string; // Added this line
}

interface CartContextProps {
    cart: CartItem[];
    favorites: string[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    addToFavorites: (item: CartItem) => void;
    removeFromFavorites: (itemId: string) => void;
    isFavorite: (itemId: string) => boolean;
    favoritesLoading: boolean;
    cartLoading: boolean;
    calculateTotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(true);

    // Load cart data from storage
    useEffect(() => {
        const loadCart = async () => {
            try {
                const cartData = await AsyncStorage.getItem('cart');
                if (cartData) {
                    setCart(JSON.parse(cartData));
                }
            } catch (error) {
                console.error('Failed to load cart data:', error);
            } finally {
                setCartLoading(false);
            }
        };
        loadCart();
    }, []);

    // Load favorites data from storage
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favData = await AsyncStorage.getItem('favorites');
                if (favData) {
                    setFavorites(JSON.parse(favData));
                }
            } catch (error) {
                console.error('Failed to load favorites data:', error);
            } finally {
                setFavoritesLoading(false);
            }
        };
        loadFavorites();
    }, []);

    // Save cart data to storage
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Failed to save cart data:', error);
            }
        };
        saveCart();
    }, [cart]);

    // Save favorite data to storage
    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('Failed to save favorite data:', error);
            }
        };
        saveFavorites();
    }, [favorites]);

    const addToCart = (item: CartItem) => {
      console.log("addToCart item:", item);
      setCart((prevCart) => {
          const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
          if (existingItemIndex !== -1) {
              const updatedCart = [...prevCart];
              updatedCart[existingItemIndex].quantity += 1;
              return updatedCart;
          } else {
              return [...prevCart, item];
          }
      });
  };

    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === itemId) {
                    return { ...item, quantity: quantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const addToFavorites = (item: CartItem) => {
        setFavorites((prevFavorites) => {
            if (!prevFavorites.includes(item.id)) return [...prevFavorites, item.id];
            return prevFavorites;
        });
        // ensure that item exist in cart
        addToCart(item);
    };

    const removeFromFavorites = (itemId: string) => {
        setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== itemId));
    };

    const isFavorite = (itemId: string) => {
        return favorites.includes(itemId);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                favorites,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                favoritesLoading,
                cartLoading,
                calculateTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { CartProvider, useCart, CartItem };