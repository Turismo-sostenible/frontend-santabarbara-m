// src/app/admin/layout.tsx
import Link from "next/link";
import { Home, Users, Briefcase } from "lucide-react";
import React from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar de Navegación */}
      <nav className="w-64 bg-muted/40 p-6 border-r flex flex-col">
        <h2 className="text-xl font-bold mb-6">Panel Admin</h2>
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
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
          </li>
        </ul>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
      
      
      <Toaster richColors />
    </div>
  );
}