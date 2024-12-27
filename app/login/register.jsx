import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { registerUser } from '../components/authService';

export default function Register() {
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const showCustomAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: true }
        );
    };

    const validateRegisterData = ({ user, password, email }) => {
        if (!user || !password || !email) return 'Vui lòng nhập đầy đủ thông tin.';
         const trimmedEmail = email.trim();
        // const emailRegex = /^[^\s@+@[^\s@]+\.[^\s@]+$/; // Regex cũ
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Regex mới
        if (!emailRegex.test(trimmedEmail)) return 'Email không hợp lệ.';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
        return null;
    };

    const handleRegister = async () => {
       const trimmedEmail = email.trim(); // Loại bỏ khoảng trắng thừa
        const errorMessage = validateRegisterData({ user: fullName, password, email: trimmedEmail });
        if (errorMessage) {
            showCustomAlert('Lỗi', errorMessage);
            return;
        }
        try {
            const response = await registerUser(userData);
            console.log('API Response:', response); // Log phản hồi từ API
        } catch (error) {
            console.error('Registration error:', JSON.stringify(error, null, 2)); // Log chi tiết lỗi
            showCustomAlert('Lỗi', error.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
        }
        

        setIsLoading(true);
        try {
            const userData = {
                user: fullName.trim(),
                password: password,
                email: trimmedEmail,
            };            
            console.log('Register Data:', userData);
            const response = await registerUser(userData);
            console.log('API Response:', response);
            if (response) {
                showCustomAlert('Thành Công', 'Đăng Ký Thành Công');
                router.replace('/login/login');
            } else {
               showCustomAlert('Lỗi', 'Đăng ký không thành công. Vui lòng thử lại.');
            }
        } catch (error) {
           console.error('Registration error:', error);
           console.log('Error', error); // Thêm log lỗi đầy đủ
            showCustomAlert('Lỗi', error.message || 'Có lỗi xảy ra trong quá trình đăng ký, vui lòng thử lại');
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
            <View style={styles.registerBox}>
                <Text style={styles.title}>Đăng Ký</Text>
                <Text style={styles.subtitle}>Thiết Lập Tài Khoản Mới</Text>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Họ và Tên"
                        placeholderTextColor="#888"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật Khẩu"
                        placeholderTextColor="#888"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Địa Chỉ Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
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
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? 'Đang Đăng Ký...' : 'Đăng Ký'}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.loginText}>
                    Đã có tài khoản?{' '}
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
        fontFamily: 'outfit',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 20,
        fontFamily: 'outfit',
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
        fontFamily: 'outfit',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'outfit',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#777',
        marginBottom: 20,
        fontFamily: 'outfit',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        padding: 8,
        marginBottom: 12,
        fontSize: 16,
        fontFamily: 'outfit',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        fontFamily: 'outfit',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'outfit',
    },
    label: {
        marginLeft: 5,
        fontSize: 15,
        color: '#666',
        fontFamily: 'outfit',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 20,
        alignItems: 'center',
        fontFamily: 'outfit',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'outfit',
    },
    loginText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#777',
        fontFamily: 'outfit',
    },
    link: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontFamily: 'outfit',
    },
});