"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain, LayoutDashboard } from "lucide-react"
import { useEffect, useState } from "react"
import { UserProfileButton } from "./user-profile-button"
import { decodeJwt } from "@/lib/utils"

export function PublicNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      
      if (token) {
        setIsLoggedIn(true)
        
        const decodedToken = decodeJwt(token)
        
        if (decodedToken) {
          
          if (decodedToken.roles && Array.isArray(decodedToken.roles)) {
             if (decodedToken.roles.includes("ADMINISTRATOR")) {
                setUserRole("ADMINISTRATOR")
             } else {
                setUserRole("CLIENT")
             }
          } 
          // Fallback por si en el futuro cambia a singular
          else if (decodedToken.role === "ADMINISTRATOR") {
             setUserRole("ADMINISTRATOR")
          }
        }
      }
    }
  }, [])

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-xl">
          <Mountain className="w-6 h-6 text-primary" />
          <span>SantaBarbara</span>
        </Link>

        <div className="flex items-center gap-6">
          
          {/* El botón ahora sí aparecerá si userRole se setea correctamente arriba */}
          {isMounted && userRole === "ADMINISTRATOR" && (
            <Button variant="ghost" asChild className="text-sm font-medium">
              <Link href="/admin/guias" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Panel de Control
              </Link>
            </Button>
          )}

          <Link href="/planes" className="text-sm font-medium hover:text-primary transition-colors">
            Planes
          </Link>

          <Link 
            href={isLoggedIn ? "/tus-reservas" : "/iniciar-sesion"} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Tus Reservas
          </Link>

          {isMounted && isLoggedIn ? (
            <UserProfileButton/>
          ):(
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