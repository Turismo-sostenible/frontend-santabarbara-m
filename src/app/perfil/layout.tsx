// app/perfil/layout.tsx

import React from "react";
import { PublicNavbar } from "@/components/public-navbar"; // Asumo que quieres la navbar principal arriba
import { ProfileSidebarNav } from "@/components/profile-sidebar-nav"; // Este lo crearemos ahora
import { Toaster } from "@/components/ui/sonner";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* 1. Tu Navbar principal (si la quieres aquí) */}
      <PublicNavbar />

      {/* 2. Contenedor del Dashboard */}
      <div className="flex max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 gap-10">
        
        {/* 3. La Barra Lateral de Navegación */}
        <aside className="w-1/4 lg:w-1/5">
          <ProfileSidebarNav />
        </aside>

        {/* 4. El Contenido (aquí se renderizará tu formulario de perfil, mis reservas, etc.) */}
        <main className="w-3/4 lg:w-4/5">
          {children}
        </main>
        <Toaster richColors />
      </div>
    </div>
  );
}