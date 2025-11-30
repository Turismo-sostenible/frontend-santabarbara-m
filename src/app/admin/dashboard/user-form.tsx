"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Usuario } from "@/types";
import { useEffect } from "react";

const ROLES = ["CLIENT", "ADMINISTRATOR", "TOURIST_GUIDE"] as const;

// Esquema de validación del formulario (ajustado a los campos mostrados en la tabla)
const formSchema = z.object({
  name: z.string().min(3, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum(ROLES, {
    required_error: "El rol es obligatorio",
  }),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UsuarioFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null; // null para 'crear', Usuario para 'editar'
  // El callback debe recibir el Usuario completo con los datos actualizados
  onSubmitSuccess: (usuario: Usuario) => void;
}

export default function UsuarioForm({ // <--- CORRECCIÓN CLAVE: EXPORTACIÓN POR DEFECTO
  isOpen,
  onOpenChange,
  usuario,
  onSubmitSuccess,
}: UsuarioFormProps) {
  const isEditMode = !!usuario;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "CLIENT",
    },
  });

  // Carga los datos del usuario en el formulario
  useEffect(() => {
    if (isEditMode && usuario) {
      form.reset({
        name: usuario.name, 
        email: usuario.email,
        // Aseguramos que el rol sea uno de los valores válidos del enum
        role: usuario.role as "CLIENT" | "ADMINISTRATOR" | "TOURIST_GUIDE",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: "CLIENT",
      });
    }
  }, [usuario, form, isEditMode, isOpen]); 

  const onSubmit = (values: UserFormValues) => {
    let finalUsuario: Usuario;

    if (isEditMode && usuario) {
      // EDITAR: Mantiene el ID y otros datos, solo actualiza los campos del formulario
      finalUsuario = {
        ...usuario,
        ...values,
      };
    } else {
      // CREAR: Genera un ID temporal
      finalUsuario = {
        id: Math.random().toString(36).substr(2, 9),
        ...values,
      } as Usuario; // Aseguramos el tipo
    }

    onSubmitSuccess(finalUsuario);
    onOpenChange(false); // Cierra el modal después de la operación
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Editar Usuario: ${usuario?.name}` : "Crear Nuevo Usuario"}
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
                    <Input 
                      placeholder="ejemplo@email.com" 
                      {...field} 
                      disabled={isEditMode} // No se recomienda editar el email/ID
                    />
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
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}