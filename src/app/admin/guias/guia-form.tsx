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
import type { Guia, CreateGuiaPayload, UpdateGuiaPayload } from "@/types";
import { createGuia, updateGuia } from "@/service/guias-service";
import { useEffect } from "react";

// Esquema de validación del formulario
const formSchema = z.object({
  nombre: z.string().min(3, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "Teléfono requerido"),
});

type GuiaFormValues = z.infer<typeof formSchema>;

interface GuiaFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  guia: Guia | null; // null para 'crear', Guia para 'editar'
  onSubmitSuccess: () => void;
}

export default function GuiaForm({ 
  isOpen,
  onOpenChange,
  guia,
  onSubmitSuccess,
}: GuiaFormProps) {
  const isEditMode = !!guia;

  const form = useForm<GuiaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    },
  });

  // Carga los datos del guía en el formulario cuando se abre en modo edición
  useEffect(() => {
    if (isEditMode) {
      form.reset({
        nombre: guia!.nombre, 
        email: guia!.email,
        telefono: guia!.telefono,
      });
    } else {
      form.reset({
        nombre: "",
        email: "",
        telefono: "",
      });
    }
  }, [guia, form, isEditMode, isOpen]); 

  const onSubmit = async (values: GuiaFormValues) => {
    try {
      if (isEditMode) {
        // Modo Edición
        const payload: UpdateGuiaPayload = values;
        await updateGuia(guia!.id, payload);
        toast.success("Guía actualizado");
      } else {
        // Modo Creación
        const payload: CreateGuiaPayload = values;
        await createGuia(payload);
        toast.success("Guía creado exitosamente");
      }
      onOpenChange(false); // Cierra el modal al éxito
      onSubmitSuccess(); // Llama al callback para recargar la tabla
    } catch (error) {
      toast.error(`Error al ${isEditMode ? "actualizar" : "crear"}`, {
        description: (error as Error).message,
      });
    }
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Guía" : "Crear Nuevo Guía"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ejemplo@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="3101234567" {...field} />
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
                {form.formState.isSubmitting
                  ? "Guardando..."
                  : isEditMode
                  ? "Guardar Cambios"
                  : "Crear Guía"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}