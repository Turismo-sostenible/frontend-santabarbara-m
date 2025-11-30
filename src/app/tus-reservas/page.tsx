"use client"

import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/public-navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2 } from "lucide-react"

// Importamos los servicios y tipos actualizados
import { getMisReservas, cancelarReserva } from "@/service/reservas-service"
import { getPlanes } from "@/service/planes-service"
import type { Reserva, Plan } from "@/types"

export default function TusReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      // Cargamos reservas y planes en paralelo para poder mostrar los nombres de los planes
      const [reservasData, planesData] = await Promise.all([
        getMisReservas(),
        getPlanes()
      ])
      setReservas(reservasData)
      setPlanes(planesData)
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return

    try {
      setCancelling(id)
      await cancelarReserva(id)
      // Recargar la lista después de cancelar
      await cargarDatos()
    } catch (error) {
      alert("Error al cancelar la reserva")
      console.error(error)
    } finally {
      setCancelling(null)
    }
  }

  // Helper para encontrar el nombre del plan basado en el ID o objeto guardado
  const getNombrePlan = (planRef: string | Plan) => {
    if (typeof planRef === 'object') return planRef.nombre
    const planEncontrado = planes.find(p => p.id === planRef)
    return planEncontrado ? planEncontrado.nombre : "Plan desconocido"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Helper para mostrar estado con estilo
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return <Badge className="bg-green-600">Confirmada</Badge>
      case "CANCELADA":
        return <Badge variant="destructive">Cancelada</Badge>
      case "PENDIENTE":
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Mis Reservas</CardTitle>
            <CardDescription>
              Gestiona tus próximas aventuras y revisa tu historial
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reservas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No tienes reservas registradas.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserva ID</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservas.map((reserva) => (
                      <TableRow key={reserva.reservaId}>
                        <TableCell className="font-medium font-mono text-xs">
                          {reserva.reservaId}
                        </TableCell>
                        <TableCell>{getNombrePlan(reserva.plan)}</TableCell>
                        <TableCell>
                          {new Date(reserva.fechaReserva).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{reserva.participantes}</TableCell>
                        <TableCell>{formatPrice(reserva.precioTotal)}</TableCell>
                        <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                        <TableCell className="text-right">
                          {reserva.estado !== "CANCELADA" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelar(reserva.reservaId)}
                              disabled={cancelling === reserva.reservaId}
                              title="Cancelar Reserva"
                            >
                              {cancelling === reserva.reservaId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}