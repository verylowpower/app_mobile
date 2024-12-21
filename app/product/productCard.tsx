import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

type ProductCardProps = {
  id?: string;
  name: string;
  image: string;
  price: string;
  oldPrice: string;
  description: string;
  onAddToCart: () => void;
  onAddToFavorites: () => void;
};

const ProductCard = ({
  name,
  image,
  price,
  oldPrice,
  description,
  onAddToCart,
  onAddToFavorites,
}: ProductCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <Text style={styles.productName}>{name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.oldPrice}>{oldPrice} đ</Text>
        <Text style={styles.newPrice}>{price} đ /Kg</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
        <Text style={styles.buttonText}>Thêm Giỏ Hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoriteButton} onPress={onAddToFavorites}>
        <Text style={styles.buttonText}>Thêm Yêu Thích</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  oldPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#888",
    marginRight: 8,
  },
  newPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28A745",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 12,
  },
  cartButton: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  favoriteButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductCard;