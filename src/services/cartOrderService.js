export const calculateOrderTotals = ({
  cartTotal = 0,
  promoApplied = false,
  deliveryPrice,
}) => {
  const discount = promoApplied ? cartTotal * 0.2 : 0;
  const subtotal = cartTotal - discount;
  const shipping = typeof deliveryPrice === 'number' ? deliveryPrice : cartTotal > 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { discount, subtotal, shipping, tax, total };
};

export const cartOrderService = {
  calculateOrderTotals,
};

export default cartOrderService;
