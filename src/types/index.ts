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
  reservaId: string;
  usuario: string;
  guia: Guia | string;
  plan: Plan | string;
  participantes: number;
  refrigerio: "DESAYUNO" | "ALMUERZO" | "MERIENDA" | "CENA";
  fechaReserva: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | string;
  precioTotal: number;
}

export interface CreateReservaPayload {
  usuario: string;
  guia: string;
  plan: string;
  participantes: number;
  refrigerio: "DESAYUNO" | "ALMUERZO" | "MERIENDA" | "CENA";
  fechaReserva: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
  precioTotal: number;
}

export interface UpdateReservaPayload {
  refrigerio?: "DESAYUNO" | "ALMUERZO" | "MERIENDA" | "CENA";
  fechaReserva?: string;
}

// Tipos para la estructura de tiempo
type DiaSemana = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

interface Hora {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface FranjaHoraria {
  horaInicio: Hora;
  horaFin: Hora;
}

export interface HorarioGuia {
  dia: DiaSemana;
  disponible: boolean;
  franjas: FranjaHoraria[];
}
// Interfaz para el PAYLOAD (lo que ENVIAMOS) de una franja horaria
interface FranjaHorariaPayload {
  horaInicio: string; // "HH:MM"
  horaFin: string;   // "HH:MM"
}

// Interfaz para el PAYLOAD (lo que ENVIAMOS) de un horario
export interface HorarioGuiaPayload {
  dia: DiaSemana;
  disponible: boolean;
  franjas: FranjaHorariaPayload[];
}

// Redefinimos UpdateDisponibilidadPayload para que use el tipo correcto
export type UpdateDisponibilidadPayload = HorarioGuiaPayload[];

// Interfaz principal del Guía (Respuesta de GET)
export interface Guia {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
  horarios: HorarioGuia[];
}

// Payload para crear un Guía (POST /admin)
export interface CreateGuiaPayload {
  nombre: string;
  email: string;
  telefono: string;
}

// Payload para actualizar un Guía (PUT /admin/{id})
export interface UpdateGuiaPayload {
  nombre: string;
  email: string;
  telefono: string;
}


/**
 * Interfaces para el Microservicio de "Login y Usuarios"
 */
export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "ADMINISTRATOR" | "TOURIST_GUIDE";
}

export interface CreateUserPayload {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  age?: number;
}

// Payload para el login
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload para el registro
export interface RegisterPayload {
  username:string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  age:number;
  role:string;
}

// Respuesta del login
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  lastName: string; 
  age: number;      
  role: "CLIENT" | "ADMINISTRATOR" | "TOURIST_GUIDE";
  email: string;
}