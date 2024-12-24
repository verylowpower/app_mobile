// checkout.jsx
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import { useCart } from './cartContext';

export default function Checkout({onBack}) {
  const { cart, updateQuantity, calculateTotal, removeFromCart } = useCart();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

    const deleteItem = (id) => {
        removeFromCart(id);
    };
  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    alert('Thanh toán thành công!');
      onBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh Toán</Text>
      </View>

      {/* Body */}
      <ScrollView style={styles.bodySection}>
        {/* Order Section */}
        <Text style={styles.sectionTitle}>Đơn đặt hàng của bạn</Text>
        {cart.map(item => (
          <View key={item.id} style={styles.cartItem}>
            {item.image && <Image source={{uri: item.image}} style={styles.itemImage} />}
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Đơn giá: {item.price.toLocaleString()} đ</Text>
              <View style={styles.quantitySection}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={item.quantity.toString()}
                  onChangeText={text => updateQuantity(item.id, Math.max(1, parseInt(text) || 1))}
                />
                <Text style={styles.itemTotalPrice}>{(item.price * item.quantity).toLocaleString()} đ</Text>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <Ionicons name="trash" size={24} color="red" style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Shipping Info Section */}
        <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
        <View style={styles.infoSection}>
          <Text>Email: greenshopadm@gmail.com</Text>
          <Text>Tên: hongg</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Ghi chú (nếu có)"
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Payment Method Section with Radio Buttons */}
        <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
        <View style={styles.paymentMethods}>
          <View style={styles.paymentOption}>
            <RadioButton
              value="COD"
              status={paymentMethod === 'COD' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('COD')}
              color="#4CAF50"
            />
            <Text style={styles.option}>Ship COD(Thanh toán khi nhận hàng)</Text>
          </View>
          <View style={styles.paymentOption}>
            <RadioButton
              value="Paypal"
              status={paymentMethod === 'Paypal' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('Paypal')}
              color="#4CAF50"
            />
            <Text style={styles.option}>Thanh toán với Paypal</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Section */}
      <View style={styles.footerSection}>
        <Text style={styles.totalText}>Tổng cộng: {calculateTotal().toLocaleString()} đ</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    bodySection: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    itemImage: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 5,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    quantitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        textAlign: 'center',
        marginRight: 10,
    },
    itemTotalPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    deleteIcon: {
        marginTop: 5,
    },
    infoSection: {
        marginBottom: 20,
        gap: 5,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    paymentMethods: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    option: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        fontStyle: 'italic',
    },
    footerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 5,
        elevation: 5,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    checkoutButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});