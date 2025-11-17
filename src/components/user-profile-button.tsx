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

// Un ícono simple de usuario, puedes cambiarlo
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM13.5 8.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM11.25 10.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10.5 13.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM12 11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM13.5 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM12.75 13.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM15 11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM14.25 13.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM16.5 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM18.75 16.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM15.75 16.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM12.75 16.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM9.75 16.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM6.75 16.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM4.5 19.5a3 3 0 013-3h9a3 3 0 013 3v.75a.75.75 0 01-1.5 0V19.5a1.5 1.5 0 00-1.5-1.5h-9a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 01-1.5 0V19.5z" clipRule="evenodd" />
    </svg>
  )
}


export function UserProfileButton() {
  const router = useRouter()

  const handleLogout = () => {
    // 1. Limpiar el token de localStorage
    localStorage.removeItem("token")
    // 2. Redirigir a la página de inicio
    // Usamos window.location para forzar recarga y limpiar estado
    window.location.href = "/" 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full border-2 border-transparent hover:border-primary p-0.5">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <UserIcon />
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
        <DropdownMenuItem onClick={() => router.push('/mis-reservas')}>
          Mis Reservas
        </DropdownMenuItem>
        <DropdownMenuItem>Configuración</DropdownMenuItem>
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