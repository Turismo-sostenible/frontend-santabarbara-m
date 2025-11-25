"use client"

import type React from "react"
import { useState } from "react"
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
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { useTheme } from "next-themes" // <-- Para el modo oscuro
import { Switch } from "@/components/ui/switch"

export default function ConfiguracionPage() {
  const { setTheme, theme } = useTheme(); // Hook para el modo oscuro
  const [isLoading, setIsLoading] = useState(false);

  // Estado para el formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handler para los inputs de contraseña
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handler para guardar la nueva contraseña
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Validación simple
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Llama a tu backend (necesitarás crear este endpoint)
      await apiClient.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("¡Contraseña actualizada con éxito!");
      // 3. Limpia el formulario
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);
      toast.error(error.message || "Error al actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----- VISTA -----
  return (
    <div className="grid grid-cols-1 gap-8">
      
      {/* --- TARJETA 1: APARIENCIA (Modo Oscuro) --- */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Apariencia</CardTitle>
          <CardDescription>
            Personaliza la apariencia de la aplicación en tu navegador.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="flex p-1"> {/* Este div empuja el contenido a la derecha */}
            <div className="flex items-center gap-x-4"> {/* Este div alinea el texto y el switch */}
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Modo Oscuro</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Activa o desactiva el tema oscuro.
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- TARJETA 2: SEGURIDAD (Cambiar Contraseña) --- */}
      <Card>
        <form onSubmit={handleSubmitPassword}>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Seguridad</CardTitle>
            <CardDescription>
              Actualiza tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Actualizar Contraseña"}
            </Button>
          </CardFooter>
        </form>
      </Card>

    </div>
  );
}