import { apiGet, apiPost, apiPut, apiDelete } from './client';

// Cart
export const fetchCart = async (sessionId) =>
  apiGet('/cart', sessionId ? { session_id: sessionId } : {});

export const addToCart = async (payload) =>
  apiPost('/cart/items', payload);

export const updateCartItem = async (itemId, payload) =>
  apiPut(`/cart/items/${itemId}`, payload);

export const removeCartItem = async (itemId) =>
  apiDelete(`/cart/items/${itemId}`);

export const clearCart = async () =>
  apiDelete('/cart');

// Wishlist
export const fetchWishlist = async () =>
  apiGet('/wishlist');

export const addToWishlist = async (productId) =>
  apiPost('/wishlist/items', { product_id: productId });

export const removeFromWishlist = async (productId) =>
  apiDelete(`/wishlist/items/${productId}`);

// Orders
export const fetchOrders = async (params = {}) =>
  apiGet('/orders', params);

export const fetchOrderById = async (orderId) =>
  apiGet(`/orders/${orderId}`);

export const createOrder = async (payload) =>
  apiPost('/orders', payload);

// Account
export const fetchProfile = async () =>
  apiGet('/customers/me');

export const updateProfile = async (payload) =>
  apiPut('/customers/me', payload);

export const fetchAddresses = async () =>
  apiGet('/customers/me/addresses');

export const createAddress = async (payload) =>
  apiPost('/customers/me/addresses', payload);

export const updateAddress = async (id, payload) =>
  apiPut(`/customers/me/addresses/${id}`, payload);

export const deleteAddress = async (id) =>
  apiDelete(`/customers/me/addresses/${id}`);

export const fetchPaymentMethods = async () =>
  apiGet('/customers/me/payment-methods');
