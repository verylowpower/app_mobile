import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function PurchaseHistory() {
  // Danh sách lịch sử mua hàng mẫu
  const purchaseData = [
    { id: '1', item: 'Áo Thun', date: '2024-12-10', price: '250,000 VND' },
    { id: '2', item: 'Quần Jean', date: '2024-12-05', price: '500,000 VND' },
    { id: '3', item: 'Giày Thể Thao', date: '2024-11-30', price: '1,200,000 VND' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.item}</Text>
      <Text style={styles.itemDetails}>Ngày: {item.date}</Text>
      <Text style={styles.itemDetails}>Giá: {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Sử Mua Hàng</Text>
      <FlatList
        data={purchaseData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4EAF4E',
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
  },
});
