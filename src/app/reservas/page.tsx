"use client"

import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/public-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Plan = {
    id: string
    nombre: string
    descripcion: string
    precio: number
    duracion: string
    imagen: string
}

type ReservasPageProps = {
    cantidad: number
}


export default function ReservasPage() {
    const [plan, setPlan] = useState<Plan | null>(null)
    const [cantidad, setCantidad] = useState<number>(1)

    useEffect(() => {
        try {
            const s = sessionStorage.getItem("selectedPlan")
            if (s) setPlan(JSON.parse(s))
        } catch (e) {
            console.error("Failed to read selectedPlan from sessionStorage", e)
        }
    }, [])

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price)

    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />
            <main className="max-w-4xl mx-auto p-6">
                {!plan ? (
                    <div className="py-12 text-center">
                        <h2 className="text-xl font-semibold">No hay ningún plan seleccionado</h2>
                        <p className="text-sm text-muted-foreground mt-2">Vuelve a la página de planes y elige uno para reservar.</p>
                    </div>
                ) : (
                    <Card className="w-full max-w-md">
                        <CardHeader className="space-y-8">
                            <CardTitle className="text-2xl font-serif">{plan.nombre}</CardTitle>
                            <CardDescription>
                                <div className="text-muted-foreground mb-4">{plan.descripcion}</div>
                                <div className="flex items-center gap-4 text-sm mb-4">
                                    <div className="font-semibold text-primary">{formatPrice(plan.precio)}</div>
                                    <div className="text-muted-foreground">Duración: {plan.duracion}</div>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1">
                                        <div className="space-y-2">
                                            <Label htmlFor="cantidad">Cantidad</Label>
                                            <Input
                                                id="cantidad"
                                                type="number"
                                                placeholder="cantidad de personas"
                                                value={cantidad}
                                                onChange={(e) => setCantidad(Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div >
    )
}
