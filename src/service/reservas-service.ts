// src/services/reservas-service.ts
import { apiClient } from "@/lib/api"
import type {
  Reserva,
  CreateReservaPayload,
  UpdateReservaPayload
} from "@/types"

const QUERY_ENDPOINT = "/api/v1/reservas"

// --- Métodos de Consulta (reserva-query-controller) ---

/**
 * Obtiene la lista de todas las reservas.
 * GET /reservas
 */
export const getReservas = async (): Promise<Reserva[]> => {
  return apiClient.get(QUERY_ENDPOINT)
}

/**
 * Obtiene una reserva específica por su ID.
 * GET /reservas/{id}
 */
export const getReservaById = async (id: string): Promise<Reserva> => {
  return apiClient.get(`${QUERY_ENDPOINT}/${id}`)
}

// --- Métodos de Comando (reserva-admin-command-controller) ---

/**
 * Crea una nueva reserva.
 * POST /reservas
 * (Requiere token de Admin o usuario según lógica)
 */
export const createReserva = async (data: CreateReservaPayload): Promise<Reserva> => {
  console.log("Creando reserva con datos:", data)
  return apiClient.post(QUERY_ENDPOINT, data)
}

/**
 * Actualiza la información de una reserva.
 * PUT /reservas/{id}
 * (Requiere token de Admin)
 */
export const updateReserva = async (id: string, data: UpdateReservaPayload): Promise<void> => {
  return apiClient.put(`${QUERY_ENDPOINT}/${id}`, data)
}

/**
 * Elimina una reserva.
 * DELETE /reservas/{id}
 * (Requiere token de Admin)
 */
export const deleteReserva = async (id: string): Promise<void> => {
  return apiClient.delete(`${QUERY_ENDPOINT}/${id}`)
}
