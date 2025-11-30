// src/services/guias-service.ts
import type { Guia, HorarioGuia, CreateGuiaPayload, UpdateGuiaPayload, UpdateDisponibilidadPayload } from "@/types";

// Helper para crear objetos de hora simulados
const createTime = (h: number, m: number = 0) => ({ hour: h, minute: m, second: 0, nano: 0 });

// Horario por defecto para nuevos guías
const defaultHorario: HorarioGuia[] = [
  {
    dia: "MONDAY", disponible: false, franjas: []
  },
  {
    dia: "TUESDAY", disponible: false, franjas: []
  },
  {
    dia: "WEDNESDAY", disponible: false, franjas: []
  },
  {
    dia: "THURSDAY", disponible: false, franjas: []
  },
  {
    dia: "FRIDAY", disponible: true, franjas: [{ horaInicio: createTime(8), horaFin: createTime(17) }]
  },
  {
    dia: "SATURDAY",
    disponible: true,
    franjas: [
      { horaInicio: createTime(8), horaFin: createTime(12) },
      { horaInicio: createTime(14), horaFin: createTime(18) }
    ]
  },
  {
    dia: "SUNDAY",
    disponible: true,
    franjas: [
      { horaInicio: createTime(9), horaFin: createTime(13) }
    ]
  }
];

// Base de datos de guías en memoria (Mutable)
let MOCK_GUIAS: Guia[] = [
  {
    id: "guia-1",
    nombre: "Carlos Ruiz",
    email: "carlos@guias.com",
    telefono: "3001112233",
    estado: "ACTIVO",
    horarios: defaultHorario
  },
  {
    id: "guia-2",
    nombre: "Ana María Polo",
    email: "ana@guias.com",
    telefono: "3104445566",
    estado: "ACTIVO",
    horarios: defaultHorario
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- LECTURA ---
export const getGuias = async (): Promise<Guia[]> => {
  await delay(500);
  return [...MOCK_GUIAS];
};

export const getGuiaById = async (id: string): Promise<Guia> => {
  await delay(500);
  const guia = MOCK_GUIAS.find(g => g.id === id);
  if (!guia) throw new Error(`Guía con id ${id} no encontrado`);
  return guia;
};

// --- CREACIÓN ---
export const createGuia = async (payload: CreateGuiaPayload): Promise<Guia> => {
  await delay(800);
  if (MOCK_GUIAS.some(g => g.email === payload.email)) {
    throw new Error("El email ya está registrado para otro guía.");
  }

  const newGuia: Guia = {
    id: `guia-${Date.now()}-${MOCK_GUIAS.length + 1}`,
    nombre: payload.nombre,
    email: payload.email,
    telefono: payload.telefono,
    estado: "INACTIVO", // Por defecto, se activa después de configurar horarios
    horarios: [], // Empieza sin horarios configurados
  };
  MOCK_GUIAS.push(newGuia);
  return newGuia;
};

// --- ACTUALIZACIÓN (Datos básicos) ---
export const updateGuia = async (id: string, payload: UpdateGuiaPayload): Promise<Guia> => {
  await delay(800);
  const index = MOCK_GUIAS.findIndex(g => g.id === id);
  if (index === -1) throw new Error("Guía no encontrado.");

  const updatedGuia = {
    ...MOCK_GUIAS[index],
    ...payload,
  };
  MOCK_GUIAS[index] = updatedGuia;
  return updatedGuia;
};

// --- ELIMINACIÓN ---
export const deleteGuia = async (id: string): Promise<void> => {
  await delay(600);
  const initialLength = MOCK_GUIAS.length;
  MOCK_GUIAS = MOCK_GUIAS.filter(g => g.id !== id);
  if (MOCK_GUIAS.length === initialLength) {
    throw new Error("Guía no encontrado para eliminar.");
  }
};

// --- ACTUALIZACIÓN (Disponibilidad) ---
export const updateDisponibilidad = async (
  id: string,
  payload: UpdateDisponibilidadPayload
): Promise<Guia> => {
  await delay(1000);
  const index = MOCK_GUIAS.findIndex(g => g.id === id);
  if (index === -1) throw new Error("Guía no encontrado.");
  
  // Convertir los strings HH:MM de vuelta a objetos {hour, minute}
  const updatedHorarios: HorarioGuia[] = payload.map(payloadDia => {
    const franjasHorarias: HorarioGuia["franjas"] = payloadDia.franjas.map(f => {
      const [startH, startM] = f.horaInicio.split(":").map(Number);
      const [endH, endM] = f.horaFin.split(":").map(Number);
      
      return {
        horaInicio: { hour: startH, minute: startM, second: 0, nano: 0 },
        horaFin: { hour: endH, minute: endM, second: 0, nano: 0 },
      };
    });

    // Determinar el estado ACTIVO si hay al menos 1 día disponible
    const newEstado = payload.some(h => h.disponible && h.franjas.length > 0) ? "ACTIVO" : "INACTIVO";
    
    // Actualizar el estado del Guía
    MOCK_GUIAS[index].estado = newEstado;

    return {
      dia: payloadDia.dia as Guia['horarios'][number]['dia'],
      disponible: payloadDia.disponible,
      franjas: franjasHorarias,
    };
  });
  
  MOCK_GUIAS[index].horarios = updatedHorarios;
  
  return MOCK_GUIAS[index];
};