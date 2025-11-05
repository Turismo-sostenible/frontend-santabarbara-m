// src/services/planes-service.ts
import { apiClient } from "@/lib/api";
import type { Plan } from "@/types";

// Asumimos que el Gateway expone esto en /planes
const PLANES_ENDPOINT = "/plans";

export const getPlanes = async (): Promise<Plan[]> => {
  return apiClient.get(PLANES_ENDPOINT);
};

export const getPlanById = async (id: string): Promise<Plan> => {
  return apiClient.get(`${PLANES_ENDPOINT}/${id}`);
};

/**
 * Define la estructura de los datos de texto para crear un plan.
 * Esto se convertirá en un string JSON y se enviará en el campo 'dto'.
 */
export interface PlanCreationData {
  // El tenantId no se incluye aquí porque se debe enviar en la cabecera 'x-tenant-id'
  // a través de la configuración global de apiClient.
  nombre: string;
  descripcion: string;
  precio: {
    valor: number;
    moneda: 'COP' | 'USD' | 'EUR';
  };
  duracion: number; // en horas
  cupoMaximo: number;
  fechasDisponibles: Array<{ desde: string; hasta: string }>; // ISO date strings
}

/**
 * Crea un nuevo plan turístico.
 *
 * @param data - Un objeto con los datos de texto del plan.
 * @param files - Un array con los archivos de imagen a subir.
 * @returns El plan recién creado por el backend.
 */
export const createPlan = async (data: PlanCreationData, files: File[]): Promise<Plan> => {
  const formData = new FormData();

  // 1. Convierte el objeto de datos a un string JSON y lo añade al campo 'dto'.
  const dtoAsString = JSON.stringify(data);
  formData.append('dto', dtoAsString);

  // 2. Añade cada archivo al campo 'files'.
  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  // Llama a: POST http://localhost:8080/planes con el FormData correctamente estructurado.
  //
  // NOTA IMPORTANTE: Tu `apiClient` debe estar configurado para incluir siempre
  // la cabecera 'x-tenant-id' en todas las solicitudes que la requieran.
  return apiClient.post(PLANES_ENDPOINT, formData);
};
