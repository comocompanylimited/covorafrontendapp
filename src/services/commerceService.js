import { isApiConfigured } from '../api';
import {
  fetchCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  fetchWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  fetchOrders as apiGetOrders,
  fetchOrderById as apiGetOrder,
  createOrder as apiCreateOrder,
  fetchProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
  fetchAddresses as apiGetAddresses,
  createAddress as apiCreateAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
} from '../api';

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const syncCartToApi = async (cartItems) => {
  if (!isApiConfigured()) return null;
  try {
    const cart = await apiGetCart();
    return cart;
  } catch {
    return null;
  }
};

export const apiAddCartItem = async (product, opts = {}) => {
  if (!isApiConfigured()) return null;
  try {
    return await apiAddToCart({
      product_id: product.id,
      quantity: opts.quantity || 1,
      size: opts.selectedSize || null,
      color: opts.selectedColor || null,
    });
  } catch {
    return null;
  }
};

export const apiUpdateCartItemQty = async (cartItemId, quantity) => {
  if (!isApiConfigured()) return null;
  try {
    return await apiUpdateCartItem(cartItemId, { quantity });
  } catch {
    return null;
  }
};

export const apiRemoveCartItemById = async (cartItemId) => {
  if (!isApiConfigured()) return null;
  try {
    return await apiRemoveCartItem(cartItemId);
  } catch {
    return null;
  }
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const apiAddWishlistItem = async (productId) => {
  if (!isApiConfigured()) return null;
  try {
    return await apiAddToWishlist(productId);
  } catch {
    return null;
  }
};

export const apiRemoveWishlistItem = async (productId) => {
  if (!isApiConfigured()) return null;
  try {
    return await apiRemoveFromWishlist(productId);
  } catch {
    return null;
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const buildOrderPayload = (cartItems, checkoutState, user) => {
  const {
    checkoutAddress,
    checkoutDelivery,
    checkoutPayment,
    checkoutPromo,
    checkoutPromoApplied,
  } = checkoutState;

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = checkoutDelivery?.price || 0;
  const discount = checkoutPromoApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  return {
    items: cartItems.map(item => ({
      product_id: item.id,
      product_name: item.name,
      sku: item.sku || item.id,
      price: item.price,
      quantity: item.quantity,
      size: item.selectedSize || null,
      color: item.selectedColor || null,
      image: item.image || null,
    })),
    shipping_address: checkoutAddress ? {
      full_name: checkoutAddress.fullName,
      line1: checkoutAddress.line1,
      line2: checkoutAddress.line2 || '',
      city: checkoutAddress.city,
      postcode: checkoutAddress.postcode,
      country: checkoutAddress.country,
      phone: checkoutAddress.phone || '',
    } : null,
    delivery_method: checkoutDelivery ? {
      id: checkoutDelivery.id,
      name: checkoutDelivery.name,
      price: checkoutDelivery.price,
    } : null,
    payment_method: checkoutPayment ? {
      id: checkoutPayment.id,
      type: checkoutPayment.type,
      last4: checkoutPayment.last4 || null,
    } : null,
    promo_code: checkoutPromoApplied ? checkoutPromo : null,
    subtotal,
    shipping: shippingCost,
    discount,
    total,
    currency: 'GBP',
    customer_email: user?.email || null,
    customer_name: user?.name || null,
  };
};

export const submitOrder = async (cartItems, checkoutState, user) => {
  const payload = buildOrderPayload(cartItems, checkoutState, user);

  if (!isApiConfigured()) {
    return {
      ok: true,
      local: true,
      order: {
        ...payload,
        id: `COV-${Date.now().toString().slice(-4)}`,
        number: `COV-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Processing',
        statusStep: 0,
        trackingNumber: null,
        estimatedDelivery: checkoutState.checkoutDelivery?.desc || '3-5 business days',
        address: checkoutState.checkoutAddress,
        delivery: checkoutState.checkoutDelivery,
        payment: checkoutState.checkoutPayment,
        promoCode: checkoutState.checkoutPromoApplied ? checkoutState.checkoutPromo : null,
        discount: payload.discount,
        subtotal: payload.subtotal,
        shipping: payload.shipping,
        tax: 0,
        items: cartItems,
      },
    };
  }

  try {
    const res = await apiCreateOrder(payload);
    return { ok: true, local: false, order: res };
  } catch (err) {
    return {
      ok: true,
      local: true,
      order: {
        ...payload,
        id: `COV-${Date.now().toString().slice(-4)}`,
        number: `COV-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Processing',
        statusStep: 0,
        trackingNumber: null,
        estimatedDelivery: checkoutState.checkoutDelivery?.desc || '3-5 business days',
        address: checkoutState.checkoutAddress,
        delivery: checkoutState.checkoutDelivery,
        payment: checkoutState.checkoutPayment,
        promoCode: checkoutState.checkoutPromoApplied ? checkoutState.checkoutPromo : null,
        discount: payload.discount,
        subtotal: payload.subtotal,
        shipping: payload.shipping,
        tax: 0,
        items: cartItems,
      },
    };
  }
};

export const fetchOrderHistory = async (localOrders = []) => {
  if (!isApiConfigured()) return localOrders;
  try {
    const res = await apiGetOrders();
    const apiOrders = Array.isArray(res) ? res : (res?.results || res?.orders || []);
    return apiOrders.length ? apiOrders : localOrders;
  } catch {
    return localOrders;
  }
};

export const fetchOrderDetails = async (orderId, localOrders = []) => {
  if (!isApiConfigured()) {
    return localOrders.find(o => o.id === orderId || o.number === orderId) || null;
  }
  try {
    return await apiGetOrder(orderId);
  } catch {
    return localOrders.find(o => o.id === orderId || o.number === orderId) || null;
  }
};

// ─── Account / Profile ────────────────────────────────────────────────────────

export const fetchAccountProfile = async (localUser = null) => {
  if (!isApiConfigured()) return localUser;
  try {
    return await apiGetProfile();
  } catch {
    return localUser;
  }
};

export const saveAccountProfile = async (data, localFallback) => {
  if (!isApiConfigured()) return { ok: true, data: { ...localFallback, ...data } };
  try {
    const res = await apiUpdateProfile(data);
    return { ok: true, data: res };
  } catch (err) {
    return { ok: true, data: { ...localFallback, ...data } };
  }
};

export const fetchSavedAddresses = async (localAddresses = []) => {
  if (!isApiConfigured()) return localAddresses;
  try {
    const res = await apiGetAddresses();
    const list = Array.isArray(res) ? res : (res?.results || []);
    return list.length ? list : localAddresses;
  } catch {
    return localAddresses;
  }
};
