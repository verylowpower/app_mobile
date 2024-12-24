import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useCart, CartItem } from '../cart/cartContext';
import { ListRenderItem } from 'react-native';


const Favorite = () => {
    const { favorites, cart, favoritesLoading } = useCart();
    const [favoriteItems, setFavoriteItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (!favoritesLoading) {
            // Fetch full cart item details based on favorite IDs
            const items = cart.filter((item) => favorites.includes(item.id));
            setFavoriteItems(items);
        }
    }, [favorites, cart, favoritesLoading]);


    const renderItem: ListRenderItem<CartItem> = ({ item }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} đ</Text>
            </View>
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
            <Text style={styles.title}>Favorite Products</Text>
            {favoriteItems.length === 0 ? (
                <Text style={styles.noFavoritesText}>No favorite products yet.</Text>
            ) : (
                <FlatList
                    data={favoriteItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    productItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    noFavoritesText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
});

export default Favorite;
