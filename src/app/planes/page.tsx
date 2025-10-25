import { PublicNavbar } from "@/components/public-navbar"
import { PlanCard } from "@/components/plan-card"

// Mock data - will be replaced with API calls
const mockPlans = [
  {
    id: "1",
    nombre: "Caminata Sierra Nevada",
    descripcion: "Explora los paisajes más hermosos de la Sierra Nevada con guías expertos",
    precio: 150000,
    duracion: "8 horas",
    imagen: "/mountain-hiking-trail.png",
  },
  {
    id: "2",
    nombre: "Tour Café Colombiano",
    descripcion: "Descubre el proceso del café desde la semilla hasta la taza",
    precio: 80000,
    duracion: "4 horas",
    imagen: "/coffee-plantation-colombia.jpg",
  },
  {
    id: "3",
    nombre: "Rafting Río Magdalena",
    descripcion: "Aventura extrema en las aguas del río más importante de Colombia",
    precio: 200000,
    duracion: "6 horas",
    imagen: "/rafting-river-adventure.jpg",
  },
  {
    id: "4",
    nombre: "Avistamiento de Aves",
    descripcion: "Observa especies únicas en su hábitat natural",
    precio: 120000,
    duracion: "5 horas",
    imagen: "/bird-watching-colombia.jpg",
  },
  {
    id: "5",
    nombre: "Parapente Valle del Cauca",
    descripcion: "Vuela sobre los hermosos paisajes del Valle del Cauca",
    precio: 180000,
    duracion: "3 horas",
    imagen: "/paragliding-valley-landscape.jpg",
  },
  {
    id: "6",
    nombre: "Tour Histórico Cartagena",
    descripcion: "Recorre la ciudad amurallada y conoce su fascinante historia",
    precio: 90000,
    duracion: "4 horas",
    imagen: "/cartagena-historic-city-walls.jpg",
  },
]

export default function PlanesPage() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  )
}
