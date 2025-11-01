// src/service/guias-service.ts
import { apiClient } from "@/lib/api";
import type {
  Guia,
  CreateGuiaPayload,
  UpdateGuiaPayload,
  UpdateDisponibilidadPayload,
  HorarioGuia
} from "@/types";



const QUERY_ENDPOINT = "/api/v1/guias";
const ADMIN_ENDPOINT = "/api/v1/guias/admin";

// --- Métodos de Consulta (guia-query-controller) ---

/**
 * Obtiene la lista de todos los guías.
 * GET /guias
 */
export const getGuias = async (): Promise<Guia[]> => {
  console.log("Fetching guias from", QUERY_ENDPOINT);
  return apiClient.get(QUERY_ENDPOINT);
};

/**
 * Obtiene un guía específico por su ID.
 * GET /guias/{id}
 */
export const getGuiaById = async (id: string): Promise<Guia> => {
  return apiClient.get(`${QUERY_ENDPOINT}/${id}`);
};

// --- Métodos de Comando (guia-admin-command-controller) ---

/**
 * Crea un nuevo guía.
 * POST /guias/admin
 * (Requiere token de Admin)
 */
export const createGuia = async (data: CreateGuiaPayload): Promise<Guia> => {
  // Asumimos que el backend devuelve el guía creado, aunque Swagger solo dice 200 OK
  return apiClient.post(ADMIN_ENDPOINT, data);
};

/**
 * Actualiza la información de un guía.
 * PUT /guias/admin/{id}
 * (Requiere token de Admin)
 */
export const updateGuia = async (id: string, data: UpdateGuiaPayload): Promise<void> => {
  // Swagger dice 200 OK, por lo que devolvemos Promise<void>
  return apiClient.put(`${ADMIN_ENDPOINT}/${id}`, data);
};

/**
 * Elimina un guía.
 * DELETE /guias/admin/{id}
 * (Requiere token de Admin)
 */
export const deleteGuia = async (id: string): Promise<void> => {
  return apiClient.delete(`${ADMIN_ENDPOINT}/${id}`);
};

/**
 * Actualiza la disponibilidad de un guía.
 * PUT /guias/admin/{guiaId}/disponibilidad
 * (Requiere token de Admin)
 */
export const updateDisponibilidad = async (
  guiaId: string,
  data: UpdateDisponibilidadPayload
): Promise<void> => {
  return apiClient.put(`${ADMIN_ENDPOINT}/${guiaId}/disponibilidad`, data);
};