import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "./cart/cartContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import productService from "./components/productService";

interface Product {
    productId: number;
    productName: string;
    sku: string | null;
    price: number;
    quantity: number;
    discount: number;
    description: string;
    productType: string;
    imageUrl: string | null;
}

interface ProductResponse {
    productId: number;
    productName: string;
    sku: string | null;
    price: number;
    quantity: number;
    discount: number;
    description: string;
    productType: string;
    imageUrl: string | null;
}


const DEFAULT_IMAGE_URL = "https://via.placeholder.com/200?text=No+Image";

const ProductInfo = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();

    const [imageError, setImageError] = useState(false);
    const [isFavoriteButtonRed, setIsFavoriteButtonRed] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleGoBack = () => {
        router.back();
    };

    const id = Array.isArray(params?.productId) ? params.productId[0] : params?.productId || "";

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data: ProductResponse = await productService.getProductDetails(id);
                 const formattedProduct: Product = {
                    ...data,
                    imageUrl: data.imageUrl || null
                 };
                 setProduct(formattedProduct);

            } catch (err: any) {
                setError(err.message || "Failed to fetch product details");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    useEffect(() => {
        if (product) {
            setIsFavoriteButtonRed(isFavorite(String(product.productId)));
        }
    }, [product, isFavorite]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: String(product.productId),
                name: product.productName,
                image: product.imageUrl || DEFAULT_IMAGE_URL,
                price: product.price,
                quantity: 1,
                description: product.description,
            });
            Alert.alert("Thông báo", "Sản phẩm đã thêm vào giỏ hàng!");
        }
    };

    const handleAddToFavorites = () => {
        if (product) {
            const productId = String(product.productId);
            if (isFavorite(productId)) {
                removeFromFavorites(productId);
                setIsFavoriteButtonRed(false);
            } else {
                addToFavorites({
                    id: productId,
                    name: product.productName,
                    image: product.imageUrl || DEFAULT_IMAGE_URL,
                    price: product.price,
                    quantity: 1,
                    description: product.description,
                });
                setIsFavoriteButtonRed(true);
            }
        }
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text>Error: {error}</Text></View>;
    }
    if (!product) {
        return <View style={styles.centered}><Text>No product data</Text></View>;
    }

    //console.log("Product Image URL:", product.imageUrl)
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleGoBack} style={styles.goBack}>
                <Ionicons name="arrow-back" size={24} color="#000" />
                <Text style={styles.goBackText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.productContainer}>
                {product.imageUrl ? (
                     <Image
                       source={{
                           uri: product.imageUrl
                       }}
                       style={styles.productImage}

                   />
                ) : (
                   <View style={[styles.productImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center'}]}>
                       <Text>No Image</Text>
                   </View>
               )}
                <Text style={styles.productName}>{product.productName}</Text>
                <Text style={styles.productPrice}>{product.price} đ</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
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
                    {isFavoriteButtonRed ? "Remove from Favorites" : "Add to Favorites"}
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
    productDescription: { fontSize: 14, color: "#6c757d", textAlign: "center" },
    addToCartButton: { backgroundColor: "#28a745", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginBottom: 16 },
    addToCartText: { color: "#fff", fontSize: 16 },
    addToFavoritesButton: { backgroundColor: "#007bff", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
    addToFavoritesButtonRed: { backgroundColor: "#dc3545" },
    addToFavoritesText: { color: "#fff", fontSize: 16 },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProductInfo;