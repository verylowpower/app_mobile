import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import ProductList from '../product/productList'; // Ensure correct path

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.95;
const ITEM_HEIGHT = ITEM_WIDTH * 0.5;

const banners = [
    { id: '1', image: 'https://via.placeholder.com/300x150' },
    { id: '2', image: 'https://via.placeholder.com/300x150' },
    { id: '3', image: 'https://via.placeholder.com/300x150' },
];

const Home = () => {
    const [bannerIndex, setBannerIndex] = useState(0);
    const bannerListRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); // For future implementation

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000);
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

    const handleSearch = (text) => {
        setSearchText(text);
        // Implement product filtering logic if needed
    };

    const renderBanner = ({ item }) => (
        <Image source={{ uri: item.image }} style={styles.banner} />
    );

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={require('./../../assets/images/logo.jpg')}
                            style={styles.logo}
                        />
                        <TextInput
                            placeholder="Search products..."
                            style={styles.searchInput}
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                    </View>
                    {/* Banner */}
                    <FlatList
                        ref={bannerListRef}
                        data={banners}
                        renderItem={renderBanner}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        contentContainerStyle={styles.bannerList}
                        getItemLayout={(data, index) => ({
                            length: ITEM_WIDTH,
                            offset: ITEM_WIDTH * index,
                            index,
                        })}
                        onScrollToIndexFailed={(info) => {
                            setTimeout(() => {
                                bannerListRef.current?.scrollToIndex({
                                    index: info.index,
                                    animated: true,
                                });
                            }, 500);
                        }}
                    />
                </>
            }
            data={Array(1)} // Placeholder to add product list
            renderItem={() => <ProductList searchText={searchText} />}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        height: 40,
        backgroundColor: '#f9f9f9',
    },
    bannerList: {
        marginVertical: 20,
        alignItems: 'center',
    },
    banner: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        marginHorizontal: 10,
        backgroundColor: '#f0f0f0',
    },
});

export default Home;
