import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCart } from '../cart/cartContext'; // Import the hook

const Cart = () => {
    const { cart, removeFromCart } = useCart(); // Access cart items

    const handleRemoveItem = (id: string) => {
        removeFromCart(id);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shopping Cart</Text>
            {cart.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is empty.</Text>
            ) : (
                 <FlatList
                    data={cart}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem} key={item.id}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                           <View style={styles.itemDetails}>
                               <Text style={styles.itemName}>{item.name}</Text>
                                <View style={styles.priceQuantity}>
                                   <Text style={styles.itemPrice}>${item.price}</Text>
                                   <Text style={styles.itemQuantity}>x {item.quantity}</Text>
                                </View>
                            </View>
                           <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.id)}>
                                <Text style={styles.deleteButtonText}>X</Text>
                           </TouchableOpacity>

                        </View>
                    )}
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
        marginBottom: 20,
        fontFamily: 'outfit-bold',
    },
    emptyCartText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'outfit-medium',
    },
    cartItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
         alignItems: 'center'
    },
     itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
         marginRight: 10
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'outfit-medium',
    },
    itemPrice: {
        fontSize: 16,
        color: '#888',
        fontFamily: 'outfit',
    },
     itemQuantity: {
        fontSize: 16,
        color: '#888',
        fontFamily: 'outfit-medium',
        marginLeft: 5
    },
      priceQuantity: {
          flexDirection: 'row',
          alignItems: 'center'
      },
     deleteButton: {
        backgroundColor: '#DC3545',
        borderRadius: 15,
         width: 30,
         height: 30,
        alignItems: 'center',
         justifyContent: 'center',
         marginLeft: 'auto'
    },
     deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
export default Cart;