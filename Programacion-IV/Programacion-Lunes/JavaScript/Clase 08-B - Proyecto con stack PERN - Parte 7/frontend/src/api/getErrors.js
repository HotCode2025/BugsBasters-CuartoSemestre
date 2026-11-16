// Convierte cualquier error de axios en un array de textos para mostrar
export const getErrors = (error) => {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) return message;
  if (typeof message === "string") return [message];

  return ["No se pudo conectar con el servidor. Intenta de nuevo."];
};