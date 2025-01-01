// d:\dev\app_mobile\app\components\orderService.js
// orderService.js
const API_BASE_URL = 'http://192.168.2.4:9056/order-service/api'; // Thay đổi URL cho order-service

const orderService = {
    _fetch: async (url, options = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout sau 10 giây

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
            // Check if the response has a body
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
              // Handle the non-JSON case, maybe returning text or null
              return  response.text();
            }
           
        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    },

    /**
    * Thêm sản phẩm vào giỏ hàng.
    * @param {string} userId - ID của người dùng.
    * @param {object} itemData - Dữ liệu của sản phẩm cần thêm vào (ví dụ: { productId: 123, quantity: 2 }).
    * @returns {Promise} - Promise chứa kết quả của API.
    */
    addItemToCart: async (userId, itemData) => {
        try {
             return await orderService._fetch(`${API_BASE_URL}/cart/add-item/${userId}`, {
                method: 'POST',
                body: JSON.stringify(itemData),
            });
        } catch (error) {
            console.error("Error adding item to cart:", error);
             throw error;
        }
    },

    /**
     * Lấy danh sách sản phẩm trong giỏ hàng dựa trên userId.
     * @param {string} userId - ID của người dùng.
     * @returns {Promise} - Promise chứa kết quả của API.
     */
    getCartItems: async (userId) => {
        try {
            return await orderService._fetch(`${API_BASE_URL}/cart/${userId}`);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            throw error;
        }
    },

     /**
     * Xóa sản phẩm khỏi giỏ hàng.
     * @param {string} userId - ID của người dùng.
     * @param {string} productId - ID của sản phẩm cần xóa.
     * @returns {Promise} - Promise chứa kết quả của API.
     */
    removeItemFromCart: async (userId, productId) => {
         try {
             return await orderService._fetch(
                `${API_BASE_URL}/cart/remove?userId=${userId}&productId=${productId}`,
                {
                    method: 'DELETE',
                }
            );
        } catch (error) {
            console.error("Error removing item from cart:", error);
             throw error;
        }
    },
};

export default orderService;