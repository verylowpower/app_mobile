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
        style={styles.button}
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
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4EAF4E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
