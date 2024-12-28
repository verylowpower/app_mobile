import React, { useState, useEffect, useCallback } from "react";
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import productService from '../components/productService'; // Assuming this is a service, not a Component


// Define the Product interface
interface Product {
    productId: number;
    productName: string;
    sku: string | null;
    price: number;
    quantity: number;
    discount: number;
    description: string;
    productType: string;
    imageUrl: string; // Make imageUrl non-nullable
    categoryName: string;
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
    imageUrl: string | null; // imageUrl is nullable from the service
    categoryName: string;
}

const ProductList = ({ searchText }: { searchText: string }) => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all products and include their images
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const productsData: ProductResponse[] = await productService.getAllProducts();
            console.log("Fetched Products:", productsData);
            const formattedProducts: Product[] = productsData.map(product => ({
                ...product,
                imageUrl: product.imageUrl || 'default_image.jpg'  // Provide a default image URL
            }));
            setProducts(formattedProducts);
            setFilteredProducts(formattedProducts);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };


    const filterProducts = useCallback(() => {
        let filtered = products;

        if (searchText) {
            filtered = filtered.filter(product =>
                product.productName?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (activeTag) {
            filtered = filtered.filter(product =>
                product.categoryName?.toLowerCase().includes(activeTag.toLowerCase())
            );
        }
        setFilteredProducts(filtered);
    }, [searchText, activeTag, products]);

    // Filter products based on search text and active tag
    useEffect(() => {
        filterProducts();
    }, [searchText, activeTag, products, filterProducts]);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Navigate to the product details screen
    const handlePress = (product: Product) => {
        router.push({
            pathname: "/productInfo",
            params: {
                productId: product.productId,
                productName: product.productName,
                price: String(product.price),
                description: product.description,
                imageUrl: product.imageUrl,
                categoryName: product.categoryName,
            },
        });
    };

    // Toggle active tag for filtering
    const handleTagFilter = (tag: string | null) => {
        setActiveTag(prevTag => (prevTag === tag ? null : tag));
    };

    // Render a single product item
    const renderProductItem = ({ item }: { item: Product }) => {
        console.log("Item Image URL:", item.imageUrl);
        return (
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.productItemContainer}>
                <View style={styles.productItem}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.productImage}
                        />
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.productPrice}>{item.price.toLocaleString()} đ/Kg</Text>
                </View>
            </TouchableOpacity>
        )
    };

    // Render tag filter buttons
    const renderTagButton = (tag: string) => (
        <TouchableOpacity
            key={tag}
            onPress={() => handleTagFilter(tag)}
            style={[styles.tagButton, activeTag === tag && styles.activeTagButton]}
        >
            <Text style={styles.tagText}>{tag}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text>Error: {error}</Text></View>;
    }

    return (
        <View>
            <View style={styles.tagFilterContainer}>
                {["Rau", "Trái cây", "Củ quả"].map(renderTagButton)}
                <TouchableOpacity style={styles.clearButton} onPress={() => handleTagFilter(null)}>
                    <Ionicons name="close-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredProducts}
                numColumns={3}
                keyExtractor={(item) => String(item.productId)}
                contentContainerStyle={styles.container}
                renderItem={renderProductItem}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 16,
        justifyContent: "center",
    },
    productItemContainer: {
        flex: 1 / 3,
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
        aspectRatio: 1,
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
    tagFilterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    tagButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginRight: 8,
        marginBottom: 5,
    },
    activeTagButton: {
        backgroundColor: '#a0a0a0',
    },
    tagText: {
        fontSize: 14,
    },
    clearButton: {
        alignSelf: 'center',
        marginLeft: 'auto',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default ProductList;
