const emailRegex = /\S+@\S+\.\S+/;

export const validateSignInPayload = ({ email, password }) => {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateSignUpPayload = (payload, emailExists) => {
  const errors = {};
  if (!payload.firstName?.trim()) errors.firstName = 'First name is required';
  if (!payload.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!payload.email?.trim()) errors.email = 'Email is required';
  else if (!emailRegex.test(payload.email)) errors.email = 'Enter a valid email';
  else if (emailExists?.(payload.email)) errors.email = 'An account with this email already exists';
  if (!payload.phone?.trim()) errors.phone = 'Phone number is required';
  if (!payload.password) errors.password = 'Password is required';
  else if (payload.password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (!/[A-Z]/.test(payload.password)) errors.password = 'Must contain at least one uppercase letter';
  else if (!/[0-9]/.test(payload.password)) errors.password = 'Must contain at least one number';
  if (payload.password !== payload.confirm) errors.confirm = 'Passwords do not match';
  return errors;
};

export const authService = {
  validateSignInPayload,
  validateSignUpPayload,
};

export default authService;
