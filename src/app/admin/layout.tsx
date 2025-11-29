// src/app/admin/layout.tsx
"use client"

import Link from "next/link";
import { Home, Users, Briefcase, LogOut } from "lucide-react";
import React from "react";
import { Toaster } from "@/components/ui/sonner";

import { usePathname } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { clearAuthData } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home", icon: Briefcase},
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/guias", label: "Guías", icon: Users },
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
      <nav className="w-64 bg-muted/40 p-6 border-r flex flex-col">
        <h2 className="text-xl font-bold mb-6">Panel Admin</h2>

        <ul className="space-y-2">
        {navLinks.map((link) => {
            // Comprueba si el enlace actual es el activo
            const isActive = pathname === link.href;

            return (
              <li key={link.label}>
                <Button
                  asChild // Permite que el Botón se comporte como un Link
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
          {/* 
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
            >
              <Briefcase className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
            >
              <Home className="w-5 h-5" />
              <span>Usuarios</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/guias"
              className="flex items-center gap-3 p-2 rounded-lg bg-primary text-primary-foreground" // Resaltado
            >
              <Users className="w-5 h-5" />
              <span>Guías</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/planes"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
            >
              <Briefcase className="w-5 h-5" />
              <span>Planes</span>
            </Link>
          </li>*/}
        </ul>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesion
        </Button>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
      
      
      <Toaster richColors />
    </div>
  );
}