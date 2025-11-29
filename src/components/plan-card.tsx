"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";

import type { Plan } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Construir URL de imagen del backend
  const baseUrl = process.env.NEXT_PUBLIC_PLAN_MICRO_URL || "http://localhost:3002/api/v1";
  const domainUrl = baseUrl.replace(/\/api\/v1$/, "");
  
  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${domainUrl}${imagePath}`;
  };

  const imageUrl = plan.imagenes && plan.imagenes.length > 0 
    ? getImageUrl(plan.imagenes[0])
    : "/placeholder.svg";

  const router = useRouter()

  const handleReserve = () => {
    try {
      sessionStorage.setItem("selectedPlan", JSON.stringify(plan))
    } catch (e) {
      // ignore
    }
    router.push("/reservas")
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/planes/${plan.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={imageError ? "/placeholder.svg" : imageUrl}
            alt={plan.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/planes/${plan.id}`} className="block">
          <h3 className="font-serif text-xl font-semibold mb-2 text-balance hover:underline">
            {plan.nombre}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
          {plan.descripcion}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{plan.duracion} horas</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="w-4 h-4" />
            <span>{formatPrice(plan.precioValor || 0)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleReserve}>
          Reservar Ahora
        </Button>
      </CardFooter>
    </Card>
  );
}
