// cartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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
     fetchCart: () => Promise<void>;
     realTimeUpdate: boolean
    setRealTimeUpdate: (realTimeUpdate: boolean) => void
    calculateTotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(true);
      const [realTimeUpdate, setRealTimeUpdate] = useState(true);
    const {profile} = useProfile()

    // Load cart data from storage
      const fetchCart = async () => {
          if(profile.userId) {
               try {
                   setCartLoading(true);
                   const cartData = await orderService.getCartItems(profile.userId.toString());
                    if (cartData && cartData.cartItems) {
                       // Map cartItems data to CartItem
                        const formattedCart = cartData.cartItems.map((item: any) => ({
                           id: item.productId.toString(),
                           name: item.productName,
                            image: item.imageUrl
                              ? item.imageUrl.replace('localhost', '192.168.2.4')
                               : null,
                           price: item.price,
                           quantity: item.quantity,
                           description: item.description
                       }));
                       setCart(formattedCart);
                   }
               } catch (error) {
                   console.error('Failed to load cart data:', error);
               } finally {
                   setCartLoading(false);
               }
          } else {
              console.log("user not logged in")
              setCart([]);
              setCartLoading(false);
          }

    }

    useEffect(() => {
      fetchCart();
    }, [profile.userId]);
   useEffect(() => {
        let intervalId: any;

        if (realTimeUpdate && profile.userId) {
            intervalId = setInterval(() => {
                console.log("Realtime update")
                fetchCart();
            }, 5000);
        }


        return () => {
          if(intervalId) {
             clearInterval(intervalId);
           }

        }
    }, [realTimeUpdate, profile.userId]);


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

  const addToCart = async (item: CartItem) => {
        if (profile.userId) {
            try {
              const newItem = { productId: parseInt(item.id), quantity: 1, price: item.price }; // Include price here
              await orderService.addItemToCart(profile.userId.toString(), newItem);
              // Log success message with product info
              console.log('Successfully added to cart:', {
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: 1,
              });
              await fetchCart();
            } catch (error) {
              console.error("Error adding item to cart:", error);
            }
          }
        };

   const removeFromCart = async (itemId: string) => {
        if(profile.userId) {
            try{
                await orderService.removeItemFromCart(profile.userId.toString(), itemId);
                await fetchCart();

            } catch (error) {
                console.error("Error removing item from cart:", error)
            }
        }

    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setCart((previousCart) => {
            return previousCart.map((item) => {
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
    setFavorites((previousFavorites) => {
      if (!previousFavorites.includes(item.id)) {
        return [...previousFavorites, item.id];
      }
      return previousFavorites;
    });
  };

    const removeFromFavorites = (itemId: string) => {
        setFavorites((previousFavorites) => previousFavorites.filter((id) => id !== itemId));
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
                fetchCart,
                 realTimeUpdate,
                 setRealTimeUpdate
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