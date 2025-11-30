// src/services/planes-service.ts
import type { Plan } from "@/types";

// Base de datos en memoria (Mock Data) adaptada a la nueva interfaz
const MOCK_PLANES: Plan[] = [
  {
    id: "1",
    nombre: "Caminata Sierra Nevada",
    descripcion: "Explora los paisajes más hermosos de la Sierra Nevada con guías expertos",
    precioValor: 150000,
    precioMoneda: "COP",
    precio: { valor: 150000, moneda: "COP" },
    duracion: 8, // Horas (number)
    imagenes: ["/mountain-hiking-trail.png"],
    cupoMaximo: 10,
    estado: "ACTIVO"
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
    estado: "ACTIVO"
  },
  {
    id: "3",
    nombre: "Rafting Río Magdalena",
    descripcion: "Aventura extrema en las aguas del río más importante de Colombia",
    precioValor: 200000,
    precioMoneda: "COP",
    precio: { valor: 200000, moneda: "COP" },
    duracion: 6,
    imagenes: ["/rafting-river-adventure.jpg"],
    cupoMaximo: 8,
    estado: "ACTIVO"
  },
  {
    id: "4",
    nombre: "Avistamiento de Aves",
    descripcion: "Observa especies únicas en su hábitat natural",
    precioValor: 120000,
    precioMoneda: "COP",
    precio: { valor: 120000, moneda: "COP" },
    duracion: 5,
    imagenes: ["/bird-watching-colombia.jpg"],
    cupoMaximo: 6,
    estado: "ACTIVO"
  },
  {
    id: "5",
    nombre: "Parapente Valle del Cauca",
    descripcion: "Vuela sobre los hermosos paisajes del Valle del Cauca",
    precioValor: 180000,
    precioMoneda: "COP",
    precio: { valor: 180000, moneda: "COP" },
    duracion: 3,
    imagenes: ["/paragliding-valley-landscape.jpg"],
    cupoMaximo: 4,
    estado: "ACTIVO"
  },
  {
    id: "6",
    nombre: "Tour Histórico Cartagena",
    descripcion: "Recorre la ciudad amurallada y conoce su fascinante historia",
    precioValor: 90000,
    precioMoneda: "COP",
    precio: { valor: 90000, moneda: "COP" },
    duracion: 4,
    imagenes: ["/cartagena-historic-city-walls.jpg"],
    cupoMaximo: 20,
    estado: "ACTIVO"
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPlanes = async (): Promise<Plan[]> => {
  await delay(500);
  return [...MOCK_PLANES];
};

export const getPlanById = async (id: string): Promise<Plan> => {
  await delay(500);
  const plan = MOCK_PLANES.find((p) => p.id === id);
  
  if (!plan) {
    throw new Error(`No se encontró el plan con id: ${id}`);
  }
  
  return plan;
};