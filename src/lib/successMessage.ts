const SUCCESS_MESSAGE_KEY = "inmobiliaria-success-message";

export const setSuccessMessage = (message: string) => {
  sessionStorage.setItem(SUCCESS_MESSAGE_KEY, message);
};

export const consumeSuccessMessage = (): string => {
  const message = sessionStorage.getItem(SUCCESS_MESSAGE_KEY) || "";
  sessionStorage.removeItem(SUCCESS_MESSAGE_KEY);
  return message;
};