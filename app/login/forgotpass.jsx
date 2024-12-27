import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { forgotPassword } from '../components/authService';

export default function ForgotPass() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const showCustomAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: true }
        );
    };

    // forgotpass.jsx
 const handleForgotPassword = async () => {
    if (!email) {
        showCustomAlert('Lỗi', 'Vui lòng điền địa chỉ email.');
        return;
    }

    const trimmedEmail = email.trim();
    setIsLoading(true);
    try {
      console.log('Sending forgot password request for email:', trimmedEmail); // Log email before request
        const response = await forgotPassword(trimmedEmail);
         console.log('API Response:', response); // Log response
        if (response) {
            showCustomAlert('Thành Công', 'Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến email của bạn');
            router.replace('/login/login');
        } else {
            showCustomAlert('Lỗi', 'Gửi yêu cầu đặt lại mật khẩu không thành công. Vui lòng thử lại.');
        }
    } catch (error) {
         console.error('Error forgot password:', error);
         console.log('Error', error); // Log lỗi đầy đủ
        showCustomAlert('Lỗi', error.message || 'Có lỗi xảy ra trong quá trình gửi email đặt lại mật khẩu, vui lòng thử lại');
    }
    finally {
        setIsLoading(false);
    }
};
    const handleLoginLink = () => {
        router.replace('/login/login');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoSection}>
                <Image
                    source={require('./../../assets/images/logo.jpg')}
                    style={styles.logoImage}
                />
            </View>
            <View style={styles.passwordResetBox}>
                <Text style={styles.title}>Quên Mật Khẩu</Text>
                <Text style={styles.subtitle}>Nhập địa chỉ email của bạn</Text>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Địa Chỉ Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={isLoading}>
                      <Text style={styles.buttonText}>{isLoading ? 'Đang Xử Lý...' : 'Đặt Lại Mật Khẩu'}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.loginText}>
                    Đã nhớ mật khẩu?{' '}
                    <Text style={styles.link} onPress={handleLoginLink}>
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