// src/types/index.ts

/**
 * Interfaces para el Microservicio de "Planes"
 */
export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: string;
  imagen: string;
  cupoMaximo: number;
}

/**
 * Interfaces para el Microservicio de "Reservas"
 */
export interface Reserva {
  id: string;
  planId: string;
  usuarioId: string;
  fechaHora: string; 
  cantidadParticipantes: number;
  opcionAlimentacion: "sin alimentacion" | "almuerzo" | "refrigerio";
  precioTotal: number;
  estado: "confirmada" | "cancelada" | "completada";
}

// Payload para crear una nueva reserva (lo que el usuario envía)
export interface CreateReservaPayload {
  planId: string;
  fechaHora: string;
  cantidadParticipantes: number;
  opcionAlimentacion: "sin alimentacion" | "almuerzo" | "refrigerio";
}

/**
 * Interfaces para el Microservicio de "Guías Turísticos"
 */
export interface Guia {
  id: string;
  nombre: string;
  disponibilidad: string[]; // Fechas u horarios
}

/**
 * Interfaces para el Microservicio de "Login y Usuarios"
 */
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: "CLIENTE" | "ADMIN" | "GUIA"; 
}

// Payload para el login
export interface LoginPayload {
  correo: string;
  contrasena: string;
}

// Payload para el registro
export interface RegisterPayload {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
  direccion: string;
}

// Respuesta del login
export interface AuthResponse {
  token: string;
  usuario: Usuario;
}