import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProductCard from './product/productCard';
import { useCart } from './cart/cartContext'; // Import useCart

const ProductInfo = () => {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const router = useRouter();
  const { addToCart } = useCart(); // Get addToCart from context

  const handleGoBack = () => {
    router.back();
  };

 const handleAddToCart = () => {
    const item = {
      id: Array.isArray(params.id) ? params.id[0] : (params.id || ""), // use optional chaining to check for undefined
      name: Array.isArray(params.name) ? params.name[0] : (params.name || ""),
      image: Array.isArray(params.image) ? params.image[0] : (params.image || ""),
      price: Array.isArray(params.price) ? params.price[0] : (params.price || ""),
       quantity: 1 // add quantity here
    };
    // validate item properties
    if (item.id && item.name && item.image && item.price){
      addToCart(item);
      Alert.alert('Thông báo','Sản phẩm đã thêm vào giỏ hàng!');
    } else {
      Alert.alert('Error','Missing one of the following properties id, name, image, price');
    }

  };

  const handleAddToFavorites = () => {
    Alert.alert('Thông báo','Đã thêm vào yêu thích!');
  };

  const name = Array.isArray(params.name) ? params.name[0] : (params.name || "");
  const image = Array.isArray(params.image) ? params.image[0] : (params.image || "");
  const description = Array.isArray(params.description) ? params.description[0] : (params.description || "");
  const price = Array.isArray(params.price) ? params.price[0] : (params.price || "");
  const oldPrice = Array.isArray(params.oldPrice) ? params.oldPrice[0] : (params.oldPrice || "");
  const id = Array.isArray(params.id) ? params.id[0] : (params.id || "");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProductCard
        id={id}
        name={name}
        image={image}
        price={price}
        oldPrice={oldPrice}
        description={description}
        onAddToCart={handleAddToCart}
        onAddToFavorites={handleAddToFavorites}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductInfo;