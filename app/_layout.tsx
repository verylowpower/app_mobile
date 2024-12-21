// _layout.tsx
import { Stack } from "expo-router";
import { useFonts} from "expo-font";
import { CartProvider } from "./cart/cartContext"; // Import CartProvider

export default function RootLayout() {
    useFonts({
        'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
        'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
        'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    });

    return (
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </CartProvider>
    );
}