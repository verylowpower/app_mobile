import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ẩn toàn bộ header mặc định cho tất cả các màn hình
      }}
    >
      {/* Các màn hình được định nghĩa ở đây */}
      <Stack.Screen name="userSetting" />
      <Stack.Screen name="purchaseHistory" />
      <Stack.Screen name="changePassword" />
      <Stack.Screen name="editPersonalInfo" />
      <Stack.Screen name="deleteAccount" />
    </Stack>
  );
}
