import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.210.165:9056/user-service/api';

// Helper function to handle fetch requests
const handleFetch = async (url, options) => {
    try {
        console.log('Request URL:', url);
        console.log('Request Options:', JSON.stringify(options));

        const response = await fetch(url, options);

        if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            try {
                const errorBody = await response.json();
                errorMessage += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
            } catch (jsonError) {
                const errorText = await response.text();
                errorMessage += ` - ${errorText}`;
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
     } catch (e) {
         console.error("Error setToken:", e);
     }
};

const getToken = async () => {
     try {
        return await AsyncStorage.getItem(TOKEN_KEY);
     } catch (e) {
         console.error("Error getToken:", e);
         return null;
     }
};

const removeToken = async () => {
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
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
            user: userData.user, // Sử dụng "user" thay vì "username"
            password: userData.password,
            email: userData.email,
        }),
    });
};

export const forgotPassword = async (email) => {
    console.log('Sending forgot password request for email:', email);
    const url = `${BASE_URL}/account/forgot-password?email=${encodeURIComponent(email)}`; // Construct URL with query param
   return handleFetch(url, {
        method: 'GET', // Change to GET
         headers: {
            'Content-Type': 'application/json', // Remove body from fetch request.
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
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPasswordData),
    });
};

export const authenticatedFetch = async (url, options = {}) => {
    const token = await getToken();
    if (!token) {
        throw new Error('User is not authenticated. Token not found.');
    }

    console.log('Making authenticated request to:', url);
    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
    };

    return handleFetch(url, authOptions);
};

export const logoutUser = async () => {
    console.log('Logging out user and removing token');
     await removeToken();
};