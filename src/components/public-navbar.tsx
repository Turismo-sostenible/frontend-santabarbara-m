"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain } from "lucide-react"

import { useEffect, useState } from "react"
import { UserProfileButton } from "./user-profile-button"

export function PublicNavbar() {
  //Estado para verificar si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //Efecto para verificar si el usuario está logueado
  useEffect(() => {
    //Revisar si el componente se está ejecutando en el cliente
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        setIsLoggedIn(true)
      }
    }
  }, [])//Se ejecuta solo una vez al montar el componente

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-xl">
          <Mountain className="w-6 h-6 text-primary" />
          <span>SantaBarbara</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/planes" className="text-sm font-medium hover:text-primary transition-colors">
            Planes
          </Link>
          {/* Renderizado Condicional */}
          {isLoggedIn ? (
            //Si esta logueado, muestra el boton de perfil
            <UserProfileButton/>
          ):(
            //Si no esta logueado, muestra los botones publicos
            <>
            <Link href="/iniciar-sesion" className="text-sm font-medium hover:text-primary transition-colors">
              Iniciar Sesión
            </Link>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="/registro">Registro</Link>
            </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
