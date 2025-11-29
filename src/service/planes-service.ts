// src/services/planes-service.ts
import type { Plan } from "@/types";

const PLAN_MICRO_URL = process.env.NEXT_PUBLIC_PLAN_MICRO_URL || "http://localhost:3002/api/v1";
const TENANT_ID = "01-santa-barbara";

console.log("PLAN_MICRO_URL:", PLAN_MICRO_URL);
console.log("TENANT_ID:", TENANT_ID);

// Headers comunes para las peticiones
const getHeaders = () => ({
  "tenant_id": TENANT_ID,
  "Content-Type": "application/json",
});

// Normalizar plan del backend al formato del frontend
const normalizePlan = (backendPlan: any): Plan => ({
  id: backendPlan.id,
  nombre: backendPlan.nombre,
  descripcion: backendPlan.descripcion,
  precioValor: backendPlan.precio?.valor || backendPlan.precioValor || 0,
  precioMoneda: (backendPlan.precio?.moneda || backendPlan.precioMoneda || "COP") as "COP" | "USD",
  duracion: backendPlan.duracion,
  cupoMaximo: backendPlan.cupoMaximo,
  imagenes: backendPlan.imagenes || [],
  fechasDisponibles: backendPlan.fechasDisponibles?.map((f: any) => ({
    desde: f.desde,
    hasta: f.hasta,
  })) || [],
  tenantId: backendPlan.tenantId,
  estado: backendPlan.estado,
  createdAt: backendPlan.createdAt,
  updatedAt: backendPlan.updatedAt,
});

export const getPlanes = async (): Promise<Plan[]> => {
  try {
    const url = `${PLAN_MICRO_URL}/plans`;
    const headers = getHeaders();
    
    console.log("Fetching plans from:", url);
    console.log("Headers:", headers);
    
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Error al obtener planes: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Plans data received:", data);
    // El backend retorna { data: Plan[] }
    return (data.data || []).map(normalizePlan);
  } catch (error) {
    console.error("Error en getPlanes:", error);
    return [];
  }
};

export const getPlanById = async (id: string): Promise<Plan | null> => {
  try {
    const url = `${PLAN_MICRO_URL}/plans/${id}`;
    const headers = getHeaders();
    
    console.log("=== getPlanById ===");
    console.log("ID:", id);
    console.log("Fetching plan from:", url);
    console.log("Headers:", headers);
    
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Error al obtener plan: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Plan data received:", data);
    
    if (!data.data) {
      console.warn("No data field in response");
      return null;
    }
    
    const normalized = normalizePlan(data.data);
    console.log("Normalized plan:", normalized);
    return normalized;
  } catch (error) {
    console.error("Error en getPlanById:", error);
    return null;
  }
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
    moneda: "COP" | "USD" | "EUR";
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
export const createPlan = async (
  data: PlanCreationData,
  files: File[],
): Promise<Plan> => {
  try {
    const formData = new FormData();

    // Agregar datos del plan como JSON
    formData.append("dto", JSON.stringify({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      duracion: data.duracion,
      cupoMaximo: data.cupoMaximo,
      fechasDisponibles: data.fechasDisponibles,
    }));

    // Agregar imágenes
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(`${PLAN_MICRO_URL}/plans`, {
      method: "POST",
      headers: {
        "tenant_id": TENANT_ID,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al crear plan: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error en createPlan:", error);
    throw error;
  }
};

export interface PlanUpdateData extends Partial<PlanCreationData> {}

export const updatePlan = async (
  id: string,
  data: PlanUpdateData,
): Promise<Plan> => {
  try {
    const current = await getPlanById(id);
    if (!current) {
      throw new Error("Plan no encontrado");
    }

    const response = await fetch(`${PLAN_MICRO_URL}/plans/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: data.nombre ?? current.nombre,
        descripcion: data.descripcion ?? current.descripcion,
        precio: data.precio ?? { valor: current.precioValor, moneda: current.precioMoneda },
        duracion: data.duracion ?? current.duracion,
        cupoMaximo: data.cupoMaximo ?? current.cupoMaximo,
        fechasDisponibles: data.fechasDisponibles ?? current.fechasDisponibles,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar plan: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error en updatePlan:", error);
    throw error;
  }
};

export const deletePlan = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${PLAN_MICRO_URL}/plans/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar plan: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error en deletePlan:", error);
    throw error;
  }
};
