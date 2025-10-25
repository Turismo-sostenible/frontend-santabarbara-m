"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PublicNavbar } from "@/components/public-navbar"
import { ArrowLeft } from "lucide-react"

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password recovery logic
    console.log("Recover password for:", email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-muted">
      <PublicNavbar />

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif">Recuperar Contraseña</CardTitle>
            <CardDescription>
              {submitted
                ? "Revisa tu correo para restablecer tu contraseña"
                : "Ingresa tu correo para recibir un enlace de restablecimiento"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
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

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Enviar Enlace
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    Hemos enviado un enlace de restablecimiento a <strong>{email}</strong>. Por favor revisa tu bandeja
                    de entrada y sigue las instrucciones.
                  </p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setSubmitted(false)}>
                  Enviar de nuevo
                </Button>
              </div>
            )}

            <div className="mt-6">
              <Link href="/iniciar-sesion" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Volver a iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
