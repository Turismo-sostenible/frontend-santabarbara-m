"use client" // Necesario ahora porque usaremos useEffect

import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/public-navbar"
import { PlanCard } from "@/components/plan-card"
import { getPlanes } from "@/service/planes-service"
import type { Plan } from "@/types"

export default function PlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getPlanes()
        setPlans(data)
      } catch (error) {
        console.error("Error cargando planes", error)
      } finally {
        setLoading(false)
      }
    }
    loadPlans()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">Nuestros Planes Turísticos</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Descubre experiencias únicas diseñadas para crear recuerdos inolvidables
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Cargando planes...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}