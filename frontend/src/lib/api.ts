import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/authStore';

let apiClient: AxiosInstance | null = null;

const getApiClient = (): AxiosInstance => {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 10000,
    });

    // JWT interceptor
    apiClient.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  return apiClient;
};

const api = {
  // Auth
  register: (email: string, password: string, fullName: string, phoneNumber?: string) =>
    getApiClient().post('/api/auth/register', { email, password, fullName, phoneNumber }),
  login: (email: string, password: string) =>
    getApiClient().post('/api/auth/login', { email, password }),

  // Products
  getProducts: () => getApiClient().get('/api/products'),
  getProductsByGame: (gameName: string) =>
    getApiClient().get(`/api/products/${gameName}`),
  createProduct: (gameName: string, denomination: string, price: number, description?: string) =>
    getApiClient().post('/api/products', { gameName, denomination, price, description }),
  updateProduct: (productId: string, gameName: string, denomination: string, price: number, description?: string, active?: boolean) =>
    getApiClient().put(`/api/products/${productId}`, { gameName, denomination, price, description, active }),
  deleteProduct: (productId: string) =>
    getApiClient().delete(`/api/products/${productId}`),

  // Orders
  createOrder: (products: any[], paymentMethod: string, accountInfo?: string) =>
    getApiClient().post('/api/orders', { products, paymentMethod, accountInfo }),
  getOrders: () => getApiClient().get('/api/orders'),
  getOrderById: (orderId: string) =>
    getApiClient().get(`/api/orders/${orderId}`),

  // Payments
  generateMandiriQR: (orderId: string, amount: number) =>
    getApiClient().post('/api/payments/mandiri-qr', { orderId, amount }),
  confirmPayment: (orderId: string, paymentProof?: string) =>
    getApiClient().post('/api/payments/confirm', { orderId, paymentProof }),
  checkPaymentStatus: (orderId: string) =>
    getApiClient().get(`/api/payments/status/${orderId}`),

  // Wallet
  getWallet: () => getApiClient().get('/api/wallet'),
  getWalletTransactions: () =>
    getApiClient().get('/api/wallet/transactions'),
  topUpWallet: (amount: number, paymentMethod: string) =>
    getApiClient().post('/api/wallet/topup', { amount, paymentMethod }),
  useWallet: (orderId: string, amount: number) =>
    getApiClient().post('/api/wallet/use', { orderId, amount }),

  // Admin
  getAllOrders: () => getApiClient().get('/api/admin/orders'),
  updateOrderStatus: (orderId: string, status: string) =>
    getApiClient().put(`/api/admin/orders/${orderId}`, { status }),
  getStats: () => getApiClient().get('/api/admin/stats'),

  // Analytics
  getAnalyticsOverview: () => getApiClient().get('/api/analytics/overview'),
  getDailySales: () => getApiClient().get('/api/analytics/daily-sales'),
  getSalesByGame: () => getApiClient().get('/api/analytics/sales-by-game'),
  getOrderStatus: () => getApiClient().get('/api/analytics/order-status'),
  getPaymentMethods: () => getApiClient().get('/api/analytics/payment-methods'),
  getTopProducts: () => getApiClient().get('/api/analytics/top-products'),
};

export { getApiClient };
export default api;
