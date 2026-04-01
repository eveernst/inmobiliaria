export const extractApiErrorMessage = (error: any): string => {
  const backendMessage = error?.response?.data?.message;

  if (Array.isArray(backendMessage)) {
    return backendMessage.join("\n- ");
  }

  if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  if (typeof error?.message === "string" && error.message.trim().length > 0) {
    return error.message;
  }

  return "Ocurrio un error inesperado.";
};

export const alertMissingFields = (
  formErrors: Record<string, unknown>,
  labels: Record<string, string>,
  title = "Faltan completar campos obligatorios:"
): void => {
  const missingFields = Object.keys(formErrors).map((key) => labels[key] || key);

  if (missingFields.length === 0) {
    return;
  }

  alert(`${title}\n- ${missingFields.join("\n- ")}`);
};
