import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import { useNavigation, useRouter } from "expo-router";

const products = [
    {
        id: "1",
        name: "Fresh Mango",
        image: "https://via.placeholder.com/200",
        price: "50,000",
        oldPrice: "60,000",
        description: "Delicious and juicy mangoes",
    },
    {
        id: "2",
        name: "Red Apple",
        image: "https://via.placeholder.com/20",
        price: "40,000",
        oldPrice: "50,000",
        description: "Fresh and crunchy apples",
    },
    {
        id: "3",
        name: "Test Product",
        image: "https://via.placeholder.com/200",
        price: "40,000",
        oldPrice: "50,000",
        description: "This is a test product",
    },
    {
        id: "4",
        name: "Test Product 2",
        image: "https://via.placeholder.com/200",
        price: "40,000",
        oldPrice: "50,000",
        description: "This is a test product",
      },
    {
        id: "5",
        name: "Test Product 3",
        image: "https://via.placeholder.com/200",
        price: "40,000",
        oldPrice: "50,000",
        description: "This is a test product",
      },
      {
          id: "6",
          name: "Test Product 4",
          image: "https://via.placeholder.com/200",
          price: "40,000",
          oldPrice: "50,000",
          description: "This is a test product",
        },
]

const ProductList = () => {
    const router = useRouter();

    const handlePress = (product) => {
        router.push({ pathname: 'productInfo', params: product });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {products.map((product) => (
                <TouchableOpacity key={product.id} onPress={() => handlePress(product)} style={{ maxWidth: '33%'}}>
                    <View style={styles.productItem}>
                        <Image source={{ uri: product.image }} style={styles.productImage} />
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>{product.price} đ/Kg</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 16,
    },
    productItem: {
        align: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        margin: 8
    },
    productName: {
        fontSize: 16,
        marginTop: 4
    },
    productPrice: {
        fontSize: 14,
        color: 'gray'
    }
});

export default ProductList;