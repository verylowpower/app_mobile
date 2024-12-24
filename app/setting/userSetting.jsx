import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserSetting() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài Đặt</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/setting/purchaseHistory')}
      >
        <Text style={styles.buttonText}>Lịch sử mua hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/setting/changePassword')}
      >
        <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/setting/editPersonalInfo')}
      >
        <Text style={styles.buttonText}>Thay Đổi Thông Tin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.dangerButton]}
        onPress={() => router.push('/setting/deleteAccount')}
      >
        <Text style={styles.buttonText}>Xóa Tài Khoản</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', 
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dangerButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});