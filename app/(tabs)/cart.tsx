import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart, CartItem } from "../cart/cartContext";
import { ListRenderItem } from "react-native";
import { useRouter } from "expo-router";
import Checkout from "../cart/checkout"; // Import the Checkout component

const Cart = () => {
  const { cart, updateQuantity, calculateTotal } = useCart();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false); // Add state for checkout visibility

  const handleGoToCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  const renderItem: ListRenderItem<CartItem> = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.cartItem}
      onPress={() => {
        console.log("Cart item:", item);
        console.log("Navigating to ProductInfo with:", item);
        router.push({
          pathname: "/productInfo",
          params: {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price.toString(),
            description: item.description
              ? item.description
              : "No description available",
          },
        });
      }}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          Đơn giá: {item.price.toLocaleString()} đ
        </Text>
        <View style={styles.quantitySection}>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={item.quantity.toString()}
            onChangeText={(text) =>
              updateQuantity(item.id, Math.max(1, parseInt(text) || 1))
            }
          />
          <Text style={styles.itemTotalPrice}>
            {(item.price * item.quantity).toLocaleString()} đ
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!showCheckout ? (
        <>
          {/* Header */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => console.log("Back button pressed")}
            >
              <Ionicons name="arrow-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <Ionicons
              name="basket"
              size={24}
              color="#4CAF50"
              style={styles.basketIcon}
            />
            <Text style={styles.headerTitle}>
              Tổng Số Lượng Giỏ Hàng ({cart.length})
            </Text>
          </View>

          {/* Cart Items */}
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.cartItemsSection}
          />

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.totalText}>
              Tổng cộng: {calculateTotal().toLocaleString()} đ
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleGoToCheckout}
            >
              <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Checkout onBack={handleBackToCart} /> // Render Checkout if showCheckout is true
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  basketIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  cartItemsSection: {
    flex: 1,
    paddingHorizontal: 16,
    padding: 5,
    marginBottom: 70,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    textAlign: "center",
    marginRight: 10,
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;
