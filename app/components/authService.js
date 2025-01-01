import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.2.4:9056/user-service/api';

// Helper function to handle fetch requests
const handleFetch = async (url, options) => {
    try {
        console.log('Request URL:', url);
        console.log('Request Options:', JSON.stringify(options));

        const response = await fetch(url, options);

        if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            let errorBody;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    errorBody = await response.json();
                    errorMessage += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
                } else {
                    errorBody = await response.text();
                    errorMessage += ` - ${errorBody}`;
                }
            } catch (jsonError) {
                try {
                    const textError = await response.text();
                    errorMessage += ` - ${textError}`;
                } catch (textError) {
                    errorMessage += ` - Could not parse the error message.`;
                }
            }
            console.error("Fetch error:", errorMessage, { url, options, response });
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error("Fetch error:", error, { url, options });
        throw error;
    }
};

// Token management helpers
const TOKEN_KEY = "authToken";

const setToken = async (token) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.log("Token set successfully in AsyncStorage:", token);
    } catch (e) {
        console.error("Error setToken:", e);
    }
};

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        console.log('Retrieved token:', token); // Log the token for debugging
        return token;
    } catch (e) {
        console.error('Error retrieving token:', e);
        return null;
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        console.log("Token removed successfully from AsyncStorage");
    } catch (e) {
        console.error("Error removeToken:", e);
    }
};

// AuthService functions
export const registerUser = async (userData) => {
    console.log('Registering user with data:', userData);
    return handleFetch(`${BASE_URL}/account/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: userData.user,
            password: userData.password,
            email: userData.email,
        }),
    });
};

export const forgotPassword = async (email) => {
    console.log('Sending forgot password request for email:', email);
    const url = `${BASE_URL}/account/forgot-password?email=${encodeURIComponent(email)}`;
    return handleFetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const loginUser = async (credentials) => {
    console.log('Logging in with credentials:', credentials);
    const response = await handleFetch(`${BASE_URL}/account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (response && response.token) {
        await setToken(response.token);
        console.log("Token saved:", response.token);
    }

    return response;
};

export const changePassword = async (newPasswordData) => {
    const token = await getToken();
    if (!token) {
        throw new Error('User is not authenticated. Token not found.');
    }

    console.log('Changing password with data:', newPasswordData);
    return handleFetch(`${BASE_URL}/account/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPasswordData),
    });
};

export const logoutUser = async () => {
    console.log('Logging out user and removing token');
    await removeToken();
};

// Profile Service functions
export const getProfile = async () => {
    const token = await getToken();
    if (!token) {
        throw new Error('User is not authenticated. Token not found.');
    }
    return handleFetch(`${BASE_URL}/profile/infor`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

export const updateProfile = async (profileData) => {
    const token = await getToken();
    if (!token) {
        throw new Error('User is not authenticated. Token not found.');
    }
    return handleFetch(`${BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });
};