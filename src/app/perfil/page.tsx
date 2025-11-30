"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner" // Para notificaciones bonitas
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Usuario, UserProfile } from "@/types"

export default function PerfilPage() {
  const router = useRouter();


  //'isEditing' controla el modo de "solo lectura"
  const [isEditing, setIsEditing] = useState(false);
  //Estados para los datos del usuario
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  const getUserIdFromStorage = (): string | null => {
    if (typeof window === "undefined") return null;
    const usuarioString = localStorage.getItem("userId"); 
    if (!usuarioString) return null;
    
    if (!usuarioString) {
        console.error("No se encontró userId en localStorage.");
        return null;
      }

    return usuarioString;
  };

  // Hook para cargar los datos del perfil al abrir la página
  useEffect(() => {

    const fetchProfile = async () => {

      const userId = getUserIdFromStorage();
      if(!userId){
          toast.error("Sesión no encontrada. Por favor, inicia sesión.");
          router.push("/iniciar-sesion");
          return;
      }

      try {
        const data: UserProfile = await apiClient.get(`/users/${userId}`); 
        
        setUserData(data); // Guarda los datos originales
        setFormData(data); // Pone los datos en el formulario
        
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        toast.error("No se pudo cargar tu perfil.");
        //router.push("/"); // Si falla, lo saca
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]); // El array vacío [] hace que se ejecute solo una vez

  // Handler para actualizar el 'formData' mientras se escribe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    });
  };

  // Handler para el botón "Cancelar"
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userData); // Restaura el formulario a los datos originales
  };

  // Handler para el formulario (Guardar Cambios)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const userId = getUserIdFromStorage();
    if (!userId) {
      toast.error("Tu sesión ha expirado.");
      router.push("/iniciar-sesion");
      return;
    }

    setIsLoading(true);
    try {
      // Debes crear este endpoint en tu backend (ej: PUT /users/me)
      const updatedData: UserProfile = await apiClient.put(`/users/${userId}`, formData);

      //Actualiza el 'usuario' en localstorage con los datos completos
      //localStorage.setItem("usuario", JSON.stringify(updatedData));

      // Actualiza los datos originales y el formulario
      setUserData(updatedData);
      setFormData(updatedData);
      setIsEditing(false); // Vuelve al modo "solo lectura"
      toast.success("¡Perfil actualizado con éxito!");

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Error al guardar los cambios. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----- ESTADO DE CARGA -----
  if (isLoading && !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando tu perfil...
      </div>
    );
  }

  // ----- VISTA DEL PERFIL -----
  return (
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-3xl">Mi Perfil</CardTitle>
            <CardDescription>
              {isEditing
                ? "Edita tu información personal y guarda los cambios."
                : "Aquí puedes ver tu información personal."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Campo Email (No editable) */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" value={formData?.email || ''} readOnly disabled />
              <p className="text-xs text-muted-foreground">El correo no se puede modificar.</p>
            </div>

            {/* Campo Username */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input 
                id="username" 
                name="username" 
                value={formData?.username || ''} 
                onChange={handleChange} 
                disabled={!isEditing} 
              />
              <p className="text-xs text-muted-foreground">Este será tu nombre público en la plataforma.</p>
            </div>

            {/* Campo Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData?.name || ''} 
                onChange={handleChange} 
                disabled={!isEditing} 
              />
            </div>
            
            {/* Campo Apellido */}
            <div className="space-y-2">
              <Label htmlFor="lastname">Apellido</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                value={formData?.lastName || ''} 
                onChange={handleChange} 
                disabled={!isEditing} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input 
                id="age" 
                name="age" 
                type="number"
                value={formData?.age || 0}
                onChange={handleChange} 
                disabled={!isEditing} 
              />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            
            {/*Renderizado condicional de los botones */}
            {isEditing ? (
              <>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleCancel} 
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            )}

          </CardFooter>
        </Card>
      </form>
  );
}