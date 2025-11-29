import { PublicNavbar } from "@/components/public-navbar";
import { PlanCard } from "@/components/plan-card";
import { getPlanes } from "@/service/planes-service";

export default async function PlanesPage() {
  const planes = await getPlanes();

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">
            Nuestros Planes Turísticos
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Descubre experiencias únicas diseñadas para crear recuerdos
            inolvidables
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
