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

import type { Usuario } from "@/types";
// CORRECCIÓN: Importamos como default
import UsuarioForm from "./user-form"; 

const FAKE_USUARIOS: Usuario[] = [
  { id: '1', name: 'Ana López', email: 'ana.lopez@unicauca.edu.co', role: "ADMINISTRATOR" },
  { id: '2', name: 'Carlos Ruiz', email: 'carlos.ruiz@unicauca.edu.co', role: "CLIENT" }, 
  { id: '3', name: 'Admin', email: 'admin@unicauca.edu.co', role: "TOURIST_GUIDE" },
];

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  // Carga inicial y persistencia en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("usuarios_db");
      if (storedUsers) {
        setUsuarios(JSON.parse(storedUsers));
      } else {
        localStorage.setItem("usuarios_db", JSON.stringify(FAKE_USUARIOS));
        setUsuarios(FAKE_USUARIOS);
      }
    }
  }, []);

  // FUNCIÓN AUXILIAR PARA GUARDAR EN ESTADO Y EN LOCALSTORAGE A LA VEZ
  const updateUsuariosState = (newUsuarios: Usuario[]) => {
    setUsuarios(newUsuarios);
    localStorage.setItem("usuarios_db", JSON.stringify(newUsuarios)); 
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsFormOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;

    // Calculamos la nueva lista
    const nuevaLista = usuarios.filter((usuario) => usuario.id !== id);
    
    // Usamos nuestra función especial que guarda en LocalStorage
    updateUsuariosState(nuevaLista); 
    toast.success("Usuario eliminado correctamente");

  };

  const onFormSubmit = (usuarioData: Usuario) => {
    let nuevaLista: Usuario[];

    if (selectedUsuario) {
      // EDITAR
      nuevaLista = usuarios.map((u) => 
        (u.id === selectedUsuario.id ? { ...u, ...usuarioData } : u)
      );
      toast.success("Usuario actualizado");
    } else {
      // CREAR
      const nuevoUsuario: Usuario = { // Aseguramos el tipo
        ...usuarioData,
        id: Math.random().toString(36).substr(2, 9),
      };
      nuevaLista = [...usuarios, nuevoUsuario];
      toast.success("Usuario creado");
    }

    // Guardar en LocalStorage
    updateUsuariosState(nuevaLista);
    // Cierra el formulario
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Crear Usuario
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.role}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(usuario.id)}
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

      <UsuarioForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        usuario={selectedUsuario}
        onSubmitSuccess={onFormSubmit}
      />
    </div>
  );
}