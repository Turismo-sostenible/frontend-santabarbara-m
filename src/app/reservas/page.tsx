"use client"

import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/public-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getAuthToken, isTokenExpired } from "@/lib/api";
// Importa el endpoint de reservas:
import { createReserva } from "@/service/reservas-service"
import { getGuias } from "@/service/guias-service";
import type { CreateReservaPayload, HorarioGuia } from "@/types"

type Plan = {
    id: string
    nombre: string
    descripcion: string
    precio: number
    duracion: string
    imagen: string
}

type Guia = {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    estado: string;
    horarios: HorarioGuia[];
}

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

export default function ReservasPage() {
    const [plan1, setPlan] = useState<Plan | null>(null)
    const [guias, setGuias] = useState<Guia[]>([]);
    const [guiaSeleccionado, setGuiaSeleccionado] = useState<Guia | null>(null);
    const [participantes, setParticipantes] = useState<number>(2)
    const [refrigerio, setRefrigerio] = useState<string>("")
    const [fecha, setFecha] = useState<string>("")
    const [precioRefrigerio, setPrecioRefrigerio] = useState<number>(0)
    const [showModal, setShowModal] = useState(false)
    const [showMetodoPago, setShowMetodoPago] = useState(false)
    const [pago, setPago] = useState(false)
    const [metodo, setMetodo] = useState("")
    const [loadingReserva, setLoadingReserva] = useState(false)
    const router = useRouter();

    // Simulación de usuario y guía para la reserva, debes traer estos datos del contexto real o sesión.
    const usuario = "1"
    const guia = guiaSeleccionado ? guiaSeleccionado.id : "1"
    const plan = plan1 ? plan1.id : "1"

    useEffect(() => {
        try {
            const token = getAuthToken()
            if (!token || isTokenExpired(token)) {
                router.push("/iniciar-sesion")
                return
            }
        } catch (e) {
            console.error("Failed to read selectedPlan from sessionStorage", e)
        }
    }, [router])

    useEffect(() => {
        try {
            const token = getAuthToken()
            if (!token) {
                router.push("/iniciar-sesion")
                return
            }
            const s = sessionStorage.getItem("selectedPlan")
            if (s) setPlan(JSON.parse(s))
            getGuias().then(setGuias);
        } catch (e) {
            console.error("Failed to read selectedPlan from sessionStorage", e)
        }
    }, [])

    useEffect(() => {
        const r = REFRIGERIOS.find((r) => r.nombre === refrigerio)
        setPrecioRefrigerio(r ? r.precio : 0)
    }, [refrigerio])

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price)

    const precioPersona = plan1 ? plan1.precio : 45000
    const kitsTurismo = 10000
    const total =
        participantes * precioPersona + participantes * kitsTurismo + participantes * precioRefrigerio

    function formatFecha(date: Date): string {
        // Obtiene los valores con dos dígitos
        const pad = (num: number) => num.toString().padStart(2, '0');
        return [
            date.getFullYear(),
            '-',
            pad(date.getMonth() + 1),
            '-',
            pad(date.getDate()),
            'T',
            pad(date.getHours()),
            ':',
            pad(date.getMinutes()),
            ':',
            pad(date.getSeconds())
        ].join('');
    }


    // -- AQUÍ HACE EL POST --
    async function handleConfirmReserva() {
        // Depura valores según payload de backend.
        const payload: CreateReservaPayload = {
            usuario,
            guia,
            plan, // Puede venir de la sesión seleccionada
            participantes,
            refrigerio: refrigerio as "DESAYUNO" | "ALMUERZO" | "MERIENDA" | "CENA",
            fechaReserva: formatFecha(new Date(fecha)),
            estado: "PENDIENTE",
            precioTotal: total
        }
        setLoadingReserva(true)
        try {
            await createReserva(payload)
            setShowModal(true)
            setShowMetodoPago(true)
        } catch (e) {
            alert("Error al guardar la reserva")
        } finally {
            setLoadingReserva(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />
            <button
                className="m-4 ml-46 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-medium"
                onClick={() => router.push("/planes")}
            >
                {" <-- "}
            </button>
            <main className="max-w-4xl mx-auto space-y-8">

                <h2 className="text-center flex-1 text-2xl font-bold border rounded-lg py-2">{plan1?.nombre}</h2>

                <section className="bg-muted rounded-lg p-6">
                    <label className="block mb-2 font-semibold">Seleccione un guía:</label>
                    <select
                        className="mb-6 w-full px-3 py-2 border rounded"
                        value={guiaSeleccionado?.id ?? ""}
                        onChange={e => {
                            const g = guias.find(g => g.id === e.target.value);
                            setGuiaSeleccionado(g || null);
                        }}
                    >
                        <option value="">Elija un guía</option>
                        {guias.map(guia => (
                            <option key={guia.id} value={guia.id}>
                                {guia.nombre}
                            </option>
                        ))}
                    </select>
                    {guiaSeleccionado && (
                        <div className="flex gap-4 items-center">
                            <div>
                                <div className="font-semibold">{guiaSeleccionado.nombre}</div>
                                <div className="text-sm text-muted-foreground">
                                    {guiaSeleccionado.telefono}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {guiaSeleccionado.email ?? "Sin info"}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Reservar<span className="float-right text-xl font-bold">{formatPrice(precioPersona)}<span className="text-base font-normal"> por persona</span></span></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={e => { e.preventDefault(); setShowModal(true) }}>
                            <div className="mb-4">
                                <Label>Fecha disponible</Label>
                                <select
                                    className="w-full mt-1 px-3 py-2 border rounded"
                                    value={fecha}
                                    onChange={e => setFecha(e.target.value)}
                                >
                                    <option value="">Selecciona fecha</option>
                                    <option>2025-11-10</option>
                                    <option>2025-11-11</option>
                                </select>
                            </div>

                            <div className="mb-4 flex gap-2 items-center">
                                <Label>Participantes</Label>
                                <button
                                    type="button"
                                    className="border px-2 mx-1"
                                    onClick={() => setParticipantes(p => Math.max(1, p - 1))}
                                    disabled={participantes <= 1}
                                >-</button>
                                <span>{participantes}</span>
                                <button
                                    type="button"
                                    className="border px-2 mx-1"
                                    onClick={() => setParticipantes(p => Math.min(8, p + 1))}
                                    disabled={participantes >= 8}
                                >+</button>
                                <span className="ml-2 text-muted-foreground">Máximo 8 personas</span>
                            </div>

                            <div className="mb-6">
                                <Label>Refrigerio</Label>
                                <select
                                    className="w-full mt-1 px-3 py-2 border rounded"
                                    value={refrigerio}
                                    onChange={e => setRefrigerio(e.target.value)}
                                >
                                    <option value="">Selecciona Refrigerio</option>
                                    {REFRIGERIOS.map(r => (
                                        <option key={r.nombre} value={r.nombre}>
                                            {r.nombre} ({formatPrice(r.precio)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-gray-100 p-4 rounded mb-4">
                                <div className="flex justify-between"><span>Participantes x{participantes}</span><span>{formatPrice(participantes * precioPersona)}</span></div>
                                <div className="flex justify-between"><span>KITs de Turismo x{participantes}</span><span>{formatPrice(participantes * kitsTurismo)}</span></div>
                                <div className="flex justify-between"><span>Refrigerio({refrigerio}) x{participantes}</span><span>{formatPrice(participantes * precioRefrigerio)}</span></div>
                                <div className="flex justify-between font-bold mt-2 text-green-600"><span>Total</span><span>{formatPrice(total)}</span></div>
                            </div>
                            <button
                                className="w-full py-3 bg-primary rounded text-white font-semibold text-lg"
                                onClick={() => {
                                    if (refrigerio === "" || fecha === "") {
                                        alert("Selecciona un refrigerio y una fecha");
                                        return;
                                    }
                                    setShowModal(true);
                                }}
                                type="button"
                            >Reservar ahora</button>
                        </form>
                    </CardContent>
                </Card>

                {/* MODAL 1: Confirmación de reserva */}
                {showModal && !showMetodoPago && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-background shadow-lg rounded-xl p-8 w-full max-w-lg relative">
                            <button
                                aria-label="Cerrar"
                                className="absolute right-3 top-3 text-2xl"
                                onClick={() => setShowModal(false)}
                            >x</button>
                            <div className="bg-muted rounded-lg p-6">
                                <h3 className="font-bold text-2xl mb-4">Reserva</h3>
                                <p><span className="font-semibold">Guia:</span> Luis Fernando</p>
                                <p><span className="font-semibold">Fecha:</span> {fecha}</p>
                                <p><span className="font-semibold">Participantes:</span> {participantes} {participantes === 1 ? "persona" : "personas"}</p>
                                <p><span className="font-semibold">Refrigerio:</span> {refrigerio}</p>
                                <div className="my-6">
                                    <div className="flex flex-col gap-1 font-mono text-sm ml-auto w-[60%]">
                                        <div className="flex justify-between"><span>Participantes X{participantes}</span><span>{formatPrice(participantes * precioPersona)}</span></div>
                                        <div className="flex justify-between"><span>KITs de Turismo X{participantes}</span><span>{formatPrice(participantes * kitsTurismo)}</span></div>
                                        <div className="flex justify-between"><span>Refrigerio({refrigerio}) X{participantes}</span><span>{formatPrice(participantes * precioRefrigerio)}</span></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold">Total</span>
                                    <span className="text-2xl font-bold text-green-700">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <button className="bg-primary px-6 py-2 rounded text-white font-semibold"
                                    onClick={handleConfirmReserva}
                                    disabled={loadingReserva}
                                >{loadingReserva ? "Guardando..." : "SIGUIENTE"}</button>
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
                                    className="absolute right-3 top-3 text-2xl"
                                    onClick={() => { setShowMetodoPago(false); setShowModal(false) }}
                                >x</button>
                                <div className="bg-muted rounded-lg p-6">
                                    <h3 className="font-bold text-2xl mb-6">Seleccione un metodo de pago</h3>
                                    <div className="space-y-4 mb-6">
                                        {METODOS.map(m => (
                                            <label key={m.nombre} className="flex items-center gap-4 bg-[#eafeff85] rounded-lg px-6 py-4 cursor-pointer border border-transparent hover:border-primary">
                                                <input
                                                    type="radio"
                                                    name="metodo"
                                                    checked={metodo === m.nombre}
                                                    onChange={() => setMetodo(m.nombre)}
                                                    className="scale-125 accent-primary"
                                                />
                                                <Image src={m.icon} alt={m.nombre} width={36} height={36} />
                                                <span className="font-semibold">{m.nombre}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-bold">Total</span>
                                        <span className="text-2xl font-bold text-green-700">{formatPrice(total)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <button
                                        className="bg-primary px-6 py-2 rounded text-white font-semibold"
                                        onClick={() => {
                                            if (!metodo) {
                                                alert("Selecciona un método de pago");
                                                return;
                                            }
                                            setShowMetodoPago(false);
                                            setShowModal(false);
                                            setPago(true);
                                            setTimeout(() => setPago(false), 2000);
                                        }}
                                    >PAGAR</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* ALERTA de pago exitoso */}
                {
                    pago && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
                            <div className="bg-white px-8 py-6 rounded-xl shadow-xl text-center border-2 border-green-500">
                                <span className="text-3xl font-bold text-green-700 mb-4 block">¡Pagado con éxito!</span>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    )
}
