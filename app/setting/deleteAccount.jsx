import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DeleteAccount() {
  const navigation = useNavigation();

  const handleDelete = () => {
    alert('Tài khoản của bạn đã bị xóa!');
    // Thực hiện logic xóa tài khoản ở đây
  };

  const handleCancel = () => {
    navigation.goBack(); // Quay lại màn hình trước đó (màn hình cài đặt)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xóa Tài Khoản</Text>
      <Text style={styles.warning}>
        Bạn sẽ xóa tài khoản. Hành động này không thể khôi phục lại!
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Hủy Bỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Xác Nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff4d4d',
  },
  warning: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 25,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});