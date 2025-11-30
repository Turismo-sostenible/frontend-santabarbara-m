// src/services/planes-service.ts
import type { Plan } from "@/types";

// TIPOS EXPORTADOS REQUERIDOS por las vistas de Creación/Edición
export interface PlanCreationData { 
  nombre: string;
  descripcion: string;
  precioValor: number;
  duracion: number; // en horas
  cupoMaximo: number;
  // Otros campos necesarios para la creación
}
// Alias para la actualización
export type PlanUpdateData = PlanCreationData; 

// Helper para crear IDs temporales
const generateId = () => `plan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

// Base de datos en memoria (Mutable)
let MOCK_PLANES: Plan[] = [
  {
    id: "1",
    nombre: "Caminata Sierra Nevada",
    descripcion: "Explora los paisajes más hermosos de la Sierra Nevada con guías expertos",
    precioValor: 150000,
    precioMoneda: "COP",
    precio: { valor: 150000, moneda: "COP" },
    duracion: 8,
    imagenes: ["/mountain-hiking-trail.png"],
    cupoMaximo: 10,
    estado: "ACTIVO",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    nombre: "Tour Café Colombiano",
    descripcion: "Descubre el proceso del café desde la semilla hasta la taza",
    precioValor: 80000,
    precioMoneda: "COP",
    precio: { valor: 80000, moneda: "COP" },
    duracion: 4,
    imagenes: ["/coffee-plantation-colombia.jpg"],
    cupoMaximo: 15,
    estado: "ACTIVO",
    createdAt: new Date().toISOString(),
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- LECTURA ---
export const getPlanes = async (): Promise<Plan[]> => {
  await delay(500);
  return [...MOCK_PLANES];
};

export const getPlanById = async (id: string): Promise<Plan> => {
  await delay(500);
  const plan = MOCK_PLANES.find((p) => p.id === id);
  
  if (!plan) {
    throw new Error(`Plan con ID ${id} no encontrado`);
  }
  
  return plan;
};

// --- CREACIÓN (Exportada) ---
export const createPlan = async (data: PlanCreationData, files?: File[]): Promise<Plan> => {
    await delay(1000); 

    if (files && files.length > 0) {
        console.log(`Simulando subida de ${files.length} archivos para el plan: ${data.nombre}`);
    }

    const newPlan: Plan = {
        id: generateId(),
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioValor: data.precioValor,
        precioMoneda: "COP",
        precio: { valor: data.precioValor, moneda: "COP" },
        duracion: data.duracion,
        cupoMaximo: data.cupoMaximo,
        imagenes: files && files.length > 0 ? [`/placeholder.svg?text=${data.nombre}`] : ["/placeholder.svg?text=Nuevo+Plan"],
        estado: "PENDIENTE",
        createdAt: new Date().toISOString(),
    };

    MOCK_PLANES.push(newPlan);
    return newPlan;
};

// --- ACTUALIZACIÓN (Exportada) ---
export const updatePlan = async (id: string, data: PlanUpdateData | PlanCreationData): Promise<Plan> => {
    await delay(1000);
    const index = MOCK_PLANES.findIndex(p => p.id === id);

    if (index === -1) {
        throw new Error(`Plan con ID ${id} no encontrado para actualizar.`);
    }

    const updatedPlan: Plan = {
        ...MOCK_PLANES[index],
        ...data,
        precioMoneda: MOCK_PLANES[index].precioMoneda,
        precio: { valor: data.precioValor, moneda: MOCK_PLANES[index].precioMoneda || "COP" },
        updatedAt: new Date().toISOString(),
    };

    MOCK_PLANES[index] = updatedPlan;
    return updatedPlan;
};

// --- ELIMINACIÓN (Exportada) ---
export const deletePlan = async (id: string): Promise<void> => {
  await delay(600);
  const initialLength = MOCK_PLANES.length;
  MOCK_PLANES = MOCK_PLANES.filter(p => p.id !== id);
  if (MOCK_PLANES.length === initialLength) {
    throw new Error(`Plan con ID ${id} no encontrado para eliminar.`);
  }
};