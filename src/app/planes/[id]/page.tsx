import { getPlanById } from "@/service/planes-service";
import { notFound } from "next/navigation";
import ReserveButtonClient from "@/components/reserve-button-client";
import PlanGallery from "@/components/plan-gallery";

interface PageProps {
  params: { id: string };
}

export default async function PlanDetallePage({ params }: PageProps) {
  const { id } = await params;
  const plan = await getPlanById(id);
  
  if (!plan) {
    return notFound();
  }

  // Fichas educativas sobre plantas medicinales y aromáticas de la vereda
  const plantasEducativas = [
    {
      nombre: "Manzanilla",
      nombreCientifico: "Matricaria chamomilla",
      beneficios: ["Propiedades calmantes", "Alivia problemas digestivos", "Reduce la inflamación"],
      usos: "Infusión de flores secas para té relajante y digestivo",
      remedios: "Té para dormir mejor, aliviar cólicos y problemas estomacales",
      imagen: "🌱"
    },
    {
      nombre: "Mastrato",
      nombreCientifico: "Mentha longifolia",
      beneficios: ["Aromática refrescante", "Mejora la digestión", "Propiedades antisépticas"],
      usos: "Hojas frescas en té, infusiones o como condimento culinario",
      remedios: "Remedio casero para la indigestión, gases y problemas respiratorios",
      imagen: "🌱"
    },
    {
      nombre: "Tomillo",
      nombreCientifico: "Thymus vulgaris",
      beneficios: ["Expectorante natural", "Propiedades antimicrobianas", "Fortalece defensas"],
      usos: "Hojas secas en té o infusión para problemas respiratorios",
      remedios: "Remedio tradicional para la tos, bronquitis y resfriados",
      imagen: "🌱"
    },
    {
      nombre: "Cilantro",
      nombreCientifico: "Coriandrum sativum",
      beneficios: ["Desintoxicante natural", "Mejora la digestión", "Propiedades antioxidantes"],
      usos: "Hojas frescas en infusiones o como condimento en alimentos",
      remedios: "Remedio para limpiar el organismo y mejorar la circulación",
      imagen: "🌱"
    }
  ];

  // Comparación de turismo sostenible vs. tradicional
  const comparacionTurismo = [
    {
      aspecto: "Alimentos y Productos",
      sostenible: "Alimentos orgánicos frescos de la vereda, sin químicos, producción familiar",
      tradicional: "Alimentos con pesticidas, intermediarios, productos de baja calidad",
      ejemplo: "Café, hortalizas y frutas de la vereda vs. productos industrializados"
    },
    {
      aspecto: "Beneficio Económico Local",
      sostenible: "60% venta directa al consumidor, dinero directo a la familia, empleo local",
      tradicional: "40% intermediarios, ganancias centralizadas, empleos precarios",
      ejemplo: "José Luis vende en plaza La Esmeralda vs. grandes distribuidoras"
    },
    {
      aspecto: "Educación y Conocimiento",
      sostenible: "Enseñanza de remedios caseros, procesos de producción, biodiversidad",
      tradicional: "Solo consumo, sin información sobre origen o beneficios",
      ejemplo: "Aprender a preparar remedios con plantas vs. comprar productos sin saber qué contienen"
    },
    {
      aspecto: "Procesos Sostenibles",
      sostenible: "Biofábrica, lombricultivo, abonos bioorgánicos, energías renovables",
      tradicional: "Químicos sintéticos, contaminación del suelo y agua, degradación ambiental",
      ejemplo: "Abonos propios en 3 meses vs. fertilizantes químicos dañinos"
    },
    {
      aspecto: "Experiencia Auténtica",
      sostenible: "Caminatas guiadas por expertos locales, observación de aves, nacimiento de agua",
      tradicional: "Turismo masificado, sin conexión con la comunidad, solo fotos",
      ejemplo: "Recorrido de 2km con José Luis viendo el valle vs. tour genérico"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Sección Principal */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-16">
          {/* Galería de Imágenes */}
          <PlanGallery 
            imagenes={plan.imagenes || []} 
            nombre={plan.nombre}
          />
          
          {/* Información del Plan */}
          <div>
            <h1 className="font-serif text-4xl font-bold mb-4">{plan.nombre}</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">{plan.descripcion}</p>
            <div className="space-y-2 text-sm mb-6">
              <div><strong>Duración:</strong> {plan.duracion} horas</div>
              <div><strong>Cupo Máximo:</strong> {plan.cupoMaximo} personas</div>
              <div>
                <strong>Precio:</strong> {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(plan.precioValor || 0)}
              </div>
            </div>
            <ReserveButtonClient plan={plan} />
          </div>
        </div>

        {/* Fichas Educativas - Plantas Medicinales */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">🌿 Plantas Medicinales del Sendero</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {plantasEducativas.map((planta, idx) => (
              <div key={idx} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{planta.imagen}</span>
                  <div>
                    <h3 className="font-bold text-lg">{planta.nombre}</h3>
                    <p className="text-sm text-muted-foreground italic">{planta.nombreCientifico}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Beneficios:</h4>
                    <ul className="text-sm space-y-1">
                      {planta.beneficios.map((beneficio, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Preparación:</h4>
                    <p className="text-sm text-muted-foreground">{planta.usos}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-1">Remedio Casero:</h4>
                    <p className="text-sm text-amber-900 bg-amber-50/50 p-2 rounded">{planta.remedios}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Alimentos Orgánicos vs Químicos */}
        <section className="mb-16 bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">🥬 Alimentos Orgánicos vs. Alimentos con Químicos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-green-700 flex items-center gap-2">
                <span className="text-2xl">✅</span> Alimentos Orgánicos
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Sin pesticidas:</strong> Producidos sin químicos sintéticos dañinos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Mayor nutrición:</strong> Más vitaminas, minerales y antioxidantes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Mejor sabor:</strong> Sabor más intenso y natural</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Salud a largo plazo:</strong> Reducen riesgos de enfermedades</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Sostenibilidad:</strong> Protegen el suelo y el agua</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-red-700 flex items-center gap-2">
                <span className="text-2xl">⚠️</span> Alimentos con Químicos
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Residuos de pesticidas:</strong> Contienen químicos tóxicos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Menor nutrición:</strong> Menos nutrientes por uso de químicos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Sabor artificial:</strong> Sabor menos intenso y natural</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Riesgos para la salud:</strong> Asociados con cáncer y enfermedades</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Daño ambiental:</strong> Contaminan suelo, agua y ecosistemas</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tabla Comparativa - Turismo Sostenible vs Tradicional */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">🌍 Turismo Sostenible vs. Tradicional</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="px-4 py-3 text-left font-semibold">Aspecto</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-700">Turismo Sostenible</th>
                  <th className="px-4 py-3 text-left font-semibold text-red-700">Turismo Tradicional</th>
                  <th className="px-4 py-3 text-left font-semibold">Ejemplo Local</th>
                </tr>
              </thead>
              <tbody>
                {comparacionTurismo.map((fila, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <td className="px-4 py-3 font-semibold">{fila.aspecto}</td>
                    <td className="px-4 py-3 text-green-900 bg-green-50/30">{fila.sostenible}</td>
                    <td className="px-4 py-3 text-red-900 bg-red-50/30">{fila.tradicional}</td>
                    <td className="px-4 py-3 text-muted-foreground italic">{fila.ejemplo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
