import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import ProductList from '../product/productList'; // Đảm bảo đường dẫn đúng
import logo from '../../assets/images/logo.jpg'; // Import logo trực tiếp

const { width } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(width * 0.95); // Làm tròn để đảm bảo đồng nhất
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 0.5);

const banners = [
    { id: '1', image: require('../../assets/images/bannerr.jpg') },
    { id: '2', image: require('../../assets/images/single-banner.jpg') },
    { id: '3', image: require('../../assets/images/newsletter.jpg') },
];

const Home = () => {
    const [bannerIndex, setBannerIndex] = useState(0);
    const bannerListRef = useRef(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (bannerListRef.current && banners[bannerIndex]) {
            bannerListRef.current.scrollToIndex({
                index: bannerIndex,
                animated: true,
            });
        }
    }, [bannerIndex]);

    const handleSearch = (text) => {
        setSearchText(text);
        // Thêm logic lọc sản phẩm tại đây nếu cần
    };

    const renderBanner = ({ item }) => (
        <Image source={item.image} style={styles.banner} />
    );

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image source={logo} style={styles.logo} />
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
            data={Array(1)} // Dữ liệu placeholder để hiển thị danh sách sản phẩm
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
        justifyContent: 'center', // Đảm bảo căn giữa banner
    },
    banner: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        marginHorizontal: 12,
        resizeMode: 'cover', // Hiển thị đầy đủ hình ảnh
    },
});

export default Home;
