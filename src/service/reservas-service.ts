// src/services/reservas-service.ts
import type { Reserva, CreateReservaPayload, UpdateReservaPayload } from "@/types";
import { getPlanById } from "./planes-service";

// Array para almacenar las reservas en memoria
let MOCK_RESERVAS: Reserva[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createReserva = async (
  payload: CreateReservaPayload
): Promise<Reserva> => {
  await delay(800);

  // Intentamos obtener el usuario actual si el payload envía el ID del usuario
  let currentUserId = payload.usuario;
  
  // Si el frontend no envía el usuario en el payload (dependiendo de la implementación),
  // lo sacamos del storage
  if (!currentUserId && typeof window !== "undefined") {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) throw new Error("Debes iniciar sesión");
    currentUserId = JSON.parse(storedUser).id;
  }

  // Obtenemos el plan para calcular precio (si el payload no trae el precio final correcto)
  // Aunque el payload trae 'precioTotal', es buena práctica recalcularlo o validarlo.
  // Aquí confiamos en el mock o usamos el payload.
  
  const nuevaReserva: Reserva = {
    reservaId: `res-${Date.now()}`,
    usuario: currentUserId,
    guia: payload.guia, // string ID
    plan: payload.plan, // string ID
    participantes: payload.participantes,
    refrigerio: payload.refrigerio,
    fechaReserva: payload.fechaReserva,
    estado: "CONFIRMADA", // Simulamos que se crea confirmada
    precioTotal: payload.precioTotal
  };

  MOCK_RESERVAS.push(nuevaReserva);
  return nuevaReserva;
};

// NUEVA FUNCIÓN: Implementación de la actualización de la reserva en memoria
export const updateReserva = async (
    reservaId: string, 
    payload: UpdateReservaPayload
): Promise<Reserva> => {
    await delay(800);

    const index = MOCK_RESERVAS.findIndex(r => r.reservaId === reservaId);

    if (index === -1) {
        throw new Error("Reserva no encontrada para actualizar.");
    }

    // Aplicar los cambios del payload a la reserva en memoria
    const updatedReserva = {
        ...MOCK_RESERVAS[index],
        ...payload,
        // Forzar el estado a CONFIRMADA si se edita, o mantener el que tenía
        estado: MOCK_RESERVAS[index].estado === 'CANCELADA' ? 'CANCELADA' : 'CONFIRMADA'
    } as Reserva;

    MOCK_RESERVAS[index] = updatedReserva;

    return updatedReserva;
};

export const getMisReservas = async (): Promise<Reserva[]> => {
  await delay(600);

  if (typeof window === "undefined") return [];

  const storedUser = localStorage.getItem("usuario");
  if (!storedUser) throw new Error("No hay sesión activa");
  
  const usuario = JSON.parse(storedUser);

  // Filtrar por ID de usuario
  return MOCK_RESERVAS.filter(r => r.usuario === usuario.id);
};

export const cancelarReserva = async (reservaId: string): Promise<void> => {
  await delay(600);
  
  const index = MOCK_RESERVAS.findIndex(r => r.reservaId === reservaId);
  if (index === -1) {
    throw new Error("Reserva no encontrada");
  }

  // En lugar de borrarla, cambiamos estado a CANCELADA según la interfaz
  MOCK_RESERVAS[index].estado = "CANCELADA";
};