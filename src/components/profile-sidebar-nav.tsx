// components/profile-sidebar-nav.tsx

"use client"; // ¡Importante! Para usar hooks y onClick

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearAuthData } from "@/lib/api"; // Importa tu función de logout

// Importa iconos de lucide-react (¡ya los tienes!)
import { 
  User, 
  Settings, 
  LogOut, 
  CalendarDays 
} from "lucide-react";

// Lista de enlaces de navegación
const navItems = [
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
  },
  {
    href: "/perfil/mis-reservas",
    label: "Mis Reservas",
    icon: CalendarDays,
  },
  {
    href: "/perfil/configuracion",
    label: "Configuración",
    icon: Settings,
  },
];

export function ProfileSidebarNav() {
  const pathname = usePathname(); // Hook para saber en qué página estamos
  const router = useRouter();

  const handleLogout = () => {
    clearAuthData(); // Borra los tokens del localStorage
    // Forzamos un refresh completo para limpiar estado
    window.location.href = "/iniciar-sesion"; 
  };

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.label}
          asChild // Permite que el 'Button' se comporte como 'Link'
          variant={pathname === item.href ? "secondary" : "ghost"} // Resalta el enlace activo
          className="justify-start"
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}

      {/* Botón de Cerrar Sesión*/}
      <Button
        variant="ghost"
        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </nav>
  );
}