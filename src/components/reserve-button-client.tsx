"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ReserveButtonClientProps {
  plan: {
    id: string
    nombre: string
    descripcion: string
    precioValor?: number
    duracion: number
    cupoMaximo: number
    imagenes?: string[]
  }
}

export default function ReserveButtonClient({ plan }: ReserveButtonClientProps) {
  const router = useRouter()

  const handleReserve = () => {
    try {
      sessionStorage.setItem("selectedPlan", JSON.stringify(plan))
    } catch (e) {
      console.error("Error al guardar plan", e)
    }
    router.push("/reservas")
  }

  return (
    <Button
      size="lg"
      className="w-full bg-black hover:bg-green-700"
      onClick={handleReserve}
    >
      Reservar Ahora
    </Button>
  )
}
