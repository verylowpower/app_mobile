import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "./cart/cartContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProductInfo = () => {
    const params = useLocalSearchParams();
    console.log("ProductInfo params:", params);
    const router = useRouter();
    const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
        useCart();

    const [imageError, setImageError] = useState(false);
    const [isFavoriteButtonRed, setIsFavoriteButtonRed] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    const isValid = (value: any): boolean => {
        return value !== undefined && value !== null && value !== "";
    };

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
    const name = Array.isArray(params?.name) ? params.name[0] : params?.name || "";
    const image = Array.isArray(params?.image) ? params.image[0] : params?.image || "";

    const priceParam = params?.price || "";
    const price = isValid(priceParam) ? Number(priceParam) : 0;

    const oldPriceParam = params?.oldPrice || "";
    const oldPrice = isValid(oldPriceParam) ? Number(oldPriceParam).toLocaleString() : "";


    const description = params?.description
        ? Array.isArray(params.description)
            ? params.description.join(", ")
            : String(params.description)
        : "No description available";

    console.log("params.description:", params?.description);

    const handleAddToCart = () => {
        const item = {
            id,
            name,
            image,
            price,
            quantity: 1,
            description,
        };

        if (isValid(item.id) && isValid(item.name) && isValid(item.image) && isValid(item.price)) {
            addToCart(item);
            Alert.alert("Thông báo", "Sản phẩm đã thêm vào giỏ hàng!");
        } else {
            Alert.alert(
                "Error",
                `Missing properties: ${!isValid(item.id) ? "id " : ""}${!isValid(item.name) ? "name " : ""}${!isValid(item.image) ? "image " : ""}${!isValid(item.price) ? "price" : ""}`
            );
        }
    };

    const handleAddToFavorites = () => {
        const item = {
            id,
            name,
            image,
            price,
            quantity: 1,
            description,
        };

        if (isValid(item.id) && isValid(item.name) && isValid(item.image) && isValid(priceParam)) {
            if (isFavorite(item.id)) {
                removeFromFavorites(item.id);
                setIsFavoriteButtonRed(false);
            } else {
                addToFavorites(item);
                setIsFavoriteButtonRed(true);
            }
        }
    };

    useEffect(() => {
        setIsFavoriteButtonRed(isFavorite(id));
    }, [id, isFavorite]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleGoBack} style={styles.goBack}>
                <Ionicons name="arrow-back" size={24} color="#000" />
                <Text style={styles.goBackText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.productContainer}>
                <Image
                    source={{
                        uri: imageError
                            ? "https://via.placeholder.com/200?text=No+Image"
                            : image,
                    }}
                    style={styles.productImage}
                    onError={() => setImageError(true)}
                />
                <Text style={styles.productName}>{name}</Text>
                <Text style={styles.productPrice}>{price} đ</Text>
                {oldPrice && <Text style={styles.productOldPrice}>Old Price: {oldPrice} đ</Text>}
                <Text style={styles.productDescription}>{description}</Text>
            </View>
            <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleAddToFavorites}
                style={[
                    styles.addToFavoritesButton,
                    isFavoriteButtonRed ? styles.addToFavoritesButtonRed : {},
                ]}
            >
                <Text style={styles.addToFavoritesText}>
                    {isFavorite(id) ? "Xóa khỏi Yêu Thích" : "Thêm vào Yêu Thích"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#F5F5F5", padding: 16 },
    goBack: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    goBackText: { marginLeft: 8, fontSize: 16, color: "#000" },
    productContainer: { alignItems: "center", marginBottom: 32 },
    productImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 16 },
    productName: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    productPrice: { fontSize: 16, color: "#28a745", marginBottom: 4 },
    productOldPrice: { fontSize: 14, color: "#dc3545", textDecorationLine: "line-through", marginBottom: 8 },
    productDescription: { fontSize: 14, color: "#6c757d", textAlign: "center" },
    addToCartButton: { backgroundColor: "#28a745", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginBottom: 16 },
    addToCartText: { color: "#fff", fontSize: 16 },
    addToFavoritesButton: { backgroundColor: "#007bff", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
    addToFavoritesButtonRed: { backgroundColor: "#dc3545" },
    addToFavoritesText: { color: "#fff", fontSize: 16 },
});

export default ProductInfo;