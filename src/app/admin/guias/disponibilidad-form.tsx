"use client";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Guia, HorarioGuiaPayload, UpdateDisponibilidadPayload } from "@/types";
import { updateDisponibilidad } from "@/service/guias-service";
import { X, Plus } from "lucide-react";
import { useEffect } from "react";

// --- Helper para CONVERTIR DE OBJETO (backend) A STRING (form) ---
const objToTime = (obj: { hour: number, minute: number } | null | undefined) => {
  const hour = obj?.hour || 0;
  const minute = obj?.minute || 0;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hour)}:${pad(minute)}`;
};

// --- Esquema Zod (valida strings) ---
const franjaSchema = z.object({
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
});

const horarioSchema = z.object({
  dia: z.string(),
  disponible: z.boolean(),
  franjas: z.array(franjaSchema),
});

const formSchema = z.object({
  horarios: z.array(horarioSchema),
});

type DisponibilidadFormValues = z.infer<typeof formSchema>;

// --- Días de la semana ---
const DIAS_SEMANA = [ "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY" ] as const;
const DIAS_TRADUCIDOS: Record<typeof DIAS_SEMANA[number], string> = {
  MONDAY: "Lunes", TUESDAY: "Martes", WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves", FRIDAY: "Viernes", SATURDAY: "Sábado", SUNDAY: "Domingo"
};

// --- Propiedades ---
interface DisponibilidadFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  guia: Guia;
  onSubmitSuccess: () => void;
}

export default function DisponibilidadForm({ // <--- CORRECCIÓN A EXPORTACIÓN POR DEFECTO
  isOpen,
  onOpenChange,
  guia,
  onSubmitSuccess,
}: DisponibilidadFormProps) {

  // Función para poblar el formulario con los datos del guía
  const getDefaultValues = (): DisponibilidadFormValues => {
    // Si el guía no tiene horarios (es null o undefined), crea un array vacío
    const horariosGuia = guia.horarios || [];
    
    const horariosMap = new Map(horariosGuia.map(h => [h.dia, h]));
    const horariosDefault = DIAS_SEMANA.map(dia => {
      const horarioExistente = horariosMap.get(dia);
      if (horarioExistente) {
        return {
          dia: horarioExistente.dia,
          disponible: horarioExistente.disponible,
          // Convierte el OBJETO del backend a STRING para el formulario
          franjas: (horarioExistente.franjas || []).map(f => ({
            horaInicio: objToTime(f.horaInicio),
            horaFin: objToTime(f.horaFin),
          })),
        };
      }
      // Valor por defecto si no existe
      return { dia, disponible: false, franjas: [] };
    });
    return { horarios: horariosDefault };
  };

  const form = useForm<DisponibilidadFormValues>({
    resolver: zodResolver(formSchema),
    // Los valores por defecto se asignarán con el useEffect
  });

  // Reinicia el formulario CADA VEZ que el guía o el modal cambien
  useEffect(() => {
    if (isOpen) {
      // Carga los valores por defecto del 'guia' actual
      form.reset(getDefaultValues());
    }
  }, [isOpen, guia, form.reset]); 
  

  const { fields } = useFieldArray({
    control: form.control,
    name: "horarios",
  });

  const onSubmit = async (values: DisponibilidadFormValues) => {
    // El payload (values) ya está en el formato de strings "HH:MM"
    const payload: UpdateDisponibilidadPayload = values.horarios.map(
      (horario): HorarioGuiaPayload => ({
        dia: horario.dia as any,
        disponible: horario.disponible,
        franjas: horario.franjas, // Envía los strings "HH:MM"
      })
    );
    
    try {
      await updateDisponibilidad(guia.id, payload);
      toast.success("Disponibilidad actualizada");
      onSubmitSuccess();
    } catch (error) {
       toast.error("Error al actualizar disponibilidad", {
         description: (error as Error).message,
       });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Disponibilidad de: {guia.nombre}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            
            <div className="space-y-4">
              {fields.map((field, diaIndex) => {
                const diaNombre = DIAS_TRADUCIDOS[field.dia as typeof DIAS_SEMANA[number]];
                return (
                  <div key={field.id} className="p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`horarios.${diaIndex}.disponible`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-lg font-semibold">{diaNombre}</FormLabel>
                        </FormItem>
                      )}
                    />

                    {form.watch(`horarios.${diaIndex}.disponible`) && (
                      <FranjasArray control={form.control} diaIndex={diaIndex} />
                    )}
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : "Guardar Disponibilidad"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Sub-componente para manejar las franjas horarias dinámicas
function FranjasArray({ control, diaIndex }: { control: any, diaIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `horarios.${diaIndex}.franjas`,
  });

  return (
    <div className="space-y-2 pl-6">
      {fields.map((field, franjaIndex) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={control}
            name={`horarios.${diaIndex}.franjas.${franjaIndex}.horaInicio`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <span>-</span>
          <FormField
            control={control}
            name={`horarios.${diaIndex}.franjas.${franjaIndex}.horaFin`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(franjaIndex)}>
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ horaInicio: "09:00", horaFin: "12:00" })}
        className="flex items-center gap-1"
      >
        <Plus className="w-4 h-4" />
        Añadir Franja
      </Button>
    </div>
  );
}