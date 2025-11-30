"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Asegúrate de que el path sea correcto:
import { updateReserva } from "@/service/reservas-service";
import type { Reserva, UpdateReservaPayload, Plan } from "@/types"; // Importamos Plan para un helper
import { useEffect } from "react";

// Esquema: ajusta nombre de campos a lo que espera tu backend
const formSchema = z.object({
    refrigerio: z.enum(["DESAYUNO", "ALMUERZO", "MERIENDA", "CENA"]),
    fechaReserva: z.string().min(1, "Fecha es requerida"),
});

type ReservaFormValues = z.infer<typeof formSchema>;

interface ReservaFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reserva: Reserva | null;
    onSubmitSuccess: () => void;
}

/**
 * Función para formatear la fecha a ISO 8601 con zona horaria UTC
 * que es lo que suelen esperar los backends para datetime-local
 * @param date - Objeto Date a formatear
 * @returns String en formato YYYY-MM-DDTHH:MM:SS.000Z
 */
function formatFechaToISO(date: Date): string {
    // Si la fecha no es válida, devolvemos un string vacío
    if (isNaN(date.getTime())) return '';

    // Convertir a string ISO y usar slice para obtener hasta el segundo,
    // que es un formato común para APIs de Spring/Java.
    // Usamos toISOString() que produce formato UTC (termina en 'Z')
    return date.toISOString().slice(0, 19); 
}

/**
 * Helper para obtener el ID del plan, sin importar si es un objeto o un string.
 * Si es un objeto Plan, devuelve el nombre. Si es un string, devuelve el string.
 */
function getPlanDisplay(planRef: string | Plan): string {
    if (typeof planRef === 'object' && 'nombre' in planRef) {
        return planRef.nombre;
    }
    return String(planRef);
}


export function ReservaForm({
    isOpen,
    onOpenChange,
    reserva,
    onSubmitSuccess,
}: ReservaFormProps) {
    const form = useForm<ReservaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            refrigerio: reserva?.refrigerio || "DESAYUNO",
            // La fecha viene como string ISO del mock. Para mostrarla en un input 'datetime-local',
            // necesitamos el formato YYYY-MM-DDTHH:MM (slice(0, 16)).
            fechaReserva: reserva?.fechaReserva ? new Date(reserva.fechaReserva).toISOString().slice(0, 16) : "",
        },
    });

    useEffect(() => {
        if (reserva && isOpen) {
            // Asegurarse de que la fecha se formatea correctamente para el input
            const formattedDate = new Date(reserva.fechaReserva).toISOString().slice(0, 16);
            
            form.reset({
                refrigerio: reserva.refrigerio,
                fechaReserva: formattedDate,
            });
        }
    }, [reserva, form, isOpen]);

    const onSubmit = async (values: ReservaFormValues) => {
        if (!reserva) return; 

        // 1. Tomamos el string del input (YYYY-MM-DDTHH:MM) y lo convertimos a un objeto Date.
        const dateObject = new Date(values.fechaReserva);

        // 2. Formateamos el objeto Date al formato ISO completo (UTC) que espera el backend.
        const formattedDateISO = formatFechaToISO(dateObject);

        const payload: UpdateReservaPayload = {
            refrigerio: values.refrigerio,
            fechaReserva: formattedDateISO, 
        };

        try {
            await updateReserva(reserva.reservaId, payload);
            toast.success("Reserva actualizada", {
                description: `ID: ${reserva.reservaId}. Nueva fecha: ${new Date(values.fechaReserva).toLocaleString()}`,
            });
            onOpenChange(false); // Cierra el modal
            onSubmitSuccess(); // Notifica a la página padre para recargar datos
        } catch (error) {
            toast.error("Error al actualizar reserva", {
                description: (error as Error).message,
            });
        }
    };

    const refrigerios = ["DESAYUNO", "ALMUERZO", "MERIENDA", "CENA"];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Editar Reserva ({reserva?.reservaId})
                    </DialogTitle>
                    {/* CORRECCIÓN: Usamos el helper para mostrar el string del plan */}
                    {reserva && <p className="text-sm text-muted-foreground">Plan: {getPlanDisplay(reserva.plan)}</p>} 
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="refrigerio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opción alimentación</FormLabel>
                                    <FormControl>
                                        <select
                                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                            {...field}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            {refrigerios.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fechaReserva"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha y Hora</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            // value se enlaza con el estado del formulario
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={form.formState.isSubmitting || !reserva || reserva.estado === 'CANCELADA'}
                            >
                                {form.formState.isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}