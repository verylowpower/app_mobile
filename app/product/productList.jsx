import React, { useState, useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProductList = ({ searchText }) => {
    const router = useRouter();
    const [products, setProducts] = useState([
        {
            id: "1",
            name: "Fresh Mango",
            image: "https://via.placeholder.com/200",
            price: "5000",
            oldPrice: "60000",
            description: "Delicious and juicy mangoes",
            tags: ["Trái cây"],
        },
        {
            id: "2",
            name: "Red Apple",
            image: "https://via.placeholder.com/200",
            price: "40000",
            oldPrice: "5000",
            description: "Fresh and crunchy apples",
            tags: ["Trái cây"],
        },
        {
            id: "3",
            name: "Carrot",
            image: "https://via.placeholder.com/200",
            price: "40000",
            oldPrice: "50000",
            description: "This is a carrot",
            tags: ["Củ quả"],
        },
        {
            id: "4",
            name: "Spinach",
            image: "https://via.placeholder.com/200",
            price: "40000",
            oldPrice: "50000",
            description: "This is a Spinach",
            tags: ["Rau"],
        },
        {
            id: "5",
            name: "Tomato",
            image: "https://via.placeholder.com/200",
            price: "40000",
            oldPrice: "50000",
            description: "This is a tomato",
            tags: ["Củ quả"],
        },
        {
            id: "6",
            name: "Lettuce",
            image: "https://via.placeholder.com/200",
            price: "40000",
            oldPrice: "50000",
            description: "This is a Lettuce",
            tags: ["Rau"],
        },
        {
             id: "7",
             name: "Banana",
             image: "https://via.placeholder.com/200",
            price: "40000",
            oldPrice: "50000",
             description: "This is a banana",
            tags: ["Trái cây"],
       },
        {
            id: "8",
           name: "Potato",
            image: "https://via.placeholder.com/200",
            price: "40000",
             oldPrice: "50000",
           description: "This is a potato",
           tags: ["Củ quả"],
        },
         {
            id: "9",
            name: "Cabbage",
            image: "https://via.placeholder.com/200",
           price: "40000",
           oldPrice: "50000",
             description: "This is a cabbage",
            tags: ["Rau"],
        },
    ]);
      const [filteredProducts, setFilteredProducts] = useState(products);
      const [activeTag, setActiveTag] = useState(null);

     useEffect(() => {
         let filtered = [...products];

        if (searchText) {
             filtered = filtered.filter(product =>
                  product.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (activeTag) {
            filtered = filtered.filter(product => product.tags.includes(activeTag));
        }

           setFilteredProducts(filtered);

    }, [searchText, products, activeTag]);



    const handlePress = (product) => {
      const productWithNumberPrice = { ...product, price: Number(product.price) };
        router.push({
          pathname: "productInfo",
          params: {
              ...productWithNumberPrice,
              price: String(productWithNumberPrice.price),
              description: product.description, // Thêm description ở đây
          }
      });
  };

     const handleTagFilter = (tag) => {
         setActiveTag(prevTag => prevTag === tag ? null : tag); // Toggle tag
     };


    const renderProductItem = ({ item }) => {
        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => handlePress(item)}
                style={styles.productItemContainer}
            >
                <View style={styles.productItem}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        onError={() => {
                            console.warn("Error loading image for product:", item.name);
                        }}
                    />
                     <Text style={styles.productName}>{item.name}</Text>
                     <Text style={styles.productPrice}>{item.price} đ/Kg</Text>
                </View>
            </TouchableOpacity>
        );
    };
    const renderTagButton = (tag) => (
        <TouchableOpacity
            key={tag}
            onPress={() => handleTagFilter(tag)}
            style={[styles.tagButton, activeTag === tag ? styles.activeTagButton : {}]}
        >
            <Text style={styles.tagText}>{tag}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.tagFilterContainer}>
                {renderTagButton('Rau')}
                {renderTagButton('Trái cây')}
                {renderTagButton('Củ quả')}

                 <TouchableOpacity style={styles.clearButton} onPress={()=> handleTagFilter(null)}>
                   <Ionicons name="close-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        <FlatList
             data={filteredProducts}
            numColumns={3}
            keyExtractor={(item) => item.id}
             contentContainerStyle={styles.container}
            renderItem={renderProductItem}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        justifyContent: "center",
    },
    productItemContainer: {
        flex: 1 / 3, // Ensures 3 items per row
        padding: 8,
    },
    productItem: {
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productImage: {
        width: "100%",
        aspectRatio: 1, // Ensures square images
        borderRadius: 8,
        marginBottom: 8,
    },
     productName: {
        fontSize: 16,
         textAlign: "center",
    },
    productPrice: {
        fontSize: 14,
         color: "gray",
          textAlign: "center",
    },
    tagFilterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
         flexWrap:'wrap',
    },
    tagButton: {
        backgroundColor: '#e0e0e0',
        padding: 8,
        borderRadius: 5,
        marginRight: 5,
       marginBottom:5,
    },
    activeTagButton: {
        backgroundColor: '#a0a0a0',
    },
    tagText: {
        fontSize: 14,
    },
    clearButton : {
        alignSelf: 'center',
          marginLeft:'auto'
    }
});


export default ProductList;