const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', price: 0, estimate: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 14.99, estimate: '1-2 business days' },
  { id: 'luxury-priority', name: 'Luxury Priority', price: 24.99, estimate: 'Next business day' },
];

const PROMO_CODES = {
  COVORA20: { type: 'percent', value: 20, label: 'COVORA20' },
};

export const validatePromoCode = async (rawCode) => {
  await delay(220);
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) {
    return { valid: false, message: 'Please enter a promo code.' };
  }

  const promo = PROMO_CODES[code];
  if (!promo) {
    return { valid: false, message: 'Invalid code. Try COVORA20' };
  }

  return {
    valid: true,
    message: '20% discount applied!',
    promo,
  };
};

export const buildMockOrderPayload = ({
  cart = [],
  totals,
  address,
  payment,
  delivery,
  promoCode,
}) => {
  const number = `COV-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  return {
    id: number,
    number,
    date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: 'Processing',
    statusStep: 0,
    items: cart,
    address,
    payment,
    delivery,
    promoCode: promoCode || null,
    subtotal: totals?.subtotal || 0,
    discount: totals?.discount || 0,
    shipping: totals?.shipping || 0,
    tax: totals?.tax || 0,
    total: totals?.total || 0,
    estimatedDelivery: delivery?.desc || delivery?.estimate || '3-5 business days',
    trackingNumber: null,
  };
};

export const checkoutService = {
  SHIPPING_METHODS,
  validatePromoCode,
  buildMockOrderPayload,
};

export default checkoutService;
