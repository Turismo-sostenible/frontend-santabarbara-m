"use client";

import { PublicNavbar } from "@/components/public-navbar"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getReservas } from "@/service/reservas-service"
import { Reserva } from "@/types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ReservaForm } from "./reservas-form"


export default function PlanesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

    // Cargar todos las reservas
    const fetchReservas = async () => {
        setIsLoading(true);
        try {
            const data = await getReservas();
            setReservas(data);
        } catch (error) {
            toast.error("Error al cargar reservas", {
                description: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleEdit = (reserva: Reserva) => {
        setSelectedReserva(reserva);
        setIsFormOpen(true);
    };

    const onFormSubmit = () => {
        fetchReservas();
        setIsFormOpen(false);
    };

    if (isLoading) return <div>Cargando reservas...</div>;

    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">Tus Reservas</h1>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plan</TableHead>
                                <TableHead>Guía</TableHead>
                                <TableHead>Participantes</TableHead>
                                <TableHead>Refrigerio</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        No hay reservas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reservas.map((reserva) => (
                                    <TableRow key={reserva.reservaId}>
                                        <TableCell>
                                            {typeof reserva.plan === "object"
                                                ? reserva.plan.nombre
                                                    ? reserva.plan.nombre
                                                    : `Plan #${reserva.plan.id}`
                                                : reserva.plan}
                                        </TableCell>
                                        <TableCell>
                                            {typeof reserva.guia === "object"
                                                ? reserva.guia.nombre
                                                    ? reserva.guia.nombre
                                                    : `Guía #${reserva.guia.id}`
                                                : reserva.guia}
                                        </TableCell>
                                        <TableCell>{reserva.participantes ?? "—"}</TableCell>
                                        <TableCell>{reserva.refrigerio}</TableCell>
                                        <TableCell>
                                            {reserva.fechaReserva
                                                ? new Date(reserva.fechaReserva).toLocaleDateString("es-CO", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })
                                                : "—"}
                                        </TableCell>
                                        <TableCell>{reserva.precioTotal ? `$${reserva.precioTotal}` : "—"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(reserva)}>
                                                        Editar
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
            </div>
            <ReservaForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                reserva={selectedReserva}
                onSubmitSuccess={onFormSubmit}
            />
        </div>
    )
}
