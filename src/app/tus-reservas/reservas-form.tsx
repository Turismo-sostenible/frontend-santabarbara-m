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
import type { Reserva, UpdateReservaPayload } from "@/types";
import { updateReserva } from "@/service/reservas-service";
import { useEffect } from "react";

// Esquema: ajusta nombre de campos a lo que espera tu backend
const formSchema = z.object({
    refrigerio: z.enum(["DESAYUNO", "ALMUERZO", "MERIENDA", "CENA"]),
    fechaReserva: z.string().min(10, "Fecha es requerida"),
});

type ReservaFormValues = z.infer<typeof formSchema>;

interface ReservaFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reserva: Reserva | null;
    onSubmitSuccess: () => void;
}

function formatFecha(date: Date): string {
        // Obtiene los valores con dos dígitos
        const pad = (num: number) => num.toString().padStart(2, '0');
        return [
            date.getFullYear(),
            '-',
            pad(date.getMonth() + 1),
            '-',
            pad(date.getDate()),
            'T',
            pad(date.getHours()),
            ':',
            pad(date.getMinutes()),
            ':',
            pad(date.getSeconds())
        ].join('');
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
            fechaReserva: reserva?.fechaReserva ? reserva.fechaReserva.slice(0, 16) : "",
        },
    });

    useEffect(() => {
        // Al abrir el modal, carga datos de la reserva
        form.reset({
            refrigerio: reserva?.refrigerio || "DESAYUNO",
            fechaReserva: reserva?.fechaReserva ? reserva.fechaReserva.slice(0, 16) : "",
        });
    }, [reserva, form, isOpen]);

    const onSubmit = async (values: ReservaFormValues) => {
        if (!reserva) return; // Solo permite editar

        // Para depurar el payload enviado:
        const payload: UpdateReservaPayload = {
            refrigerio: values.refrigerio,
            fechaReserva: formatFecha(new Date(values.fechaReserva)),
        };
        console.log("Payload enviado:", payload);

        try {
            await updateReserva(reserva.reservaId, payload);
            toast.success("Reserva actualizada");
            onSubmitSuccess();
        } catch (error) {
            toast.error("Error al actualizar reserva", {
                description: (error as Error).message,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Editar Reserva
                    </DialogTitle>
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
                                            className="w-full border rounded px-3 py-2"
                                            {...field}
                                        >
                                            <option value="DESAYUNO">Desayuno</option>
                                            <option value="ALMUERZO">Almuerzo</option>
                                            <option value="MERIENDA">Merienda</option>
                                            <option value="CENA">Cena</option>
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
                                            value={field.value}
                                            onChange={field.onChange}
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
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
