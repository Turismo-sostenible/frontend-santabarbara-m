"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPlanById, updatePlan, PlanCreationData } from "@/service/planes-service";
import PlanForm from "@/components/plan-form"; 
import type { Plan } from "@/types";
import { toast } from "sonner";

export default function EditarPlanPage() {
  const router = useRouter();
  const params = useParams();
  // LLAVE 1: Captura el ID de la URL
  const id = params.id as string; 

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EFECTO CLAVE: Llama al servicio mock para obtener los datos
  useEffect(() => {
    const loadPlan = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // LLAMADA CLAVE: Obtener el objeto Plan completo por ID
        const data = await getPlanById(id); 
        
        if (data) {
          setPlan(data); // Guarda el objeto Plan en el estado
        } else {
          toast.error("Plan no encontrado.");
          router.push("/admin/planes");
        }
      } catch (error) {
        console.error("Error al cargar plan:", error);
        toast.error("Error al cargar el plan. Verifique el ID.");
        router.push("/admin/planes");
      } finally {
        setIsLoading(false);
      }
    };

    loadPlan();
  }, [id, router]);

  // FUNCIÓN: Maneja el envío del formulario de edición
  const handleSubmit = async (data: PlanCreationData) => {
    try {
      setIsSubmitting(true);
      // LLAMADA CLAVE: Envía los datos actualizados al servicio con el ID
      await updatePlan(id, data); 
      toast.success("Plan actualizado exitosamente");
      router.push("/admin/planes");
    } catch (error) {
      console.error("Error al actualizar plan:", error);
      toast.error("Error al actualizar el plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Cargando plan...</p>
      </div>
    );
  }
  
  // Condición de guardia: solo renderiza el formulario si 'plan' tiene datos
  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Error: Plan no disponible o no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">Editar Plan: {plan.nombre}</h1>
        <p className="text-muted-foreground mt-2">
          Modifica la información del plan turístico.
        </p>
      </div>

      {/* LLAVE 2: Se pasa el objeto Plan cargado al formulario */}
      <PlanForm
        initialData={plan} // <--- Objeto Plan completo se pasa aquí
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}