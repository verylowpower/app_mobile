import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import { useCart } from './cartContext';
import paymentService from '../components/paymentService'; // Import paymentService
import { useProfile } from '../context/ProfileContext'; // Import useProfile để lấy thông tin người dùng

const { height } = Dimensions.get('window');
const MAX_CART_ITEMS_HEIGHT = height * 0.3; // Adjust as needed

export default function Checkout({ onBack }) {
  const { cart, updateQuantity, calculateTotal, removeFromCart, clearCart } = useCart();
  const { profile } = useProfile(); // Lấy thông tin người dùng từ context
  const [address, setAddress] = useState(profile.adress || '123 Đường ABC'); // Sử dụng địa chỉ từ profile
  const [phone, setPhone] = useState(profile.phone || '0987654321'); // Sử dụng số điện thoại từ profile
  const [note, setNote] = useState('Giao hàng nhanh');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false); // State to handle loading state

  const deleteItem = (id) => {
    removeFromCart(id);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }
  
    setIsProcessing(true); // Set loading state
  
    try {
      // Tạo đơn hàng
      const orderData = {
        userId: profile.userId, // Sử dụng userId từ profile
        totalCost: calculateTotal(),
        userInfo: {
          name: profile.fullName, // Sử dụng tên từ profile
          address: address,
          phone: phone,
          note: note,
        },
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'ONLINE', // Sử dụng giá trị phù hợp
      };
      console.log("Sending order data:", JSON.stringify(orderData, null, 2)); // Log dữ liệu gửi lên server
  
      // Gọi API createOrder
      const orderId = await paymentService.createOrder(orderData); // Phản hồi là orderId
  
      // Kiểm tra orderId
      if (!orderId) {
        throw new Error("Không nhận được orderId từ API createOrder");
      }
      console.log("Received orderId:", orderId); // Log orderId nhận được
  
      // Thêm sản phẩm vào đơn hàng
      const shippingData = {
        orderId: orderId.toString(), // Chuyển orderId thành chuỗi
        orderItems: cart.map(item => ({
          productId: item.id.toString(), // Đảm bảo productId là chuỗi
          quantity: item.quantity,
          price: item.price,
        })),
      };
      console.log("Sending shipping data:", JSON.stringify(shippingData, null, 2)); // Log dữ liệu gửi lên server
      const addShippingResponse =  await paymentService.addShipping(shippingData);
       if(!addShippingResponse || !addShippingResponse.success){
          throw new Error(`Lỗi khi thêm shipping: ${addShippingResponse.message}`);
       }
  
      // Xử lý thanh toán
      if (paymentMethod === 'COD') {
        const codPaymentResponse = await paymentService.createCodPayment(orderId);
         if(!codPaymentResponse || !codPaymentResponse.success){
          throw new Error(`Lỗi khi tạo thanh toán COD: ${codPaymentResponse.message}`);
       }
        alert('Thanh toán COD thành công!');
      } else if (paymentMethod === 'VNPay') {
        // Xử lý thanh toán VNPay ở đây (nếu cần)
        alert('Thanh toán VNPay thành công!');
      }
  
      clearCart(); // Xóa giỏ hàng sau khi thanh toán
      onBack(); // Quay lại trang trước
    } catch (error) {
      console.error('Lỗi trong quá trình thanh toán:', error);
      alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false); // Reset loading state
    }
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
      <ScrollView style={styles.bodyScrollView}>
        <View style={styles.bodySection}>
          {/* Order Section */}
          <Text style={styles.sectionTitle}>Đơn đặt hàng của bạn</Text>
          <View style={[styles.cartItemsContainer, { maxHeight: MAX_CART_ITEMS_HEIGHT }]}>
            <ScrollView>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Đơn giá: {item.price.toLocaleString()} đ</Text>
                    <View style={styles.quantitySection}>
                      <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={item.quantity.toString()}
                        onChangeText={(text) =>
                          updateQuantity(item.id, Math.max(1, parseInt(text) || 1))
                        }
                      />
                      <Text style={styles.itemTotalPrice}>
                        {(item.price * item.quantity).toLocaleString()} đ
                      </Text>
                      <TouchableOpacity onPress={() => deleteItem(item.id)}>
                        <Ionicons name="trash" size={24} color="red" style={styles.deleteIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Shipping Info Section */}
          <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
          <View style={styles.infoSection}>
            <Text>Email: {profile.email || 'Chưa có thông tin'}</Text> {/* Hiển thị email từ profile */}
            <Text>Tên: {profile.fullName || 'Chưa có thông tin'}</Text> {/* Hiển thị tên từ profile */}
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
          <View style={styles.paymentMethodsContainer}>
            <View style={styles.paymentMethods}>
              <View style={styles.paymentOption}>
                <RadioButton
                  value="COD"
                  status={paymentMethod === 'COD' ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod('COD')}
                  color="#4CAF50"
                />
                <Text style={styles.option}>Ship COD (Thanh toán khi nhận hàng)</Text>
              </View>
              <View style={styles.paymentOption}>
                <RadioButton
                  value="VNPay"
                  status={paymentMethod === 'VNPay' ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod('VNPay')}
                  color="#4CAF50"
                />
                <Text style={styles.option}>Thanh toán với VNPay</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Section */}
      <View style={styles.footerSection}>
        <Text style={styles.totalText}>Tổng cộng: {calculateTotal().toLocaleString()} đ</Text>
        <TouchableOpacity
          style={[styles.checkoutButton, isProcessing && styles.disabledButton]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={styles.checkoutButtonText}>
            {isProcessing ? 'Đang xử lý...' : 'Thanh Toán'}
          </Text>
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
  bodyScrollView: {
    flex: 1,
  },
  bodySection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cartItemsContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  paymentMethodsContainer: {
    marginBottom: 20,
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
    padding: 8,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  paymentMethods: {
    flexDirection: 'column',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  disabledButton: {
    backgroundColor: '#ccc', // Change button color when disabled
  },
});