// src/services/reservas-service.ts
import { apiClient } from "@/lib/api";
import type { Reserva, CreateReservaPayload } from "@/types";

const RESERVAS_ENDPOINT = "/reservas";

export const createReserva = async (
  reservaData: CreateReservaPayload
): Promise<Reserva> => {
  // Llama a: POST http://localhost:8080/reservas (requiere token)
  return apiClient.post(RESERVAS_ENDPOINT, reservaData);
};

export const getMisReservas = async (): Promise<Reserva[]> => {
  // Llama a: GET http://localhost:8080/reservas/mis-reservas (requiere token)
  return apiClient.get(`${RESERVAS_ENDPOINT}/mis-reservas`);
};

export const cancelarReserva = async (id: string): Promise<void> => {
  // Llama a: DELETE http://localhost:8080/reservas/123 (requiere token)
  return apiClient.delete(`${RESERVAS_ENDPOINT}/${id}`);
};