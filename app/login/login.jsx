import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Login() {
  const [isPasswordVisible, setPasswordVisibility] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const router = useRouter(); // Get the router object

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

  // Function to handle login (replace with your login logic)
  const handleLogin = () => {
    // Simulate successful login
    // For example: Check user credentials then redirect
    // After successful login, navigate to the home page
     router.push("/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container} >
      <View style={styles.logoSection} >
        <Image
          source={require('./../../assets/images/logo.jpg')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <Text style={styles.subtitle}>Sử Dụng Thông Tin Đăng Nhập Của Bạn</Text>
        <View>
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
            <View style={styles.optionItem}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                color="#4CAF50"
              />
              <Text style={styles.label}>Nhớ tôi</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText} >Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.forgotPassword}>
          <Text style={styles.link}
            onPress={() => router.push("/login/forgotpass")}>
            Quên Mật Khẩu?
          </Text>
        </Text>
        <Text style={styles.register}>
          Bạn Chưa Có Tài Khoản?{' '}
          <Text style={styles.link}
            onPress={() => router.push("/login/register")}>
            Đăng Ký Ngay
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
    marginBottom: 8, // Giảm khoảng cách logo và phần nội dung
    marginTop: 20, // Thêm chút khoảng cách phía trên
    fontFamily:'outfit',
  },
  logoImage: {
    width: 170, // Kích thước logo cho màn hình điện thoại
    height: 170,
    resizeMode: 'contain',
  },
  loginBox: {
    fontFamily: 'outfit',
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
    marginLeft: 2,
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
  forgotPassword: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#777',
    fontFamily:'outfit',
  },
  register: {
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