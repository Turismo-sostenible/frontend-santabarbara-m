import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, DollarSign } from "lucide-react"

interface PlanCardProps {
  plan: {
    id: string
    nombre: string
    descripcion: string
    precio: number
    duracion: string
    imagen: string
  }
}

export function PlanCard({ plan }: PlanCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={plan.imagen || "/placeholder.svg"}
          alt={plan.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-2 text-balance">{plan.nombre}</h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{plan.descripcion}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{plan.duracion}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="w-4 h-4" />
            <span>{formatPrice(plan.precio)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/planes/${plan.id}`}>Reservar Ahora</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
