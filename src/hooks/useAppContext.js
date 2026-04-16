import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  // Auth
  user: null,
  isAuthenticated: false,
  authUsers: [
    {
      id: 'usr_1',
      email: 'sophia@example.com',
      password: 'Password1',
      firstName: 'Sophia',
      lastName: 'Williams',
      phone: '+44 7700 900123',
      name: 'Sophia Williams',
    },
  ],

  // Wishlist
  wishlist: [],

  // Cart
  cart: [],

  // Orders
  orders: [
    {
      id: 'COV-2891',
      number: 'COV-2891',
      date: '15 March 2025',
      status: 'Delivered',
      statusStep: 4,
      total: 674.0,
      items: [
        {
          id: 'p8',
          name: 'Strappy Heel Sandal',
          brand: 'VELOUR ATELIER',
          price: 385.0,
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
          selectedSize: '38',
          selectedColor: 'Black',
          quantity: 1,
        },
        {
          id: 'p16',
          name: 'Gold Vermeil Cuff Bracelet',
          brand: 'ARCADIA',
          price: 285.0,
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
          selectedSize: 'S/M',
          selectedColor: 'Gold Vermeil',
          quantity: 1,
        },
      ],
      address: {
        fullName: 'Sophia Williams',
        line1: '42 Mayfair Gardens',
        line2: 'Flat 3',
        city: 'London',
        postcode: 'W1K 4HF',
        country: 'United Kingdom',
        phone: '+44 7700 900123',
      },
      delivery: {
        id: 'standard',
        name: 'Standard Shipping',
        desc: '3-5 business days',
        price: 0,
      },
      payment: {
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiry: '09/27',
        cardHolder: 'Sophia Williams',
        nickname: 'Personal Visa',
      },
      promoCode: null,
      discount: 0,
      subtotal: 670.0,
      shipping: 0,
      tax: 4.0,
      estimatedDelivery: '3-5 business days',
      trackingNumber: 'TRK-883192',
    },
    {
      id: 'COV-2756',
      number: 'COV-2756',
      date: '28 February 2025',
      status: 'Delivered',
      statusStep: 4,
      total: 145.0,
      items: [
        {
          id: 'p17',
          name: 'Rose Gold Serum Elixir',
          brand: 'ECLAT BEAUTE',
          price: 145.0,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
          selectedSize: '50ml',
          selectedColor: 'Rose Gold',
          quantity: 1,
        },
      ],
      address: {
        fullName: 'Sophia Williams',
        line1: '42 Mayfair Gardens',
        line2: 'Flat 3',
        city: 'London',
        postcode: 'W1K 4HF',
        country: 'United Kingdom',
        phone: '+44 7700 900123',
      },
      delivery: {
        id: 'standard',
        name: 'Standard Shipping',
        desc: '3-5 business days',
        price: 0,
      },
      payment: {
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiry: '09/27',
        cardHolder: 'Sophia Williams',
        nickname: 'Personal Visa',
      },
      promoCode: null,
      discount: 0,
      subtotal: 145.0,
      shipping: 0,
      tax: 0,
      estimatedDelivery: '3-5 business days',
      trackingNumber: null,
    },
    {
      id: 'COV-3047',
      number: 'COV-3047',
      date: '10 April 2025',
      status: 'Shipped',
      statusStep: 2,
      total: 640.0,
      items: [
        {
          id: 'p4',
          name: 'Classic Cashmere Blazer',
          brand: 'MAISON ÉLITE',
          price: 595.0,
          image: 'https://images.unsplash.com/photo-1549062573-edc78a53ffa0?w=600&q=80',
          selectedSize: 'S',
          selectedColor: 'Black',
          quantity: 1,
        },
        {
          id: 'p6',
          name: 'Ribbed Cashmere Turtleneck',
          brand: 'ARCADIA',
          price: 45.0,
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
          selectedSize: 'S',
          selectedColor: 'Ivory',
          quantity: 1,
        },
      ],
      address: {
        fullName: 'Sophia Williams',
        line1: '42 Mayfair Gardens',
        line2: 'Flat 3',
        city: 'London',
        postcode: 'W1K 4HF',
        country: 'United Kingdom',
        phone: '+44 7700 900123',
      },
      delivery: {
        id: 'express',
        name: 'Express Shipping',
        desc: '1-2 business days',
        price: 7.99,
      },
      payment: {
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiry: '09/27',
        cardHolder: 'Sophia Williams',
        nickname: 'Personal Visa',
      },
      promoCode: null,
      discount: 0,
      subtotal: 640.0,
      shipping: 7.99,
      tax: 0,
      estimatedDelivery: '1-2 business days',
      trackingNumber: 'TRK-994021',
    },
    {
      id: 'COV-3112',
      number: 'COV-3112',
      date: '12 April 2025',
      status: 'Processing',
      statusStep: 0,
      total: 410.0,
      items: [
        {
          id: 'p11',
          name: 'Croc-Embossed Leather Tote',
          brand: 'ARCADIA',
          price: 845.0,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
          selectedSize: 'One Size',
          selectedColor: 'Black',
          quantity: 1,
        },
      ],
      address: {
        fullName: 'Sophia Williams',
        line1: '42 Mayfair Gardens',
        line2: 'Flat 3',
        city: 'London',
        postcode: 'W1K 4HF',
        country: 'United Kingdom',
        phone: '+44 7700 900123',
      },
      delivery: {
        id: 'standard',
        name: 'Standard Shipping',
        desc: '3-5 business days',
        price: 0,
      },
      payment: {
        type: 'card',
        brand: 'Mastercard',
        last4: '8512',
        expiry: '03/26',
        cardHolder: 'Sophia Williams',
        nickname: 'Travel Card',
      },
      promoCode: 'COVORA20',
      discount: 169.0,
      subtotal: 845.0,
      shipping: 0,
      tax: 0,
      estimatedDelivery: '3-5 business days',
      trackingNumber: null,
    },
  ],

  // Saved Addresses
  addresses: [
    {
      id: 'addr1',
      label: 'Home',
      fullName: 'Sophia Williams',
      line1: '42 Mayfair Gardens',
      line2: 'Flat 3',
      city: 'London',
      postcode: 'W1K 4HF',
      country: 'United Kingdom',
      phone: '+44 7700 900123',
      isDefault: true,
    },
    {
      id: 'addr2',
      label: 'Work',
      fullName: 'Sophia Williams',
      line1: '15 Chelsea Mews',
      line2: '',
      city: 'London',
      postcode: 'SW3 2NP',
      country: 'United Kingdom',
      phone: '+44 7700 900123',
      isDefault: false,
    },
  ],

  // Saved Payment Methods
  paymentMethods: [
    {
      id: 'pm1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '09/27',
      cardHolder: 'Sophia Williams',
      nickname: 'Personal Visa',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'card',
      brand: 'Mastercard',
      last4: '8512',
      expiry: '03/26',
      cardHolder: 'Sophia Williams',
      nickname: 'Travel Card',
      isDefault: false,
    },
  ],

  // Checkout temporary state
  checkoutAddress: null,
  checkoutDelivery: null,
  checkoutPayment: null,
  checkoutPromo: '',
  checkoutPromoApplied: false,

  // Notification preferences
  notifPrefs: {
    orderUpdates: true,
    orderShipped: true,
    orderDelivered: true,
    promotions: true,
    newArrivals: true,
    backInStock: true,
    priceDrops: false,
    accountUpdates: true,
    wishlistAlerts: true,
    recommendations: false,
    emailMarketing: true,
    pushNotifications: true,
  },

  // Style preferences
  stylePrefs: {
    favouriteCategories: ['Dresses', 'Bags', 'Jewellery'],
    savedSizes: { clothing: ['S'], shoes: ['38'] },
    beautyInterests: ['Skincare', 'Fragrance'],
    language: 'English',
    currency: 'GBP',
    theme: 'Classic',
  },

  // Recently viewed
  recentlyViewed: [],

  // Notifications
  notifications: [
    {
      id: 'n1',
      type: 'order',
      title: 'Order Dispatched',
      message: 'Your order #COV-2891 has been dispatched.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'n2',
      type: 'sale',
      title: 'Summer Sale Now Live',
      message: 'Enjoy up to 40% off on selected styles.',
      time: '1 day ago',
      read: false,
    },
    {
      id: 'n3',
      type: 'wishlist',
      title: 'Back in Stock',
      message: 'An item in your wishlist is back in stock.',
      time: '2 days ago',
      read: true,
    },
    {
      id: 'n4',
      type: 'arrivals',
      title: 'New Arrivals',
      message: 'The Spring/Summer collection is here. Explore now.',
      time: '3 days ago',
      read: true,
    },
  ],
};

const A = {
  // Auth
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',

  // Wishlist
  TOGGLE_WISHLIST: 'TOGGLE_WISHLIST',

  // Cart
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',

  // Orders
  PLACE_ORDER: 'PLACE_ORDER',

  // Addresses
  ADD_ADDRESS: 'ADD_ADDRESS',
  UPDATE_ADDRESS: 'UPDATE_ADDRESS',
  REMOVE_ADDRESS: 'REMOVE_ADDRESS',
  SET_DEFAULT_ADDRESS: 'SET_DEFAULT_ADDRESS',

  // Payment Methods
  ADD_PAYMENT: 'ADD_PAYMENT',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',
  REMOVE_PAYMENT: 'REMOVE_PAYMENT',
  SET_DEFAULT_PAYMENT: 'SET_DEFAULT_PAYMENT',

  // Checkout
  SET_CHECKOUT_ADDRESS: 'SET_CHECKOUT_ADDRESS',
  SET_CHECKOUT_DELIVERY: 'SET_CHECKOUT_DELIVERY',
  SET_CHECKOUT_PAYMENT: 'SET_CHECKOUT_PAYMENT',
  SET_CHECKOUT_PROMO: 'SET_CHECKOUT_PROMO',
  RESET_CHECKOUT: 'RESET_CHECKOUT',

  // Preferences
  UPDATE_NOTIF_PREFS: 'UPDATE_NOTIF_PREFS',
  UPDATE_STYLE_PREFS: 'UPDATE_STYLE_PREFS',

  // Recently Viewed
  ADD_RECENTLY_VIEWED: 'ADD_RECENTLY_VIEWED',

  // Notifications
  MARK_NOTIF_READ: 'MARK_NOTIF_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
};

const reducer = (state, action) => {
  switch (action.type) {
    // Auth
    case A.SIGN_IN:
      return { ...state, user: action.payload, isAuthenticated: true };

    case A.SIGN_UP: {
      const newUser = action.payload;
      const existing = state.authUsers.find(
        u => u.email.toLowerCase() === newUser.email.toLowerCase()
      );

      const authUsers = existing
        ? state.authUsers.map(u =>
            u.email.toLowerCase() === newUser.email.toLowerCase() ? { ...u, ...newUser } : u
          )
        : [...state.authUsers, newUser];

      return { ...state, authUsers, user: newUser, isAuthenticated: true };
    }

    case A.SIGN_OUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        checkoutAddress: null,
        checkoutDelivery: null,
        checkoutPayment: null,
      };

    case A.UPDATE_PROFILE: {
      if (!state.user) return state;
      const user = { ...state.user, ...action.payload };
      return {
        ...state,
        user,
        authUsers: state.authUsers.map(u =>
          u.id === user.id ? { ...u, ...action.payload } : u
        ),
      };
    }

    // Wishlist
    case A.TOGGLE_WISHLIST: {
      const exists = state.wishlist.find(i => i.id === action.payload.id);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter(i => i.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }

    // Cart
    case A.ADD_TO_CART: {
      const key = `${action.payload.id}-${action.payload.selectedSize}-${action.payload.selectedColor}`;
      const existing = state.cart.find(i => i.cartItemId === key);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.cartItemId === key
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, cartItemId: key, quantity: action.payload.quantity || 1 }],
      };
    }

    case A.REMOVE_FROM_CART:
      return { ...state, cart: state.cart.filter(i => i.cartItemId !== action.payload) };

    case A.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart
          .map(i =>
            i.cartItemId === action.payload.cartItemId
              ? { ...i, quantity: action.payload.quantity }
              : i
          )
          .filter(i => i.quantity > 0),
      };

    case A.CLEAR_CART:
      return { ...state, cart: [] };

    // Orders
    case A.PLACE_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
        checkoutAddress: null,
        checkoutDelivery: null,
        checkoutPayment: null,
        checkoutPromo: '',
        checkoutPromoApplied: false,
      };

    // Addresses
    case A.ADD_ADDRESS: {
      const withDefaults = action.payload.isDefault
        ? state.addresses.map(a => ({ ...a, isDefault: false }))
        : state.addresses;
      return { ...state, addresses: [...withDefaults, action.payload] };
    }

    case A.UPDATE_ADDRESS: {
      const withDefaults = action.payload.isDefault
        ? state.addresses.map(a => ({ ...a, isDefault: false }))
        : state.addresses;
      return {
        ...state,
        addresses: withDefaults.map(a => (a.id === action.payload.id ? action.payload : a)),
      };
    }

    case A.REMOVE_ADDRESS: {
      const next = state.addresses.filter(a => a.id !== action.payload);
      if (next.length > 0 && !next.some(a => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return { ...state, addresses: next };
    }

    case A.SET_DEFAULT_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.map(a => ({ ...a, isDefault: a.id === action.payload })),
      };

    // Payment Methods
    case A.ADD_PAYMENT: {
      const withDefaults = action.payload.isDefault
        ? state.paymentMethods.map(p => ({ ...p, isDefault: false }))
        : state.paymentMethods;
      return { ...state, paymentMethods: [...withDefaults, action.payload] };
    }

    case A.UPDATE_PAYMENT: {
      const withDefaults = action.payload.isDefault
        ? state.paymentMethods.map(p => ({ ...p, isDefault: false }))
        : state.paymentMethods;
      return {
        ...state,
        paymentMethods: withDefaults.map(p => (p.id === action.payload.id ? action.payload : p)),
      };
    }

    case A.REMOVE_PAYMENT: {
      const next = state.paymentMethods.filter(p => p.id !== action.payload);
      if (next.length > 0 && !next.some(p => p.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return { ...state, paymentMethods: next };
    }

    case A.SET_DEFAULT_PAYMENT:
      return {
        ...state,
        paymentMethods: state.paymentMethods.map(p => ({ ...p, isDefault: p.id === action.payload })),
      };

    // Checkout
    case A.SET_CHECKOUT_ADDRESS:
      return { ...state, checkoutAddress: action.payload };

    case A.SET_CHECKOUT_DELIVERY:
      return { ...state, checkoutDelivery: action.payload };

    case A.SET_CHECKOUT_PAYMENT:
      return { ...state, checkoutPayment: action.payload };

    case A.SET_CHECKOUT_PROMO:
      return {
        ...state,
        checkoutPromo: action.payload.code,
        checkoutPromoApplied: action.payload.applied,
      };

    case A.RESET_CHECKOUT:
      return {
        ...state,
        checkoutAddress: null,
        checkoutDelivery: null,
        checkoutPayment: null,
        checkoutPromo: '',
        checkoutPromoApplied: false,
      };

    // Preferences
    case A.UPDATE_NOTIF_PREFS:
      return { ...state, notifPrefs: { ...state.notifPrefs, ...action.payload } };

    case A.UPDATE_STYLE_PREFS:
      return { ...state, stylePrefs: { ...state.stylePrefs, ...action.payload } };

    // Recently Viewed
    case A.ADD_RECENTLY_VIEWED: {
      const filtered = state.recentlyViewed.filter(i => i.id !== action.payload.id);
      return { ...state, recentlyViewed: [action.payload, ...filtered].slice(0, 10) };
    }

    // Notifications
    case A.MARK_NOTIF_READ:
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case A.MARK_ALL_READ:
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };

    default:
      return state;
  }
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Derived
  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const wishlistCount = state.wishlist.length;
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const isInWishlist = id => state.wishlist.some(i => i.id === id);
  const isInCart = id => state.cart.some(i => i.id === id);

  const defaultAddress = state.addresses.find(a => a.isDefault) || state.addresses[0] || null;
  const defaultPayment = state.paymentMethods.find(p => p.isDefault) || state.paymentMethods[0] || null;

  // Auth
  const signIn = user => dispatch({ type: A.SIGN_IN, payload: user });

  const signInWithCredentials = (email, password) => {
    const found = state.authUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      return { ok: false, error: 'Incorrect email or password.' };
    }

    dispatch({ type: A.SIGN_IN, payload: found });
    return { ok: true, user: found };
  };

  const emailExists = email =>
    state.authUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase());

  const signUp = user => {
    const payload = {
      id: user.id || `usr_${Date.now()}`,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone || '',
      password: user.password,
    };
    dispatch({ type: A.SIGN_UP, payload });
  };

  const signOut = () => dispatch({ type: A.SIGN_OUT });
  const updateProfile = data => dispatch({ type: A.UPDATE_PROFILE, payload: data });

  // Wishlist
  const toggleWishlist = product => dispatch({ type: A.TOGGLE_WISHLIST, payload: product });

  // Cart
  const addToCart = (product, opts = {}) =>
    dispatch({ type: A.ADD_TO_CART, payload: { ...product, ...opts } });
  const removeFromCart = id => dispatch({ type: A.REMOVE_FROM_CART, payload: id });
  const updateCartQuantity = (id, qty) =>
    dispatch({ type: A.UPDATE_CART_QUANTITY, payload: { cartItemId: id, quantity: qty } });
  const clearCart = () => dispatch({ type: A.CLEAR_CART });

  // Orders
  const placeOrder = order => dispatch({ type: A.PLACE_ORDER, payload: order });

  // Addresses
  const addAddress = addr => dispatch({ type: A.ADD_ADDRESS, payload: addr });
  const updateAddress = addr => dispatch({ type: A.UPDATE_ADDRESS, payload: addr });
  const removeAddress = id => dispatch({ type: A.REMOVE_ADDRESS, payload: id });
  const setDefaultAddress = id => dispatch({ type: A.SET_DEFAULT_ADDRESS, payload: id });

  // Payments
  const addPayment = pm => dispatch({ type: A.ADD_PAYMENT, payload: pm });
  const updatePayment = pm => dispatch({ type: A.UPDATE_PAYMENT, payload: pm });
  const removePayment = id => dispatch({ type: A.REMOVE_PAYMENT, payload: id });
  const setDefaultPayment = id => dispatch({ type: A.SET_DEFAULT_PAYMENT, payload: id });

  // Checkout
  const setCheckoutAddress = addr => dispatch({ type: A.SET_CHECKOUT_ADDRESS, payload: addr });
  const setCheckoutDelivery = method => dispatch({ type: A.SET_CHECKOUT_DELIVERY, payload: method });
  const setCheckoutPayment = pm => dispatch({ type: A.SET_CHECKOUT_PAYMENT, payload: pm });
  const setCheckoutPromo = (code, applied) =>
    dispatch({ type: A.SET_CHECKOUT_PROMO, payload: { code, applied } });
  const resetCheckout = () => dispatch({ type: A.RESET_CHECKOUT });

  // Preferences
  const updateNotifPrefs = prefs => dispatch({ type: A.UPDATE_NOTIF_PREFS, payload: prefs });
  const updateStylePrefs = prefs => dispatch({ type: A.UPDATE_STYLE_PREFS, payload: prefs });

  // Recently Viewed / Notifications
  const addRecentlyViewed = p => dispatch({ type: A.ADD_RECENTLY_VIEWED, payload: p });
  const markNotificationRead = id => dispatch({ type: A.MARK_NOTIF_READ, payload: id });
  const markAllRead = () => dispatch({ type: A.MARK_ALL_READ });

  return (
    <AppContext.Provider
      value={{
        // State
        ...state,
        cartCount,
        cartTotal,
        wishlistCount,
        unreadNotifications,
        defaultAddress,
        defaultPayment,

        // Helpers
        isInWishlist,
        isInCart,

        // Auth
        signIn,
        signInWithCredentials,
        emailExists,
        signUp,
        signOut,
        updateProfile,

        // Wishlist
        toggleWishlist,

        // Cart
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        // Orders
        placeOrder,

        // Addresses
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,

        // Payments
        addPayment,
        updatePayment,
        removePayment,
        setDefaultPayment,
        addPaymentMethod: addPayment,
        updatePaymentMethod: updatePayment,
        removePaymentMethod: removePayment,

        // Checkout
        setCheckoutAddress,
        setCheckoutDelivery,
        setCheckoutPayment,
        setCheckoutPromo,
        resetCheckout,

        // Prefs
        updateNotifPrefs,
        updateStylePrefs,

        // Misc
        addRecentlyViewed,
        markNotificationRead,
        markAllRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
