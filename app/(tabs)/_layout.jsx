import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{headerShown:false}}>
      <Tabs.Screen name='home'
      options={{tabBarLabel:'Trang chủ',
        tabBarIcon:({colors,focused})=> 
        <Ionicons name="home" size={24} color={focused ? "#4EAF4E" : "gray"}/>
      }}
       />
      <Tabs.Screen name='favorite' 
      options={{tabBarLabel:'Yêu thích',
        tabBarIcon:({color,focused})=>
          <Ionicons name="heart" size={24} color={focused ? "#4EAF4E" : "gray"} />
      }}/>
      <Tabs.Screen name='cart'
      options={{tabBarLabel:'Giỏ hàng',
        tabBarIcon:({colors,focused})=> 
        <Ionicons name="cart" size={24} color={focused ? "#4EAF4E" : "gray"}/>
      }}
       />
      <Tabs.Screen name='profile'
      options={{tabBarLabel:'Tài khoản',
        tabBarIcon:({color,focused})=> 
          <Ionicons name="person-sharp" size={24} color={focused ? "#4EAF4E" : "gray"} />
      }} />
    </Tabs>
  );
}
