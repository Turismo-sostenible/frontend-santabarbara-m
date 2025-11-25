// src/lib/api.ts
import { AuthResponse, Usuario } from "@/types"; // Importamos nuestros tipos

// 1. Obtenemos la URL del API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

/**
 * Guarda la información de autenticación en localStorage.
 */
export const saveAuthData = (data: AuthResponse, tenanId: string) => {
  if (typeof window === "undefined") return; // Asegura que solo se ejecute en el cliente
  localStorage.setItem("authToken", data.accessToken);
  localStorage.setItem("tenant_id", tenanId);
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
 * Guarda solo el ID del usuario en localStorage.
 */
export const saveUserId = (userId: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("userId", userId);
};

/**
 * mira si el token ya expiró
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, payloadB64] = token.split(".")
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    const payload = JSON.parse(json)
    const now = Math.floor(Date.now() / 1000)
    return !payload?.exp || payload.exp <= now
  } catch {
    return true
  }
}

/**
 * Elimina la información de autenticación (Logout).
 */
export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("usuario");
  localStorage.removeItem("tenant_id");
  localStorage.removeItem("userId");
};

/**
 * Guarda solo el objeto de usuario en localStorage.
 */
export const saveUser = (usuario: Usuario) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("usuario", JSON.stringify(usuario));
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

  const tenantId = (typeof window !== "undefined")
    ? localStorage.getItem("tenant_id")
    : null;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Si tenemos un token, lo adjuntamos a la cabecera
  const isPublicRoute =
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth/register");

  if (token && !isPublicRoute) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
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
      body: JSON.stringify(body),
    }),

  put: (endpoint: string, body: any, options: RequestInit = {}) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (endpoint: string, options: RequestInit = {}) =>
    fetchWrapper(endpoint, { ...options, method: "DELETE" }),
};