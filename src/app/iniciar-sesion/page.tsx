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
import { login } from "@/service/auth-service"

import { apiClient, saveAuthData, saveUserId } from "@/lib/api";
import { AuthResponse, LoginPayload } from "@/types";

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
      // Prepara el payload que espera el servicio
      const credentials: LoginPayload = { email, password };

      console.log("Enviando estas credenciales:", credentials);
      console.log("Con este Tenant ID:", TENANT_ID);
      
      // Llama al servicio 'login' 
      const data: AuthResponse = await login(credentials, TENANT_ID);

      // Decodifica el token
      const decodedToken = parseJwt(data.accessToken)
      if (!decodedToken || !decodedToken.sub || !decodedToken.roles) {
        setError("Token inválido o incompleto.");
        return;
      }
      //Guarda el id del usuario
      const userId = decodedToken.sub;
      saveUserId(userId);
      //Redirige segun el rol
      if (decodedToken && decodedToken.roles) {
        if (decodedToken.roles.includes("ADMINISTRATOR")) {
          router.push("/admin/guias");
        } else if (decodedToken.roles.includes("CLIENT")) {
          router.push("/planes");
        } else {
          router.push("/");
        }
      } else {
        console.error("Token inválido o no contiene la propiedad 'roles'.");
        router.push("/"); 
      }
      //----------------------------------------
      /*
      const data : AuthResponse = await apiClient.post("/auth/login", { 
        email: email,
        password: password
      }, { headers: { "tenant_id": TENANT_ID } });

      // 2. Verificas la respuesta (¡aquí está el cambio!)
      if (!data.accessToken || !data.usuario) {
        console.error("Respuesta de autenticación incompleta:", data);
        setError("Error: No se recibió la información completa del usuario.");
        return;
      }

      // 3. ¡MODIFICACIÓN CLAVE!
      // Guardamos el ID directamente desde 'data.usuario.id'
      saveAuthData(data, TENANT_ID);

      // 4. Aún necesitamos decodificar el token para los ROLES
      // (a menos que data.usuario.roles también exista, en ese caso, ¡úsalo!)
      const decodedToken = parseJwt(data.accessToken)
      
      if (decodedToken && decodedToken.roles) {
        if (decodedToken.roles.includes("ADMINISTRATOR")) {
          router.push("/admin/guias");
        } else if (decodedToken.roles.includes("CLIENT")) {
          router.push("/planes");
        } else {
          router.push("/");
        }
      } else {
        console.error("Token inválido o no contiene la propiedad 'roles'.");
        router.push("/"); 
      }*/
      //-----------------------------------------------
      /*saveAuthData(data);

      //const data = await response.json()
      console.log("Inicio de sesión exitoso:", data.accessToken);
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
          router.push("/admin/guias");
        } else if (decodedToken.roles.includes("CLIENT")) {
          router.push("/planes");
        }
      } else {
        console.error("Token inválido o no contiene la propiedad 'roles'.");
        window.location.assign("/"); 
      }*/

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
                  minLength={8}
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
