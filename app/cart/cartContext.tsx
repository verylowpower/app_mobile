import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import orderService from '../components/orderService';
import { useProfile } from '../context/ProfileContext';

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    description?: string;
}

interface CartContextProps {
    cart: CartItem[];
    cartId: number | null;
    fetchCart: () => Promise<void>;
    clearCart: () => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    calculateTotal: () => number;
    // Favorites-related properties
    favorites: string[];
    favoritesLoading: boolean; // Trạng thái loading cho favorites
    addToFavorites: (item: CartItem) => void;
    removeFromFavorites: (itemId: string) => void;
    isFavorite: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<number | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true); // Thêm trạng thái loading
    const { profile } = useProfile();

    // Load favorites from AsyncStorage on mount
    const loadFavorites = async () => {
        setFavoritesLoading(true); // Bắt đầu loading
        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            if (favoritesString) {
                setFavorites(JSON.parse(favoritesString));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setFavoritesLoading(false); // Kết thúc loading
        }
    };

    // Save favorites to AsyncStorage whenever it changes
    const saveFavorites = async () => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    useEffect(() => {
        saveFavorites();
    }, [favorites]);

    const fetchCart = useCallback(async () => {
        if (profile.userId) {
            try {
                const cartData = await orderService.getCartItems(profile.userId.toString());
                if (cartData && cartData.cartItems) {
                    const formattedCart = cartData.cartItems.map((item: any) => ({
                        id: item.productId.toString(),
                        name: item.productName,
                        image: item.imageUrl ? item.imageUrl.replace('localhost', '192.168.2.4') : null,
                        price: item.price,
                        quantity: item.quantity,
                        description: item.description,
                    }));
                    setCart(formattedCart);
                    setCartId(cartData.cartId);
                }
            } catch (error) {
                console.error('Failed to load cart data:', error);
            }
        } else {
            setCart([]);
            setCartId(null);
        }
    }, [profile.userId]);

    const clearCart = useCallback(() => {
        setCart([]);
        setCartId(null);
    }, []);

    const addToCart = async (item: CartItem) => {
        if (profile.userId) {
            try {
                const newItem = { productId: parseInt(item.id), quantity: 1, price: item.price };
                await orderService.addItemToCart(profile.userId.toString(), newItem);
                await fetchCart();
            } catch (error) {
                console.error("Error adding item to cart:", error);
            }
        }
    };

    const removeFromCart = async (itemId: string) => {
        if (profile.userId) {
            try {
                await orderService.removeItemFromCart(profile.userId.toString(), itemId);
                await fetchCart();
            } catch (error) {
                console.error("Error removing item from cart:", error);
            }
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (profile.userId) {
            try {
                await orderService.updateCartItemQuantity(profile.userId.toString(), itemId, quantity);
                await fetchCart();
            } catch (error) {
                console.error("Error updating item quantity:", error);
            }
        }
    };

    const calculateTotal = useCallback(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const addToFavorites = (item: CartItem) => {
        if (!favorites.includes(item.id)) {
            setFavorites([...favorites, item.id]);
        }
    };

    const removeFromFavorites = (itemId: string) => {
        setFavorites(favorites.filter(id => id !== itemId));
    };

    const isFavorite = (itemId: string): boolean => {
        return favorites.includes(itemId);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                cartId,
                fetchCart,
                clearCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                calculateTotal,
                // Favorites-related properties
                favorites,
                favoritesLoading, // Thêm vào context
                addToFavorites,
                removeFromFavorites,
                isFavorite,
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