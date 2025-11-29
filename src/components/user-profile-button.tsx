"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { CircleUserRound } from "lucide-react"
import { clearAuthData } from "@/lib/api"


export function UserProfileButton() {
  const router = useRouter()

  const handleLogout = () => {
    clearAuthData();
    window.location.href = "/iniciar-sesion" 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full border-2 border-transparent hover:border-primary p-0.5">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <CircleUserRound className="w-5 h-5"/>
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/perfil')}>
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/perfil/configuracion')}>Configuración</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}