import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getProfile, updateProfile } from '../components/authService'; // Import from authService

export default function EditPersonalInfo() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [adress, setadress] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [sex, setSex] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(false); // useRef to track mounting

    useEffect(() => {
        const fetchProfile = async () => {
            try {
              if (!isMounted.current) {
                  const response = await getProfile();
                  setName(response.name);
                  setEmail(response.email);
                  setPhone(response.phone);
                  setadress(response.adress);

                  if (response.birthday) {
                    const birthDate = new Date(response.birthday);
                    setDay(String(birthDate.getDate()).padStart(2, '0'));
                    setMonth(String(birthDate.getMonth() + 1).padStart(2, '0'));
                    setYear(String(birthDate.getFullYear()));
                  }
                  setSex(response.sex || '');
                   setImageUrl(response.imageUrl || '');
              }

            } catch (error) {
                console.error('Error fetching profile:', error);
                Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
            } finally {
                setLoading(false);
                isMounted.current = true;
             }
        };

      fetchProfile();
    }, []);


    const handleSave = async () => {
        try {
            const birthdayString = `${year}-${month}-${day}`;
            const birthdayDate = new Date(birthdayString);

            if (isNaN(birthdayDate)) {
                Alert.alert('Lỗi', 'Ngày sinh không hợp lệ.');
                return;
            }

            const profileData = {
                fullName: name,
                email,
                phone,
                adress,
                birthday: birthdayDate.toISOString(),
                sex,
                imageUrl,
            };

            const response = await updateProfile(profileData);

            if (response) {
                Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật!');
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.');
        }
    };


    if (loading) {
      return(
            <View style={styles.container}>
                 <Text style={styles.title}>Đang tải thông tin...</Text>
             </View>
         )
    }

  return (
     <ScrollView style={styles.container}>
        <Text style={styles.title}>Thay Đổi Thông Tin Cá Nhân</Text>

        <TextInput
           style={styles.input}
           placeholder="Tên đầy đủ"
           value={name}
           onChangeText={setName}
        />
        <TextInput
           style={styles.input}
           placeholder="Email"
            value={email}
           onChangeText={setEmail}
         />
        <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
           value={phone}
           onChangeText={setPhone}
         />
        <TextInput
           style={styles.input}
           placeholder="Địa chỉ"
           value={adress}
           onChangeText={setadress}
       />

        <View style={styles.dateInputContainer}>
            <TextInput
              style={[styles.dateInput, { width: '20%' }]}
              placeholder="DD"
               value={day}
              onChangeText={setDay}
             keyboardType="number-pad"
              maxLength={2}
             />
           <Text style={{ marginHorizontal: 5 }}>/</Text>
           <TextInput
              style={[styles.dateInput, { width: '20%' }]}
              placeholder="MM"
              value={month}
               onChangeText={setMonth}
             keyboardType="number-pad"
               maxLength={2}
            />
             <Text style={{ marginHorizontal: 5 }}>/</Text>
            <TextInput
               style={[styles.dateInput, { width: '30%' }]}
               placeholder="YYYY"
               value={year}
                onChangeText={setYear}
              keyboardType="number-pad"
               maxLength={4}
           />
       </View>

       <TextInput
            style={styles.input}
           placeholder="Giới tính"
           value={sex}
          onChangeText={setSex}
        />

       <TextInput
          style={styles.input}
           placeholder="URL ảnh đại diện"
           value={imageUrl}
         onChangeText={setImageUrl}
       />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
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
        color: '#4CAF50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 20,
        marginBottom: 15,
    },
   dateInputContainer: {
      flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
  },
   dateInput: {
      borderWidth: 1,
       borderColor: '#ddd',
        padding: 10,
        borderRadius: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});