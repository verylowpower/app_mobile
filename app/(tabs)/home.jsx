import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, FlatList, StyleSheet, Dimensions, bannerRef } from 'react-native';
import ProductList from '../product/productList'; // Ensure correct path

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.95;
const ITEM_HEIGHT = ITEM_WIDTH * 0.5;

const banners = [
    { id: '1', image: 'https://via.placeholder.com/300x150' },
    { id: '2', image: 'https://via.placeholder.com/200x150' },
    { id: '3', image: 'https://via.placeholder.com/100x150' },
]

const Home = () => {
    const [bannerIndex, setBannerIndex] = useState(0);
    const bannerListRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (bannerListRef.current) {
            bannerListRef.current.scrollToIndex({
                index: bannerIndex,
                animated: true,
            });
        }
    }, [bannerIndex]);

    const renderBanner = ({ item }) => (
        <Image source={{ uri: item.image }} style={styles.banner} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <Image source={require('./../../assets/images/logo.jpg')} style={styles.logo} />
                            <TextInput placeholder="Search..." style={styles.searchInput} />
                        </View>
                        {/* Banner */}
                        <FlatList
                            ref={bannerRef}
                            data={banners}
                            renderItem={renderBanner}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.bannerList}
                            pagingEnabled
                        />
                    </>
                }
                />
               <ProductList/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 70,
        height: 120,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    bannerList: {
        marginBottom: 20,
    },
    banner: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 4,
        marginHorizontal: 10,
    },
});

export default Home;