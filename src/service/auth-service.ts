// src/services/auth-service.ts
import { apiClient, saveAuthData, clearAuthData } from "@/lib/api";
import type { LoginPayload, RegisterPayload, AuthResponse, Usuario } from "@/types";

const AUTH_ENDPOINT = "/auth";

export const login = async (credentials: LoginPayload): Promise<AuthResponse> => {
  // Llama a: POST http://localhost:8080/auth/login
  const data = await apiClient.post(`${AUTH_ENDPOINT}/login`, credentials);
  saveAuthData(data); // Guarda el token y usuario al hacer login
  return data;
};

export const register = async (userData: RegisterPayload): Promise<Usuario> => {
  // Llama a: POST http://localhost:8080/auth/register
  return apiClient.post(`${AUTH_ENDPOINT}/register`, userData);
};

export const logout = () => {
  clearAuthData(); // Simplemente borra los datos del cliente
  // Aquí podrías llamar a un endpoint de /logout si tu backend lo requiere
};

export const getProfile = async (): Promise<Usuario> => {
  // Llama a: GET http://localhost:8080/auth/profile (requiere token)
  return apiClient.get(`${AUTH_ENDPOINT}/profile`);
};