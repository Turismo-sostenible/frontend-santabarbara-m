"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PublicNavbar } from "@/components/public-navbar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { register } from "@/service/auth-service"
import { RegisterPayload } from "@/types"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    age: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const TENANT_ID = "01-santa-barbara"
    const API_URL = "https://api-gateway-wi8c.onrender.com/auth/register"

    const payload: RegisterPayload = {
      username: formData.username,
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      age: parseInt(formData.age), // Convertimos la edad a número
      role: "CLIENT"
    }

    try {

      await register(payload, "01-santa-barbara");
      
      toast.success("¡Registro Exitoso!", {
        description: "Tu cuenta ha sido creada. ¡Bienvenido!",
        duration: 3000
      })

      setTimeout(() => {
        router.push('/iniciar-sesion')
      }, 2000)

      /*const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "tenant_id": TENANT_ID,
        },
        body: JSON.stringify({
          ...formData, // Esto copia todo lo que ya tenías (nombre, email, etc.)
          edad: parseInt(formData.age), // Asegúrate de convertir edad a número si es necesario
          role: "CLIENT" // <-- Aquí añades el rol
        })
      })

      if (!response.ok) {
        if (response.status === 400 || response.status === 409) {
          toast.error("Error en el registro. Verifica tus datos e intenta nuevamente.")
        } else {
          //toast.error("Error del servidor. Por favor, intenta más tarde.")
          toast.error("Error en el registro. Usuario o correo electrónico ya registrado.")
        }
        return;
      }

      toast.success("¡Registro Exitoso!", {
        description: "Tu cuenta ha sido creada. ¡Bienvenido!",
        duration: 3000 // 3 segundos
      })

      setTimeout(() => {
        router.push('/iniciar-sesion')
      }, 3000)

      const data = await response.json()*/
      

    }catch (err: any) {
      console.error("Error durante el registro:", err.message)
      toast.error("Error en el registro. Verifica tus datos e intenta nuevamente.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-muted">
      <PublicNavbar />

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif">Crear Cuenta</CardTitle>
            <CardDescription>Completa el formulario para registrarte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input
                  id="edad"
                  name="age"
                  type="number"
                  placeholder="Tu edad"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="address"
                  type="text"
                  placeholder="Calle 123 #45-67"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Registrarse
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link href="/iniciar-sesion" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
