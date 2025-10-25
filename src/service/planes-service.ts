// src/services/planes-service.ts
import { apiClient } from "@/lib/api";
import type { Plan } from "@/types";

// Asumimos que el Gateway expone esto en /planes
const PLANES_ENDPOINT = "/planes";

export const getPlanes = async (): Promise<Plan[]> => {
  // Llama a: GET http://localhost:8080/planes
  return apiClient.get(PLANES_ENDPOINT);
};

export const getPlanById = async (id: string): Promise<Plan> => {
  // Llama a: GET http://localhost:8080/planes/123
  return apiClient.get(`${PLANES_ENDPOINT}/${id}`);
};

