// src/lib/api.ts
import { AuthResponse } from "@/types"; // Importamos nuestros tipos

// 1. Obtenemos la URL del API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

/**
 * Guarda la información de autenticación en localStorage.
 */
export const saveAuthData = (data: AuthResponse) => {
  if (typeof window === "undefined") return; // Asegura que solo se ejecute en el cliente
  localStorage.setItem("authToken", data.accessToken);
  if (data.usuario) {
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
  }
};

/**
 * Obtiene el token de autenticación de localStorage.
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

/**
 * Elimina la información de autenticación (Logout).
 */
export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("usuario");
};

/**
 * Wrapper de Fetch para todas las llamadas al API Gateway.
 */
async function fetchWrapper(
  endpoint: string,
  options: RequestInit = {}
) {

  console.log("API Client initialized");
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Si tenemos un token, lo adjuntamos a la cabecera
  const isPublicRoute =
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth/register");

  if (token && !isPublicRoute) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;

  // Si el cuerpo es un objeto convertir a JSON.
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);

  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, finalOptions);

  if (!response.ok) {
    // Manejo de errores mejorado
    const errorData = await response.json().catch(() => ({}));
    console.error(`Error API: ${response.status} ${response.statusText}`, errorData);
    throw new Error(errorData.message || "Error en la petición al servidor");
  }

  // Si la respuesta no tiene contenido (p.ej. un DELETE o un 204)
  if (response.status === 204 || response.headers.get("Content-Length") === "0") {
    return null;
  }

  return response.json();
}

export const apiClient = {
  get: (endpoint: string, options: RequestInit = {}) =>
    fetchWrapper(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, body: any, options: RequestInit = {}) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: (endpoint: string, body: any, options: RequestInit = {}) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  delete: (endpoint: string, options: RequestInit = {}) =>
    fetchWrapper(endpoint, { ...options, method: "DELETE" }),
};
