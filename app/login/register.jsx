import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React from 'react';
import { Checkbox } from 'react-native-paper';

export default function Register() {
  const [isPasswordVisible, setPasswordVisibility] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  // Hàm hiển thị thông báo với tiêu đề tùy chỉnh
  const showCustomAlert = (title, message) => {
    Alert.alert(
      title, // Tiêu đề
      message, // Nội dung
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: true } // Cho phép người dùng hủy thông báo bằng cách nhấn ra ngoài
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require('./../../assets/images/logo.jpg')} // Đảm bảo đường dẫn này đúng
          style={styles.logoImage}
        />
      </View>
      <View style={styles.registerBox}>
        <Text style={styles.title}>Đăng Ký</Text>
        <Text style={styles.subtitle}>Thiết Lập Tài Khoản Mới</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Họ và Tên"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Địa Chỉ Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật Khẩu"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible}
          />
          <View style={styles.options}>
          <View style={styles.optionItem}>
              <Checkbox
                status={isPasswordVisible ? 'checked' : 'unchecked'}
                onPress={() => setPasswordVisibility(!isPasswordVisible)}
                color="#4CAF50"
              />
              <Text style={styles.label}>Hiển thị mật khẩu</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đăng Ký</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loginText}>
          Đã có tài khoản?{' '}
          <Text style={styles.link} onPress={() => showCustomAlert('Đăng Nhập', 'Đi tới đăng nhập')}>
            Đăng Nhập Ngay
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'flex-start',
    fontFamily:'outfit',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
    fontFamily:'outfit',
  },
  logoImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  registerBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    fontFamily:'outfit',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily:'outfit',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
    fontFamily:'outfit',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
    fontFamily:'outfit',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    fontFamily:'outfit',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily:'outfit',
  },
  label: {
    marginLeft: 5,
    fontSize: 15,
    color: '#666',
    fontFamily:'outfit',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    fontFamily:'outfit',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'outfit',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#777',
    fontFamily:'outfit',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontFamily:'outfit',
  },
});
