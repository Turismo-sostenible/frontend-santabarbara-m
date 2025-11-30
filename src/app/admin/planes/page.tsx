"use client"

import { useState, useEffect } from "react"
import { getPlanes, deletePlan } from "@/service/planes-service"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { Plan } from "@/types"
import { toast } from "sonner"

export default function AdminPlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPlanes()
  }, [])

  const loadPlanes = async () => {
    try {
      setIsLoading(true)
      const data = await getPlanes()
      setPlanes(data)
    } catch (error) {
      console.error("Error al cargar planes:", error)
      toast.error("Error al cargar los planes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      setIsDeleting(true)
      await deletePlan(deleteId)
      // Actualiza el estado localmente para reflejar la eliminación
      setPlanes(planes.filter((p) => p.id !== deleteId))
      toast.success("Plan eliminado exitosamente")
      setDeleteId(null)
    } catch (error) {
      console.error("Error al eliminar plan:", error)
      toast.error("Error al eliminar el plan")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  // En el mock, las imágenes están en /public, así que solo usamos la ruta directamente.
  // Mantenemos la lógica original con una simplificación.
  const getImageUrl = (imagePath?: string): string => {
    // Si la imagen es una ruta relativa (ej: /mountain-hiking-trail.png)
    if (imagePath && imagePath.startsWith("/")) {
        return imagePath
    }
    // Si la imagen ya es una URL completa (aunque el mock no la usa)
    if (imagePath && imagePath.startsWith("http")) {
        return imagePath
    }
    return "/placeholder.svg?text=No+Image" // Fallback si no hay ruta o es inválida
  }

  const planToDelete = planes.find((p) => p.id === deleteId)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold">Gestión de Planes</h1>
          <p className="text-muted-foreground mt-2">
            Crea, edita y elimina los planes turísticos de la plataforma.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/planes/crear">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Plan
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando planes...</p>
        </div>
      ) : planes.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No hay planes creados</p>
          <Button asChild>
            <Link href="/admin/planes/crear">Crear el primer plan</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Cupo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planes.map((plan) => {
                const precio = plan.precio?.valor ?? plan.precioValor;
                const primeraImagen = plan.imagenes && plan.imagenes.length > 0 ? plan.imagenes[0] : undefined;

                return (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <img
                        src={getImageUrl(primeraImagen)}
                        alt={plan.nombre}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = "/placeholder.svg?text=No+Image"
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link href={`/planes/${plan.id}`} className="hover:underline">
                        {plan.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>{formatPrice(precio)}</TableCell>
                    <TableCell>{plan.duracion} h</TableCell>
                    <TableCell>{plan.cupoMaximo} pers.</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          plan.estado === "ACTIVO"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {plan.estado || "PENDIENTE"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/planes/${plan.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )})}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      {/* Usamos el estado deleteId para controlar si el diálogo está abierto */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Plan</DialogTitle>
            <DialogDescription>
              <div className="flex items-center space-x-2 mt-4 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>
                    ¿Estás seguro de que deseas eliminar el plan "
                    <span className="font-semibold">{planToDelete?.nombre}</span>"?
                    Esta acción no se puede deshacer.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}