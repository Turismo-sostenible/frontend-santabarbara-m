"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PublicNavbar } from "@/components/public-navbar"
import { useRouter } from "next/navigation"

import { apiClient, saveAuthData } from "@/lib/api";
import { AuthResponse } from "@/types";

function parseJwt(token: string) {
  if (!token) { return null; }
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al decodificar el JWT:", e);
    return null;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state before new submission

    const TENANT_ID = "01-santa-barbara"
    //const API_URL = "https://api-gateway-wi8c.onrender.com/auth/login"

    try{
      const data : AuthResponse = await apiClient.post("/auth/login", { 
        email: email,
        password: password
      }, { headers: { "tenant_id": TENANT_ID } });
      /*const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "tenant_id": TENANT_ID,
        },
        body: JSON.stringify({ 
          email: email,
          password: password
        }),
      })*/
      saveAuthData(data);

      //const data = await response.json()
      console.log("Inicio de sesión exitoso:", data.accessToken);

      // --- MODIFICACIÓN 1 ---
      // Vamos a ver qué nos da el servidor exactamente
      console.log("Inicio de sesión exitoso. Data recibida:", data)

      if (!data.accessToken) {
        console.error("La respuesta del servidor no contiene un 'token'.");
        setError("Error: No se recibió un token del servidor.");
        return; // Detener la ejecución si no hay token
      }

      localStorage.setItem("token", data.accessToken);

      const decodedToken = parseJwt(data.accessToken)

      console.log("Token decodificado:", decodedToken);

      if (decodedToken && decodedToken.roles) {
        if (decodedToken.roles.includes("ADMINISTRATOR")) {
          // Redirigir usando el objeto window
          window.location.assign("/admin/guias");
        } else if (decodedToken.roles.includes("CLIENT")) {
          window.location.assign("/planes");
        }
      } else {
        console.error("Token inválido o no contiene la propiedad 'roles'.");
        window.location.assign("/"); 
      }

    }catch (err: any) {
      setError(err.message)
      console.error("Error al iniciar sesión:", err)
    }
  }
  return (
    <div className="min-h-screen bg-muted">
      <PublicNavbar />

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tu correo y contraseña para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/recuperar-contrasena" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Link href="/registro" className="text-primary hover:underline font-medium">
                Regístrate aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
