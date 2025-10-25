// src/services/guias-service.ts
import { apiClient } from "@/lib/api";
import type { Guia } from "@/types";

// Asumimos que el Gateway expone esto en /guias
const GUIAS_ENDPOINT = "/guias";

export const getGuias = async (): Promise<Guia[]> => {
  // Llama a: GET http://localhost:8080/guias
  return apiClient.get(GUIAS_ENDPOINT);
};

export const getGuiaById = async (id: string): Promise<Guia> => {
  // Llama a: GET http://localhost:8080/guias/123
  return apiClient.get(`${GUIAS_ENDPOINT}/${id}`);
};
