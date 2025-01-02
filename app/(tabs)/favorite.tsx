import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCart, CartItem } from '../cart/cartContext';
import { ListRenderItem } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const Favorite = () => {
    const { favorites, cart, favoritesLoading, removeFromFavorites } = useCart();
    const [favoriteItems, setFavoriteItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (!favoritesLoading) {
            const items = cart.filter((item) => favorites.includes(item.id));
            setFavoriteItems(items);
        }
    }, [favorites, cart, favoritesLoading]);

    const handleRemoveFavorite = (itemId: string) => {
        removeFromFavorites(itemId);
    };

    const renderItem: ListRenderItem<CartItem> = ({ item }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
            </TouchableOpacity>
        </View>
    );

    if (favoritesLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading Favorites...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Favorite Products</Text>
            {favoriteItems.length === 0 ? (
                <Text style={styles.noFavoritesText}>You haven't added any favorites yet.</Text>
            ) : (
                <FlatList
                    data={favoriteItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    productItem: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '500',
        color: '#28a745',
    },
    noFavoritesText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 40,
        fontStyle: 'italic',
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 18,
        color: '#555',
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    listContainer: {
        paddingBottom: 16,
    },
});

export default Favorite;