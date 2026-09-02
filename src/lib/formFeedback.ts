export const extractApiErrorMessage = (error: unknown): string => {
  const response = (error as { response?: { data?: { message?: unknown } } } | undefined)?.response;
  const backendMessage = response?.data?.message;

  if (Array.isArray(backendMessage)) {
    return backendMessage.join("\n- ");
  }

  if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
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
