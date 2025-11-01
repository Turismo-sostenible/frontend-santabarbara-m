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