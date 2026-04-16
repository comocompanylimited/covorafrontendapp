export const normalizeAddress = (address = {}) => ({
  id: address.id || `addr_${Date.now()}`,
  label: address.label || 'Home',
  fullName: address.fullName || '',
  phone: address.phone || '',
  line1: address.line1 || '',
  line2: address.line2 || '',
  city: address.city || '',
  postcode: address.postcode || '',
  country: address.country || '',
  isDefault: !!address.isDefault,
});

export const normalizePaymentMethod = (payment = {}) => ({
  id: payment.id || `pay_${Date.now()}`,
  brand: payment.brand || 'Visa',
  last4: payment.last4 || '',
  expiry: payment.expiry || '',
  cardHolder: payment.cardHolder || '',
  nickname: payment.nickname || payment.cardHolder || 'Card',
  isDefault: !!payment.isDefault,
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const saveProfileDetails = async (profile = {}) => {
  await delay(800);
  return {
    firstName: profile.firstName?.trim() || '',
    lastName: profile.lastName?.trim() || '',
    email: profile.email?.trim() || '',
    phone: profile.phone?.trim() || '',
    name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
  };
};

export const saveAddressDetails = async (address = {}) => {
  await delay(650);
  return normalizeAddress(address);
};

export const savePaymentMethodDetails = async (payment = {}) => {
  await delay(650);
  return normalizePaymentMethod(payment);
};

export const profileService = {
  normalizeAddress,
  normalizePaymentMethod,
  saveProfileDetails,
  saveAddressDetails,
  savePaymentMethodDetails,
};

export default profileService;
