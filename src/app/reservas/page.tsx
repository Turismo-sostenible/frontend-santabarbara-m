"use client";

import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/public-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/api"; 
import { createReserva } from "@/service/reservas-service"
import { getGuias } from "@/service/guias-service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CreateReservaPayload, Guia, Plan, HorarioGuia, Usuario } from "@/types"

// Definiciones de refrigerios y métodos de pago (mock)
const REFRIGERIOS = [
    { nombre: "DESAYUNO", precio: 15000 },
    { nombre: "ALMUERZO", precio: 15000 },
    { nombre: "CENA", precio: 15000 },
    { nombre: "MERIENDA", precio: 15000 }
]

const METODOS = [
    {
        nombre: "PSE",
        icon: "/pse.png"
    },
    {
        nombre: "Tarjeta Debito",
        icon: "/mastercard.png"
    },
    {
        nombre: "Tarjeta Credito",
        icon: "/visa.png"
    },
    {
        nombre: "Efecty",
        icon: "/efecty.png"
    }
]

// Helper para obtener el ID del usuario logueado desde localStorage (como lo usa auth-service.ts)
const getCurrentUserId = (): string | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("usuario");
    if (userStr) {
        try {
            const user: Usuario = JSON.parse(userStr);
            return user.id;
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
            return null;
        }
    }
    return null;
}

export default function ReservasPage() {
    // Usamos los tipos Plan y Guia importados de @/types
    const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null)
    const [guias, setGuias] = useState<Guia[]>([]);
    const [guiaSeleccionado, setGuiaSeleccionado] = useState<Guia | null>(null);
    const [participantes, setParticipantes] = useState<number>(2)
    const [refrigerio, setRefrigerio] = useState<string>("")
    // NOTA: Usamos datetime-local format: YYYY-MM-DDTHH:MM
    const [fecha, setFecha] = useState<string>("") 
    const [precioRefrigerio, setPrecioRefrigerio] = useState<number>(0)
    const [showModal, setShowModal] = useState(false)
    const [showMetodoPago, setShowMetodoPago] = useState(false)
    const [pago, setPago] = useState(false)
    const [metodo, setMetodo] = useState("")
    const [loadingReserva, setLoadingReserva] = useState(false)
    const router = useRouter();

    // Obtenemos IDs para el payload
    const currentUserId = getCurrentUserId();
    const guiaId = guiaSeleccionado ? guiaSeleccionado.id : "";
    const planId = planSeleccionado ? planSeleccionado.id : "";
    
    // Asumimos un precio por defecto si el plan no carga o no tiene precio
    const precioPersona = planSeleccionado ? (planSeleccionado.precio?.valor || planSeleccionado.precioValor || 45000) : 45000;
    const kitsTurismo = 10000 // Asumimos costo fijo
    
    // Cálculo total
    const total =
        participantes * precioPersona + participantes * kitsTurismo + participantes * precioRefrigerio

    // Helper para formatear la fecha que va al backend (ISO 8601 con UTC)
    function formatFechaToISO(date: Date): string {
        if (isNaN(date.getTime())) return '';
        // toISOString() produce formato UTC (YYYY-MM-DDTHH:MM:SS.000Z)
        return date.toISOString();
    }

    // 1. Efecto para verificar autenticación y cargar datos iniciales
    useEffect(() => {
        const token = getAuthToken();
        if (!currentUserId || !token) {
            router.push("/iniciar-sesion");
            toast.warning("Sesión expirada o no iniciada", { description: "Por favor, inicia sesión para continuar." });
            return;
        }

        try {
            // Cargar Plan desde sessionStorage
            const s = sessionStorage.getItem("selectedPlan");
            if (s) {
                const parsed: Plan = JSON.parse(s);
                setPlanSeleccionado(parsed);
            } else {
                toast.warning("No se encontró el plan seleccionado. Redirigiendo a Planes.");
                router.push("/planes");
            }

            // Cargar Guías
            getGuias()
                .then(setGuias)
                .catch(e => {
                    console.error("Error cargando guías:", e);
                    toast.error("Error al cargar guías disponibles.");
                });
                
        } catch (e) {
            console.error("Error en useEffect de carga de datos:", e);
            toast.error("Error de carga inicial.");
        }
    }, [router, currentUserId]); // Depende de currentUserId para asegurar la sesión

    // 2. Efecto para recalcular precio del refrigerio
    useEffect(() => {
        const r = REFRIGERIOS.find((r) => r.nombre === refrigerio)
        setPrecioRefrigerio(r ? r.precio : 0)
    }, [refrigerio])

    // Helper de formato de precio
    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price)
    
    // Validación mínima para el botón de reserva inicial
    const isFormValid = planSeleccionado && guiaSeleccionado && fecha && refrigerio && participantes > 0;


    // -- Lógica de Reserva (POST) --
    async function handleConfirmReserva() {
        if (!isFormValid || !planId || !guiaId || !currentUserId) {
            toast.error("Datos incompletos", { description: "Faltan datos esenciales (usuario, plan, guía, fecha, refrigerio)." });
            return;
        }

        // Convertimos el input datetime-local (YYYY-MM-DDTHH:MM) a Date
        const dateObject = new Date(fecha);
        const fechaReservaISO = formatFechaToISO(dateObject);

        const payload: CreateReservaPayload = {
            usuario: currentUserId, // ID del usuario logueado
            guia: guiaId,
            plan: planId, 
            participantes: participantes,
            refrigerio: refrigerio as "DESAYUNO" | "ALMUERZO" | "MERIENDA" | "CENA",
            fechaReserva: fechaReservaISO,
            estado: "CONFIRMADA", // Asumimos CONFIRMADA antes de pagar para el mock
            precioTotal: total
        }

        setLoadingReserva(true)
        try {
            await createReserva(payload)
            // Éxito: pasa a la selección de pago
            setShowModal(true)
            setShowMetodoPago(true)
        } catch (e: any) {
            console.error("Error al guardar la reserva:", e)
            toast.error("Error al guardar la reserva", { description: e.message || "Inténtalo de nuevo." });
        } finally {
            setLoadingReserva(false)
        }
    }


    // Contenido principal de la página
    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />
            <button
                className="m-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-medium"
                onClick={() => router.push("/planes")}
            >
                {" <-- "} Volver a Planes
            </button>
            <main className="max-w-4xl mx-auto space-y-8 pb-12">
                <h2 className="text-center text-3xl font-serif font-bold py-2">
                    {planSeleccionado?.nombre || "Cargando Plan..."}
                </h2>

                {/* Sección de Guía */}
                <Card className="p-6">
                    <label className="block mb-4 font-serif text-xl font-semibold">1. Seleccione un Guía:</label>
                    <select
                        className="mb-6 w-full px-3 py-2 border border-input rounded-md bg-background shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition"
                        value={guiaSeleccionado?.id ?? ""}
                        onChange={e => {
                            const g = guias.find(g => g.id === e.target.value);
                            setGuiaSeleccionado(g || null);
                        }}
                    >
                        <option value="">-- Elija un guía disponible --</option>
                        {guias.map(guia => (
                            <option key={guia.id} value={guia.id} disabled={guia.estado !== 'ACTIVO'}>
                                {guia.nombre} ({guia.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'})
                            </option>
                        ))}
                    </select>
                    {guiaSeleccionado && (
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h4 className="font-semibold">{guiaSeleccionado.nombre}</h4>
                            <div className="text-sm text-muted-foreground">
                                Email: {guiaSeleccionado.email ?? "N/A"} | Tel: {guiaSeleccionado.telefono}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Formulario de Detalles de Reserva y Resumen */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            2. Detalles y Resumen
                            <span className="float-right text-xl font-bold">
                                {formatPrice(precioPersona)}
                                <span className="text-base font-normal text-muted-foreground"> por persona</span>
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Fecha */}
                            <div>
                                <Label htmlFor="fecha">Fecha y Hora</Label>
                                <input
                                    id="fecha"
                                    type="datetime-local"
                                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={fecha}
                                    onChange={e => setFecha(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">Seleccione la fecha y hora de inicio del tour.</p>
                            </div>

                            {/* Participantes */}
                            <div className="flex flex-col">
                                <Label>Participantes</Label>
                                <div className="flex items-center mt-1 border border-input rounded-md bg-background shadow-sm divide-x divide-input">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-r-none h-10 w-10"
                                        onClick={() => setParticipantes(p => Math.max(1, p - 1))}
                                        disabled={participantes <= 1}
                                    >-</Button>
                                    <span className="flex-1 text-center font-semibold py-2">
                                        {participantes}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-l-none h-10 w-10"
                                        onClick={() => setParticipantes(p => Math.min(planSeleccionado?.cupoMaximo || 8, p + 1))}
                                        disabled={participantes >= (planSeleccionado?.cupoMaximo || 8)}
                                    >+</Button>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">
                                    Máximo {planSeleccionado?.cupoMaximo || 8} personas.
                                </span>
                            </div>
                        </div>

                        {/* Refrigerio */}
                        <div className="mb-6">
                            <Label htmlFor="refrigerio">Refrigerio</Label>
                            <select
                                id="refrigerio"
                                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                value={refrigerio}
                                onChange={e => setRefrigerio(e.target.value)}
                                required
                            >
                                <option value="">Selecciona Refrigerio (Opcional)</option>
                                {REFRIGERIOS.map(r => (
                                    <option key={r.nombre} value={r.nombre}>
                                        {r.nombre} ({formatPrice(r.precio)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Resumen de costos */}
                        <div className="bg-gray-100 p-4 rounded-lg space-y-1 text-sm border">
                            <div className="flex justify-between">
                                <span>Precio Base ({planSeleccionado?.nombre || 'Plan'}) x{participantes}</span>
                                <span>{formatPrice(participantes * precioPersona)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>KITs de Turismo x{participantes}</span>
                                <span>{formatPrice(participantes * kitsTurismo)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Refrigerio ({refrigerio || 'Ninguno'}) x{participantes}</span>
                                <span>{formatPrice(participantes * precioRefrigerio)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 text-primary text-lg">
                                <span>Total a Pagar</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Botón de Reserva */}
                        <Button
                            className="w-full py-3 text-lg"
                            onClick={() => {
                                if (!isFormValid) {
                                    toast.warning("Faltan datos", { description: "Por favor, selecciona guía, fecha y refrigerio." });
                                    return;
                                }
                                setShowModal(true); // Abrir Modal 1 (Confirmación)
                            }}
                            disabled={!isFormValid || loadingReserva}
                            type="button"
                        >
                            {loadingReserva ? "Procesando..." : "Reservar y Pagar ahora"}
                        </Button>
                    </CardContent>
                </Card>

                {/* MODAL 1: Confirmación de reserva (Adaptado a la interfaz actual) */}
                {showModal && !showMetodoPago && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-background shadow-lg rounded-xl p-8 w-full max-w-lg relative">
                            <button
                                aria-label="Cerrar"
                                className="absolute right-3 top-3 text-2xl text-muted-foreground hover:text-foreground"
                                onClick={() => setShowModal(false)}
                            >x</button>
                            <div className="bg-muted rounded-lg p-6">
                                <h3 className="font-bold text-2xl mb-4">Confirmación de Reserva</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold">Plan:</span> {planSeleccionado?.nombre || 'N/A'}</p>
                                    <p><span className="font-semibold">Guia:</span> {guiaSeleccionado?.nombre || 'N/A'}</p>
                                    <p><span className="font-semibold">Fecha:</span> {fecha}</p>
                                    <p><span className="font-semibold">Participantes:</span> {participantes} personas</p>
                                    <p><span className="font-semibold">Refrigerio:</span> {refrigerio || 'Ninguno'}</p>
                                </div>
                                
                                <div className="my-6 space-y-1 text-sm ml-auto w-full md:w-[80%]">
                                    <div className="flex justify-between"><span>Precio Base X{participantes}</span><span>{formatPrice(participantes * precioPersona)}</span></div>
                                    <div className="flex justify-between"><span>KITs de Turismo X{participantes}</span><span>{formatPrice(participantes * kitsTurismo)}</span></div>
                                    <div className="flex justify-between border-b pb-2"><span>Refrigerio({refrigerio}) X{participantes}</span><span>{formatPrice(participantes * precioRefrigerio)}</span></div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold">Total a Pagar</span>
                                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <Button className="px-6 py-2 rounded text-white font-semibold"
                                    onClick={handleConfirmReserva}
                                    disabled={loadingReserva}
                                >{loadingReserva ? "Guardando..." : "CONFIRMAR Y SELECCIONAR PAGO"}</Button>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* MODAL 2: Métodos de pago */}
                {
                    showModal && showMetodoPago && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-background shadow-lg rounded-xl p-8 w-full max-w-lg relative">
                                <button
                                    aria-label="Cerrar"
                                    className="absolute right-3 top-3 text-2xl text-muted-foreground hover:text-foreground"
                                    onClick={() => { setShowMetodoPago(false); setShowModal(false) }}
                                >x</button>
                                <div className="bg-muted rounded-lg p-6">
                                    <h3 className="font-bold text-2xl mb-6">Seleccione un metodo de pago</h3>
                                    <div className="space-y-4 mb-6">
                                        {METODOS.map(m => (
                                            <label key={m.nombre} className={`flex items-center gap-4 bg-white rounded-lg px-6 py-4 cursor-pointer border ${metodo === m.nombre ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/50'}`}>
                                                <input
                                                    type="radio"
                                                    name="metodo"
                                                    checked={metodo === m.nombre}
                                                    onChange={() => setMetodo(m.nombre)}
                                                    className="scale-125 accent-primary"
                                                />
                                                {/* Usamos div como placeholder de imagen */}
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                                    {m.nombre.substring(0, 3)}
                                                </div>
                                                <span className="font-semibold">{m.nombre}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-bold">Total</span>
                                        <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <Button
                                        className="bg-primary px-6 py-2 rounded text-white font-semibold"
                                        onClick={() => {
                                            if (!metodo) {
                                                toast.error("Selección Requerida", { description: "Selecciona un método de pago." });
                                                return;
                                            }
                                            setShowMetodoPago(false);
                                            setShowModal(false);
                                            setPago(true);
                                            // Simulación de pago exitoso y redirección tras 2 segundos
                                            setTimeout(() => {
                                                setPago(false);
                                                toast.success("Pago Exitoso", { description: `Reserva confirmada con ${metodo}. Redirigiendo...` });
                                                router.push("/tus-reservas"); // Redirigir a la lista de reservas
                                            }, 2000);
                                        }}
                                        disabled={!metodo}
                                    >PAGAR</Button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* ALERTA de pago en proceso */}
                {
                    pago && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
                            <div className="bg-white px-8 py-6 rounded-xl shadow-xl text-center border-2 border-primary">
                                <span className="text-3xl font-bold text-primary mb-4 block">¡Pago en proceso!</span>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    )
}