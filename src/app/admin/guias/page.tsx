// src/app/admin/guias/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import type { Guia } from "@/types";
import { getGuias, deleteGuia } from "@/service/guias-service";

// Importa los formularios que crearemos a continuación
import { GuiaForm } from "./guia-form";
import { DisponibilidadForm } from "./disponibilidad-form";

const FAKE_GUIAS: Guia[] = [
  { 
    id: '1', 
    nombre: 'Ana María López', 
    email: 'ana.lopez@guias.com', 
    telefono: '3101234567', 
    estado: 'Activo',
    horarios: [] // <-- AÑADE ESTA LÍNEA
  },
  { 
    id: '2', 
    nombre: 'Carlos Fernández', 
    email: 'carlos.f@guias.com', 
    telefono: '3207654321', 
    estado: 'Inactivo',
    horarios: [] // <-- AÑADE ESTA LÍNEA
  },
  { 
    id: '3', 
    nombre: 'Sofía Restrepo', 
    email: 'sofia.restrepo@guias.com', 
    telefono: '3001112233', 
    estado: 'Activo',
    horarios: [] // <-- AÑADE ESTA LÍNEA
  },
];

export default function GuiasAdminPage() {
  const [guias, setGuias] = useState<Guia[]>(FAKE_GUIAS);
  //const [isLoading, setIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para controlar los modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDispoOpen, setIsDispoOpen] = useState(false);
  const [selectedGuia, setSelectedGuia] = useState<Guia | null>(null);

  // Cargar todos los guías
  /*const fetchGuias = async () => {
    setIsLoading(true);
    try {
      const data = await getGuias();
      setGuias(data);
    } catch (error) {
      toast.error("Error al cargar guías", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuias();
  }, []);*/


  const handleCreate = () => {
    setSelectedGuia(null);
    setIsFormOpen(true);
  };

  const handleEdit = (guia: Guia) => {
    setSelectedGuia(guia);
    setIsFormOpen(true);
  };
  
  const handleDisponibilidad = (guia: Guia) => {
    setSelectedGuia(guia);
    setIsDispoOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este guía?")) return;

    /*try {
      await deleteGuia(id);
      toast.success("Guía eliminado");
      fetchGuias(); // Recarga la lista
    } catch (error) {
      toast.error("Error al eliminar guía", {
        description: (error as Error).message,
      });
    }*/
    setGuias((prevGuias) => prevGuias.filter((guia) => guia.id !== id));
    toast.success("Guía eliminado");
  };

  // Callback para cuando un formulario se completa
  const onFormSubmit = () => {
    //fetchGuias(); 
    setIsFormOpen(false); 
    setIsDispoOpen(false); 
  };
  
  //if (isLoading) return <div>Cargando guías...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Guías</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Crear Guía
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay guías registrados.
                </TableCell>
              </TableRow>
            ) : (
              guias.map((guia) => (
                <TableRow key={guia.id}>
                  <TableCell className="font-medium">{guia.nombre}</TableCell>
                  <TableCell>{guia.email}</TableCell>
                  <TableCell>{guia.telefono}</TableCell>
                  <TableCell>{guia.estado}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(guia)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDisponibilidad(guia)}>
                          Disponibilidad
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(guia.id)}
                          className="text-red-600"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal para Crear/Editar Guía */}
      <GuiaForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        guia={selectedGuia}
        onSubmitSuccess={onFormSubmit}
      />
      
      {/* Modal para Editar Disponibilidad */}
      {selectedGuia && (
        <DisponibilidadForm
          isOpen={isDispoOpen}
          onOpenChange={setIsDispoOpen}
          guia={selectedGuia}
          onSubmitSuccess={onFormSubmit}
        />
      )}
    </div>
  );
}