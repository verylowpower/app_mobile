import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile } from '../components/authService'; // Import from authService

export default function Profile() {
    const router = useRouter();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setProfileData(response);
            } catch (error) {
                console.error('Error fetching profile:', error);
                Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Đăng Xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng Xuất', onPress: () => router.replace('/login/login') },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Đang tải thông tin...</Text>
            </View>
        );
    }

    if (!profileData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Không có thông tin người dùng</Text>
            </View>
        );
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
       try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch(error) {
         console.log(error)
          return "Invalid Date"
      }
    };

    return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>Thông Tin Người Dùng</Text>

        <View style={styles.avatarContainer}>
           <Image
              source={{
                    uri: profileData.imageUrl ? profileData.imageUrl : 'https://via.placeholder.com/100'
                 }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{profileData.fullName}</Text>
        </View>

        <View style={styles.infoContainer}>
           <Text style={styles.infoLabel}>Email:</Text>
           <Text style={styles.infoValue}>{profileData.email}</Text>

           <Text style={styles.infoLabel}>Số điện thoại:</Text>
            <Text style={styles.infoValue}>{profileData.phone}</Text>

            <Text style={styles.infoLabel}>Địa chỉ:</Text>
             <Text style={styles.infoValue}>{profileData.adress}</Text>

           <Text style={styles.infoLabel}>Ngày sinh:</Text>
           <Text style={styles.infoValue}>{formatDate(profileData.birthday)}</Text>

           <Text style={styles.infoLabel}>Giới tính:</Text>
           <Text style={styles.infoValue}>{profileData.sex || 'N/A'}</Text>

        </View>

        <TouchableOpacity
           style={styles.settingsButton}
            onPress={() => router.push('/setting/userSetting')}
        >
           <Text style={styles.settingsText}>Cài Đặt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#4CAF50',
        textAlign: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContainer: {
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
    },
    settingsButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    settingsText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#FF5252',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});