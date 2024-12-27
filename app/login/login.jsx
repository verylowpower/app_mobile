import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Checkbox } from 'react-native-paper';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '../components/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const showCustomAlert = (title, message) => {
        Alert.alert(title, message, [{ text: 'OK' }], { cancelable: true });
    };

    const handleLogin = async () => {
        if (!username || !password) {
            showCustomAlert('Lỗi', 'Vui lòng nhập tên người dùng và mật khẩu');
            return;
        }

        setIsLoading(true);
        try {
            const credentials = { userName: username, password }; // Changed: Send userName instead of username
            const response = await loginUser(credentials);

            if (response && response.token) {
                await AsyncStorage.setItem('token', response.token);
                router.push('/home');
            } else {
                showCustomAlert('Lỗi', 'Đăng nhập không thành công. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Login error:", error);
             let message = "Đã có lỗi xảy ra";
            if(error.statusCode === 401) {
                message = "Tài khoản hoặc mật khẩu không chính xác";
            } else if (error.message) {
               message =  error.message;
            }
          showCustomAlert('Lỗi', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            )}
            <View style={styles.logoSection}>
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
                        placeholder="Tên Người Dùng"
                        placeholderTextColor="#888"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật Khẩu"
                        placeholderTextColor="#888"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
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
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.forgotPassword}>
                    <Text
                        style={styles.link}
                        onPress={() => router.push("/login/forgotpass")}>
                        Quên Mật Khẩu?
                    </Text>
                </Text>
                <Text style={styles.register}>
                    Bạn Chưa Có Tài Khoản?{' '}
                    <Text
                        style={styles.link}
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
        fontFamily: 'outfit',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent white background
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 20,
    },
    logoImage: {
        width: 170,
        height: 170,
        resizeMode: 'contain',
    },
    loginBox: {
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
        marginLeft: 2,
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
    forgotPassword: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
        color: '#777',
    },
    register: {
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