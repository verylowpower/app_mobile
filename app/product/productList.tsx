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
import productService from '../components/productService';

interface ProductImage {
    id?: number;
    url: string;
}
interface Product {
    productId: number;
    productName: string;
    sku: string | null;
    price: number;
    oldPrice: number | null;
    quantity: number;
    discount: number;
    description: string;
    productType: string;
    images: ProductImage[];
    categoryName: string;
    categoryId: number;
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
    imageUrl: string[] | string | null;
    categoryName: string;
    categoryId: number;
}

interface Category {
    categoryName: string;
    count: number;
    categoryId: number;
}

const ProductList = ({ searchText }: { searchText: string }) => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [activeTag, setActiveTag] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (categoryId: number | null = null) => {
        setLoading(true);
        setError(null);
        try {
            let productsData: ProductResponse[];
            if (categoryId) {
                productsData = await productService.getProductsByCategoryId(categoryId);
            } else {
                productsData = await productService.getAllProducts();
            }
            const formattedProducts: Product[] = productsData.map(product => {
                let images: ProductImage[] = [];
                if (Array.isArray(product.imageUrl)) {
                    images = product.imageUrl.map((url, index) => ({
                        id: index,
                        url: url ? url.replace('localhost', '192.168.2.4') : '',
                    }));
                } else if (typeof product.imageUrl === 'string') {
                    images = [{ id: 0, url: product.imageUrl.replace('localhost', '192.168.2.4') }];
                }

                // Tính toán giá cũ và giá mới sau khi giảm giá
                const oldPrice = product.price;
                const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

                return {
                    ...product,
                    images: images,
                    productId: product.productId,
                    productName: product.productName,
                    sku: product.sku,
                    price: discountedPrice,
                    oldPrice: oldPrice,
                    quantity: product.quantity,
                    discount: product.discount,
                    description: product.description,
                    productType: product.productType,
                    categoryName: product.categoryName,
                    categoryId: product.categoryId,
                };
            });
            setProducts(formattedProducts);
            setFilteredProducts(formattedProducts);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const categoriesData: Category[] = await productService.getCategoryCounts();
            setCategories(categoriesData);
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
        setFilteredProducts(filtered);
    }, [searchText, products]);

    useEffect(() => {
        filterProducts();
    }, [searchText, products, filterProducts]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handlePress = (product: Product) => {
        router.push({
            pathname: "/productInfo",
            params: {
                productId: String(product.productId),
                productName: product.productName,
                price: String(product.price),
                oldPrice: String(product.oldPrice),
                description: product.description,
                imageUrl: product.images[0]?.url,
                categoryName: product.categoryName,
                discount: String(product.discount),
            },
        });
    };

    const handleTagFilter = async (categoryId: number | null) => {
        setActiveTag(categoryId);
        await fetchProducts(categoryId);
    };

    const renderProductItem = ({ item }: { item: Product }) => {
        return (
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.productItemContainer}>
                <View style={styles.productItem}>
                    <Image
                        source={{ uri: item.images[0]?.url }}
                        style={styles.productImage}
                        resizeMode="cover"
                        onError={(e) => console.error(`Error loading image: ${item.images[0]?.url}`, e.nativeEvent.error)}
                    />
                    <Text style={styles.productName}>{item.productName}</Text>
                    <View style={styles.priceContainer}>
                        {item.discount > 0 && (
                            <Text style={styles.oldPrice}>{item.oldPrice?.toLocaleString()} đ/Kg</Text>
                        )}
                        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ/Kg</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderTagButton = (category: Category) => (
        <TouchableOpacity
            key={category.categoryId}
            onPress={() => handleTagFilter(category.categoryId)}
            style={[styles.tagButton, activeTag === category.categoryId && styles.activeTagButton]}
        >
            <Text style={styles.tagText}>{category.categoryName}</Text>
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
                {categories.map(category => renderTagButton(category))}
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
        backgroundColor: "#f0f0f0",
    },
    productName: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 8, // Add margin bottom
    },
    priceContainer: {
        flexDirection: "column", // Stack prices vertically
        alignItems: "flex-end", // Align prices to the right
        justifyContent: "center",
    },
    oldPrice: {
        fontSize: 14,
        color: "gray",
        textDecorationLine: 'line-through',
    },
    productPrice: {
        fontSize: 14,
        color: "black",
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