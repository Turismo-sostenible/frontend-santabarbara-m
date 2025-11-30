"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPlan, type PlanCreationData } from "@/service/planes-service"
import PlanForm from "@/components/plan-form"
import { toast } from "sonner"

export default function CrearPlanPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: PlanCreationData, files: File[]) => {
    try {
      setIsLoading(true)
      await createPlan(data, files)
      toast.success("Plan creado exitosamente")
      router.push("/admin/planes")
    } catch (error) {
      console.error("Error al crear plan:", error)
      toast.error("Error al crear el plan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">Crear Nuevo Plan</h1>
        <p className="text-muted-foreground mt-2">
          Completa el formulario para añadir un nuevo plan turístico.
        </p>
      </div>

      <PlanForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditMode={false}
      />
    </div>
  )
}
