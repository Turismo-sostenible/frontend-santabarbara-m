"use client"

import Link from "next/link";
import { Home, Users, Briefcase, LogOut } from "lucide-react";
import React from "react";
import { Toaster } from "@/components/ui/sonner";

import { usePathname } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { clearAuthData } from "@/lib/api";

const navLinks = [
  // 1. Enlace a la página pública principal
  { href: "/", label: "Home Público", icon: Home}, 
  // 2. Enlace a la gestión de Usuarios (Donde tu AdminPage está funcionando)
  { href: "/admin", label: "Usuarios", icon: Users }, 
  // 3. Enlace a la gestión de Guías
  { href: "/admin/guias", label: "Guías", icon: Briefcase },
  // 4. Enlace a la gestión de Planes
  { href: "/admin/planes", label: "Planes", icon: Briefcase },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const handleLogout = () => {
    clearAuthData(); // Limpia localStorage
    // Redirige y fuerza un refresh para limpiar el estado
    window.location.href = "/iniciar-sesion"; 
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar de Navegación */}
      <nav className="w-64 bg-muted/40 p-6 border-r flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Panel Admin</h2>

          <ul className="space-y-2">
          {navLinks.map((link) => {
              // Comprueba si el enlace actual es el activo o si la ruta comienza con el href
              const isActive = 
                  pathname === link.href || 
                  (link.href !== "/" && pathname.startsWith(link.href + "/"));

              return (
                <li key={link.label}>
                  <Button
                    asChild 
                    // variant="default" (negro) si está activo
                    // variant="ghost" (transparente) si no
                    variant={isActive ? "default" : "ghost"}
                    // Clases para alinear el texto a la izquierda y añadir espacio
                    className="w-full justify-start gap-3"
                  >
                    <Link href={link.href}>
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Botón de Logout */}
        <div className="mt-8">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesion
            </Button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
      
      
      <Toaster richColors />
    </div>
  );
}