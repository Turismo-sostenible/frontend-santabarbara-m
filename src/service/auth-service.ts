// src/services/auth-service.ts
import { saveAuthData, clearAuthData } from "@/lib/api";
import type { LoginPayload, RegisterPayload, AuthResponse, UserProfile, Usuario } from "@/types";

// Base de datos de usuarios en memoria (Usamos UserProfile para guardar todos los datos)
const MOCK_USERS: UserProfile[] = [
  {
    id: "user-demo-123",
    username: "userdemo",
    name: "Usuario",
    lastName: "Demo",
    email: "demo@test.com",
    role: "CLIENT",
    age: 30
  }
];

// Almacén simple de contraseñas
const MOCK_PASSWORDS: Record<string, string> = {
  "demo@test.com": "12345678"
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (credentials: LoginPayload): Promise<AuthResponse> => {
  await delay(800);

  const storedPassword = MOCK_PASSWORDS[credentials.email];

  if (storedPassword && storedPassword === credentials.password) {
    const fullUser = MOCK_USERS.find(u => u.email === credentials.email);
    if (!fullUser) throw new Error("Error interno: Usuario no encontrado");

    // Convertimos UserProfile a Usuario (minificado) para la respuesta de Auth
    const usuarioMin: Usuario = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role
    };

    const response: AuthResponse = {
      accessToken: `fake-access-token-${Date.now()}`,
      refreshToken: `fake-refresh-token-${Date.now()}`,
      usuario: usuarioMin
    };

    // Nota: saveAuthData en @/lib/api probablemente necesite ajustes si 
    // esperaba el tipo viejo, pero aquí asumimos que ya usa la nueva AuthResponse
    saveAuthData(response , "santabarbara1"); 
    return response;
  }

  throw new Error("Credenciales inválidas");
};

export const register = async (userData: RegisterPayload): Promise<UserProfile> => {
  await delay(800);

  if (MOCK_USERS.some(u => u.email === userData.email)) {
    throw new Error("El correo electrónico ya está registrado");
  }

  // Mapear RegisterPayload a UserProfile
  // Nota: casteamos role a "CLIENT" | "ADMINISTRATOR" | "TOURIST_GUIDE" 
  // o validamos que venga correcto.
  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    username: userData.username,
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
    age: userData.age,
    role: userData.role as "CLIENT" | "ADMINISTRATOR" | "TOURIST_GUIDE" 
  };

  MOCK_USERS.push(newUser);
  MOCK_PASSWORDS[userData.email] = userData.password;

  return newUser;
};

export const logout = () => {
  clearAuthData();
};

export const getProfile = async (): Promise<UserProfile> => {
  await delay(500);
  
  if (typeof window !== "undefined") {
    // Asumimos que guardamos el objeto usuario completo o su ID
    // Para simplificar el mock, buscamos en el array por el email guardado en LS
    // (Esto requiere que saveAuthData guarde algo recuperable)
    const storedAuthStr = localStorage.getItem("usuario"); // O como lo guarde tu api.ts
    
    if (storedAuthStr) {
      const storedUserMin = JSON.parse(storedAuthStr) as Usuario;
      const fullUser = MOCK_USERS.find(u => u.id === storedUserMin.id);
      if (fullUser) return fullUser;
    }
  }
  
  throw new Error("No hay sesión activa");
};