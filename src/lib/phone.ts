const TEN_DIGIT_PHONE = /^\d{10}$/;

export const normalizePhoneNumber = (value: string): string => {
  const compact = value.replace(/[\s().-]/g, "");

  if (/^\+54\d{10}$/.test(compact)) return compact.slice(3);
  if (/^54\d{10}$/.test(compact)) return compact.slice(2);
  if (/^0\d{10}$/.test(compact)) return compact.slice(1);

  return compact;
};

export const isValidPhoneNumber = (value: string): boolean =>
  TEN_DIGIT_PHONE.test(normalizePhoneNumber(value));

export const PHONE_VALIDATION_MESSAGE =
  "El teléfono debe tener 10 dígitos (código de área + número, sin 0 ni 15)";
