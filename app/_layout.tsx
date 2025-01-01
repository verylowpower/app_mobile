import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { CartProvider } from "./cart/cartContext"; // Import CartProvider
import { ProfileProvider } from './context/ProfileContext';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
        'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
        'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return null; // Show a loading screen or null until fonts are loaded
    }

    return (
        <ProfileProvider>
        <CartProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
             </CartProvider>
        </ProfileProvider>
    );
}
