import React from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
} from "react-native";
import { useRouter } from "expo-router";

const products = [
  {
    id: "1",
    name: "Fresh Mango",
    image: "https://via.placeholder.com/200",
    price: "5000",
    oldPrice: "60000",
    description: "Delicious and juicy mangoes",
  },
  {
    id: "2",
    name: "Red Apple",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "5000",
    description: "Fresh and crunchy apples",
  },
  {
    id: "3",
    name: "Test Product",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
  {
    id: "4",
    name: "Test Product 2",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
  {
    id: "5",
    name: "Test Product 3",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
  {
    id: "6",
    name: "Test Product 4",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
  {
    id: "7",
    name: "Test Product 4",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
  {
    id: "8",
    name: "Test Product 4",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
  {
    id: "9",
    name: "Test Product 4",
    image: "https://via.placeholder.com/200",
    price: "40000",
    oldPrice: "50000",
    description: "This is a test product",
  },
];

const ProductList = () => {
  const router = useRouter();

  const handlePress = (product) => {
    const productWithNumberPrice = { ...product, price: Number(product.price) };
    router.push({ pathname: "productInfo", params: productWithNumberPrice });
  };

  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handlePress(item)}
        style={styles.productItemContainer}
      >
        <View style={styles.productItem}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            onError={() => {
              console.warn("Error loading image for product:", item.name);
            }}
          />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} đ/Kg</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={products}
      numColumns={3}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={renderProductItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
  },
  productItemContainer: {
    flex: 1 / 3, // Ensures 3 items per row
    padding: 8,
  },
  productItem: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1, // Ensures square images
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});

export default ProductList;
