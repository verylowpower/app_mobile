const API_BASE_URL = 'http://192.168.2.4:9056/product-service/api';

const productService = {
    _fetch: async (url, options = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorBody;
                try {
                    errorBody = await response.json();
                } catch (jsonError) {
                    errorBody = { message: `HTTP error! Status: ${response.status}` };
                }
                throw new Error(JSON.stringify(errorBody));
            }
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    },

    getAllProducts: async () => {
        try {
            return await productService._fetch(`${API_BASE_URL}/products/listProduct`);
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw error;
        }
    },
    
    getCategoryCounts: async () => {
        try {
            return await productService._fetch(`${API_BASE_URL}/categories/count`);
        } catch (error) {
            console.error("Error fetching category counts:", error);
            throw error;
        }
    },

    getNewProducts: async () => {
        try {
             return await productService._fetch(`${API_BASE_URL}/products/listNew`);
        } catch (error) {
            console.error("Error fetching new products:", error);
            throw error;
        }
    },

    getFeaturedProducts: async () => {
        try {
           return await productService._fetch(`${API_BASE_URL}/products/listFeatured`);
        } catch (error) {
            console.error("Error fetching featured products:", error);
             throw error;
        }
    },

    getBestsellerProducts: async () => {
         try {
           return await productService._fetch(`${API_BASE_URL}/products/listBestseller`);
        } catch (error) {
           console.error("Error fetching bestseller products:", error);
            throw error;
        }
    },

    getProductDetails: async (id) => {
        try {
            return await productService._fetch(`${API_BASE_URL}/products/${id}`);
        } catch (error) {
            console.error(`Error fetching product details for ID ${id}:`, error);
            throw error;
        }
    },
    
    getProductQuantity: async (id) => {
        try {
            return await productService._fetch(`${API_BASE_URL}/products/${id}/quantity`);
        } catch (error) {
             console.error(`Error fetching product quantity for ID ${id}:`, error);
             throw error;
        }
    },
     
    getProductsByCategoryId: async (categoryId) => {
        try {
            return await productService._fetch(`${API_BASE_URL}/products/by-categoryId?categoryId=${categoryId}`);
        } catch (error) {
            console.error(`Error fetching products by category ID ${categoryId}:`, error);
            throw error;
        }
    },

     getProductsByCategoryName: async (categoryName) => {
        try {
            return await productService._fetch(`${API_BASE_URL}/products/by-categoryName?categoryName=${categoryName}`);
        } catch (error) {
            console.error(`Error fetching products by category name ${categoryName}`, error);
             throw error;
        }
    },
    
    getPaginatedProducts: async (page, size) => {
         try {
            return await productService._fetch(`${API_BASE_URL}/products/listProductPage?page=${page}&size=${size}`);
         } catch (error) {
             console.error(`Error fetching paginated products (page: ${page}, size: ${size}):`, error);
             throw error;
         }
    },

    getPaginatedProductsByCategoryId: async (categoryId, page, size) => {
        try {
            return await productService._fetch(`${API_BASE_URL}/products/by-category-page?categoryId=${categoryId}&page=${page}&size=${size}`);
        } catch (error) {
           console.error(`Error fetching paginated products by category ID ${categoryId} (page: ${page}, size: ${size}):`, error);
           throw error;
        }
    }
};

export default productService;