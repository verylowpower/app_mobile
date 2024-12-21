import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React from 'react';
import { Checkbox } from 'react-native-paper'; // Import Checkbox từ thư viện react-native-paper

export default function ForgotPass() {
  const [email, setEmail] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isPasswordVisible, setPasswordVisibility] = React.useState(false); // State kiểm soát hiển thị mật khẩu

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

  // Hàm kiểm tra và gửi yêu cầu thay đổi mật khẩu
  const handleResetPassword = () => {
    if (newPassword === confirmPassword) {
      showCustomAlert('Success', 'Mật khẩu đã được thay đổi thành công.');
    } else {
      showCustomAlert('Error', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require('./../../assets/images/logo.jpg')} // Đảm bảo đường dẫn này đúng
          style={styles.logoImage}
        />
      </View>
      <View style={styles.passwordResetBox}>
        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.subtitle}>Nhập thông tin để đặt lại mật khẩu của bạn</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Địa Chỉ Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật Khẩu Cũ"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật Khẩu Mới"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Xác Nhận Mật Khẩu Mới"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Đặt Lại Mật Khẩu</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loginText}>
          Đã nhớ mật khẩu?{' '}
          <Text style={styles.link} onPress={() => showCustomAlert('Login', 'Đi tới đăng nhập')}>
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
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  passwordResetBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 5,
    fontSize: 15,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#777',
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
