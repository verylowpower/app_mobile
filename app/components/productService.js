const API_BASE_URL = 'http://192.168.210.165:9056/product-service/api';

const productService = {
    // Helper function for fetch requests
    _fetch: async (url, options = {}) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const message = `HTTP error! Status: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    throw new Error(`${message} - Details: ${JSON.stringify(errorBody)}`);
                } catch (jsonError) {
                    throw new Error(message);
                }
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    },

    // 1.1. API liệt kê tên thể loại và đếm số sản phẩm của từng thể loại
    getCategoriesWithProductCount: async () => {
        return await productService._fetch(`${API_BASE_URL}/categories/count`);
    },

    // 1.2. API Lấy list sản phẩm theo xếp loại mới, đặc sắc, bán chạy
    getNewProducts: async () => {
        return await productService._fetch(`${API_BASE_URL}/products/listNew`);
    },
    getFeaturedProducts: async () => {
        return await productService._fetch(`${API_BASE_URL}/products/listFeatured`);
    },
    getBestsellerProducts: async () => {
        return await productService._fetch(`${API_BASE_URL}/products/listBestseller`);
    },

    // 1.3. API Lấy chi tiết sản phẩm dựa vào id (list hình ảnh)
    getProductDetails: async (productId) => {
        try {
            const product = await productService._fetch(`${API_BASE_URL}/products/${productId}`);
             return product;
        } catch (error) {
            console.error(`Error fetching product details for ID ${productId}:`, error);
            throw error;
        }
    },

    // 1.4. API kiểm tra tình trạng sản phẩm còn hàng không
    getProductQuantity: async (productId) => {
        return await productService._fetch(`${API_BASE_URL}/products/${productId}/quantity`);
    },

   // 1.5. API lấy danh sách sản phầm all
     getAllProducts: async () => {
        try {
           const products = await productService._fetch(`${API_BASE_URL}/products/listProduct`);
            return products;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw error;
        }
    },


    // 1.6. API lấy list sản phẩm theo id category
    getProductsByCategoryId: async (categoryId) => {
        return await productService._fetch(`${API_BASE_URL}/products/by-categoryId?categoryId=${categoryId}`);
    },

    // 1.7. API lấy list sản phẩm theo categoryName
    getProductsByCategoryName: async (categoryName) => {
        return await productService._fetch(`${API_BASE_URL}/products/by-categoryName?categoryName=${categoryName}`);
    },

  // 1.8. API lấy list sản phẩm ALL (có phân trang)
     getAllProductsPage: async (page = 0, size = 12) => {
        try {
           const products = await productService._fetch(`${API_BASE_URL}/products/listProductPage?page=${page}&size=${size}`);
            return products;
        } catch (error) {
            console.error("Error fetching paginated products:", error);
            throw error;
        }
    },
    // 1.9. API lấy list sản phẩm theo id category (có phân trang)
    getProductsByCategoryIdPage: async (categoryId, page = 0, size = 12) => {
         try {
           const products = await productService._fetch(`${API_BASE_URL}/products/by-category-page?categoryId=${categoryId}&page=${page}&size=${size}`);
            return products;
        } catch (error) {
            console.error("Error fetching paginated products by category:", error);
            throw error;
        }
    },
};

export default productService;