import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
//import { Colors } from 'react-native/Libraries/NewAppScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../app-example/constants/Colors'

export default function TabLayout() {
  return (
    <Tabs screenOptions ={{
      headerShown:false,
      tabBarActiveTintColor:Colors.PRIMARY
    }}>
        <Tabs.Screen name='home'
        options={{
          tabBarLabel:'Home',
          tabBarIcon:({color})=><Ionicons name="home" 
          size={24} color={color} />
        }}
        />
        <Tabs.Screen name='login'
        options={{
          tabBarLabel:'Login',
          tabBarIcon:({color})=><Ionicons name="log-in" 
          size={24} color={color} />
        }}/>
        <Tabs.Screen name='register'
        options={{
          tabBarLabel:'Register',
          tabBarIcon:({color})=><Ionicons name="log-in-outline" 
          size={24} color={color} />
        }}/>
        <Tabs.Screen name='explore'
        options={{
          tabBarLabel:'Miss',
          tabBarIcon:({color})=><Ionicons name="alert" 
          size={24} color={color} />
        }}/>
        
    </Tabs>
    
  )
}