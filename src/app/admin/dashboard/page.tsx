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

  import type {Usuario } from "@/types";

  const FAKE_USUARIOS: Usuario[] = [
    { 
      id: '1', 
      name: 'Ana López (Guía)', 
      email: 'ana.lopez@example.com', 
      role: "ADMINISTRATOR",
    },
    { 
      id: '2', 
      name: 'Carlos Ruiz (Cliente)', 
      email: 'carlos.ruiz@example.com', 
      role: "CLIENT"
    },
    { 
      id: '3', 
      name: 'Admin (Admin)', 
      email: 'admin@example.com', 
      role: "TOURIST_GUIDE"
    },
  ];

  // Importa los formularios que crearemos a continuación
  import { UsuarioForm } from "./user-form";

  export default function AdminPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>(FAKE_USUARIOS);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados para controlar los modales
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDispoOpen, setIsDispoOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

    // Cargar todos los usuarios
    /*const fetchUsuarios = async () => {
      setIsLoading(true);
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        toast.error("Error al cargar usuarios", {
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchUsuarios();
    }, []);*/


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

      /*try {
        await deleteUsuario(id);
        toast.success("Usuario eliminado");
        fetchUsuarios(); // Recarga la lista
      } catch (error) {
        toast.error("Error al eliminar usuario", {
          description: (error as Error).message,
        });
      }*/
      setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.id !== id));
      toast.success("Usuario eliminado");
    };

    // Callback para cuando un formulario se completa
    const onFormSubmit = () => {
      //fetchUsuarios();
      setIsFormOpen(false); 
      setIsDispoOpen(false); 
    };

    //if (isLoading) return <div>Cargando usuarios...</div>;

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
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
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

        {/* Modal para Crear/Editar Usuario */}
        <UsuarioForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          usuario={selectedUsuario}
          onSubmitSuccess={onFormSubmit}
        />
      </div>
    );
  }