"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getPlanById, updatePlan, type PlanUpdateData } from "@/service/planes-service"
import PlanForm from "@/components/plan-form"
import type { Plan } from "@/types"
import type { PlanCreationData } from "@/service/planes-service"
import { toast } from "sonner"

export default function EditarPlanPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [plan, setPlan] = useState<Plan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setIsLoading(true)
        const data = await getPlanById(id)
        if (data) {
          setPlan(data)
        } else {
          toast.error("Plan no encontrado")
          router.push("/admin/planes")
        }
      } catch (error) {
        console.error("Error al cargar plan:", error)
        toast.error("Error al cargar el plan")
        router.push("/admin/planes")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadPlan()
    }
  }, [id, router])

  const handleSubmit = async (data: PlanCreationData) => {
    try {
      setIsSubmitting(true)
      await updatePlan(id, data)
      toast.success("Plan actualizado exitosamente")
      router.push("/admin/planes")
    } catch (error) {
      console.error("Error al actualizar plan:", error)
      toast.error("Error al actualizar el plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Cargando plan...</p>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Plan no encontrado</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">Editar Plan</h1>
        <p className="text-muted-foreground mt-2">
          Modifica la información del plan turístico.
        </p>
      </div>

      <PlanForm
        initialData={plan}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isEditMode={true}
      />
    </div>
  )
}
