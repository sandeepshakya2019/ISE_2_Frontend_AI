export const validateMobile = (mobile: string): boolean => {
  const regex = /^[6-9]\d{9}$/; // Valid Indian mobile number pattern
  return regex.test(mobile);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation pattern
  return regex.test(email);
};

export const validateOtp = (otp: string): boolean => {
  const regex = /^\d{6}$/; // 6-digit OTP
  return regex.test(otp);
};
