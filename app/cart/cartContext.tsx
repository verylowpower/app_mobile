import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for the cart item and context
export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  calculateTotal: () => number;
  favorites: string[]; //Changed to string[] type
  addToFavorites: (item: CartItem) => void; //Keep item as CartItem
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoritesLoading: boolean;
    clearFavorites: () => void;

}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Error loading cart from AsyncStorage:", error);
      }
    };

    const loadFavorites = async () => {
      try {
        setFavoritesLoading(true);
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites from AsyncStorage:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };

    loadCart();
    loadFavorites();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to AsyncStorage:", error);
      }
    };
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to AsyncStorage:", error);
      }
    };
    saveCart();
    saveFavorites();
  }, [cart, favorites]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        const updatedCart = prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== id);
            return updatedCart;
      });
    };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToFavorites = (item: CartItem) => {
    setFavorites((prevFavorites) => {
        if(!prevFavorites.includes(item.id)){
            return [...prevFavorites, item.id];
        }else {
            return prevFavorites;
        }

    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((itemId) => itemId !== id)
    );
  };

    const clearFavorites = () => {
        setFavorites([]);
    };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
          favoritesLoading,
          clearFavorites,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};