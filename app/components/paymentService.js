const API_BASE_URL_ORDER = 'http://192.168.2.4:9056/order-service/api';
const API_BASE_URL_SHIPPING = 'http://192.168.2.4:9056/shipping-service/api';
const API_BASE_URL_PAYMENT = 'http://192.168.2.4:9056/payment-service/api';

const paymentService = {
    _fetch: async (url, options = {}, expectJson = true) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

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
             return expectJson ? await response.json() : await response.text();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    },
    createOrder: async (orderData) => {
        try {
            const response = await paymentService._fetch(`${API_BASE_URL_ORDER}/orders/create`, {
                method: 'POST',
                body: JSON.stringify(orderData),
            });

            const orderId = parseInt(response, 10);
            if (isNaN(orderId)) {
                throw new Error("Phản hồi từ API không hợp lệ");
            }
            return orderId;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    addShipping: async (shippingData) => {
        try {
          // Gọi _fetch với expectJson = false để nhận text response
          const response = await paymentService._fetch(`${API_BASE_URL_SHIPPING}/shippings/add`, {
            method: 'POST',
            body: JSON.stringify(shippingData),
          }, false);
            
            // Kiểm tra phản hồi có chứa "Order items added successfully!" hay không
            if (response.includes("Order items added successfully!")) {
                return { success: true, message: response }; // Trả về thành công
            } else{
               throw new Error(`Lỗi từ server: ${response}`);
            }
        } catch (error) {
            console.error("Error adding shipping:", error);
            throw error;
        }
    },

    createCodPayment: async (orderId) => {
        try {
            // Tạo PaymentRequest object
            const paymentRequest = {
              orderId: orderId?.toString(), // Sử dụng orderId từ param và chuyển về string. Kiểm tra null
              isPayed: false,    // Mặc định là chưa thanh toán
                // Các thuộc tính khác nếu cần thiết
            };
            
             // Gọi _fetch với expectJson = false để nhận text response
            const response =  await paymentService._fetch(`${API_BASE_URL_PAYMENT}/payments/createCod`, {
                method: 'POST',
                body: JSON.stringify(paymentRequest),
            }, false);
            
          // Kiểm tra phản hồi có chứa "Payment created successfully" hay không
             if (response.includes("Payment created successfully")) {
                return { success: true, message: response }; // Trả về thành công
            } else{
                throw new Error(`Lỗi từ server: ${response}`);
            }
        } catch (error) {
            console.error("Error creating COD payment:", error);
            throw error;
        }
    },
};

export default paymentService;