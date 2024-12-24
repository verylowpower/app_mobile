import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


export default function cart() {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:20,fontFamily:'outfit-bold'}}>Cart</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff", // Nền trắng
    },
    text: {
      fontSize: 20,
      fontFamily: "outfit",
    },
  });