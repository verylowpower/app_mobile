import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getProfile } from '../components/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Profile {
    userId: number | null;
    fullName: string;
    email: string;
    phone: string;
    adress: string;
    birthday: string;
    sex: string;
    imageUrl: string;
    loading: boolean;
}

interface ProfileContextProps {
    profile: Profile;
    fetchProfile: () => Promise<void>;
    setProfile: (profile: Partial<Profile>) => void;
    logout: () => Promise<void>; // Thêm hàm logout
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<Profile>({
        userId: null,
        fullName: '',
        email: '',
        phone: '',
        adress: '',
        birthday: '',
        sex: '',
        imageUrl: '',
        loading: true,
    });

    const setProfilePartial = (updatedProfile: Partial<Profile>) => {
        setProfile((prevProfile) => ({ ...prevProfile, ...updatedProfile }));
    };

    const fetchProfile = useCallback(async (retryCount = 0) => {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            console.log("ProfileContext: Token not available, setting loading to false");
            setProfile(prev => ({ ...prev, loading: false }));
            return;
        }
        setProfile(prev => ({ ...prev, loading: true }));
        try {
            console.log("ProfileContext: before getProfile call");
            const response = await getProfile();
            console.log("ProfileContext: after getProfile call, response:", response);
            if (response && response.userId != null) {
                setProfile({
                    userId: response.userId,
                    fullName: response.fullName,
                    email: response.email,
                    phone: response.phone,
                    adress: response.adress,
                    birthday: response.birthday,
                    sex: response.sex,
                    imageUrl: response.imageUrl,
                    loading: false,
                });
            } else {
                console.log("ProfileContext: userId not found in response, setting loading to false");
                setProfile(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error('Error fetching profile in ProfileContext:', error);
            if (retryCount < 3) {
                console.log("retrying", retryCount);
                setTimeout(() => {
                    fetchProfile(retryCount + 1);
                }, 1000);
            } else {
                setProfile(prev => ({ ...prev, loading: false }));
            }
        }
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem('token'); // Xóa token
        setProfile({
            userId: null,
            fullName: '',
            email: '',
            phone: '',
            adress: '',
            birthday: '',
            sex: '',
            imageUrl: '',
            loading: false,
        }); // Làm mới profile
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <ProfileContext.Provider value={{ profile, fetchProfile, setProfile: setProfilePartial, logout }}>
            {children}
        </ProfileContext.Provider>
    );
};

const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export { ProfileProvider, useProfile, Profile };