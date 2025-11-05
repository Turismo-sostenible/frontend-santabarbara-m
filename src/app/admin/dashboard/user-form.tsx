// src/app/admin/guias/guia-form.tsx
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
import type { Usuario, CreateUserPayload, UpdateUserPayload } from "@/types";
import { useEffect } from "react";

const ROLES = ["CLIENT", "ADMINISTRATOR", "TOURIST_GUIDE"] as const;

// Esquema de validación del formulario
const formSchema = z.object({
  name: z.string().min(3, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum(ROLES, {
    errorMap: () => ({ message: "Rol inválido" }),
  }),
});

type UsuarioFormValues = z.infer<typeof formSchema>;

interface UsuarioFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null; // null para 'crear', Usuario para 'editar'
  onSubmitSuccess: (usuario: Usuario) => void;
}

export function UsuarioForm({
  isOpen,
  onOpenChange,
  usuario,
  onSubmitSuccess,
}: UsuarioFormProps) {
  const isEditMode = !!usuario;

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "CLIENT", // Valor por defecto
    },
  });

  // Carga los datos del usuario en el formulario cuando se abre en modo edición
  useEffect(() => {
    if (isEditMode && usuario) {
      form.reset({
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: "CLIENT",
      });
    }
  }, [usuario, form, isEditMode, isOpen]); // Depende de 'isOpen' para resetear al abrir

  const onSubmit = async (values: UsuarioFormValues) => {
    if(isEditMode && usuario) {
      const updatedUsuario: Usuario = {
        ...usuario,
        ...values,
      };
      onSubmitSuccess(updatedUsuario);
      toast.success("Usuario actualizado");
    } else {
      const newUsuario: Usuario = {
        id: Math.random().toString(36).substr(2, 9), // ID aleatorio simulado
        ...values,
      };
      onSubmitSuccess(newUsuario);
      toast.success("Usuario creado exitosamente");
    }
      /*try {
        if (isEditMode) {
          // Modo Edición
          const payload: UpdateUserPayload = values;
          await updateUser(usuario.id, payload);
          toast.success("Usuario actualizado");
        } else {
          // Modo Creación
          const payload: CreateUserPayload = values;
          await createUser(payload);
          toast.success("Usuario creado exitosamente");
        }
        onSubmitSuccess(); // Llama al callback para recargar la tabla y cerrar
      } catch (error) {
        toast.error(`Error al ${isEditMode ? "actualizar" : "crear"}`, {
          description: (error as Error).message,
        });
      }*/
    };


  return ( 
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
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
              name="role"
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