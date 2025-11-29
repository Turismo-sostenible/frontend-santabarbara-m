"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PlanGalleryProps {
  imagenes: string[]
  nombre: string
}

export default function PlanGallery({
  imagenes,
  nombre
}: PlanGalleryProps) {
  const baseUrl = process.env.NEXT_PUBLIC_PLAN_MICRO_URL || "http://localhost:3002/api/v1"
  // Extraer el dominio base (sin /api/v1)
  const domainUrl = baseUrl.replace(/\/api\/v1$/, "")
  const [currentIndex, setCurrentIndex] = useState(0)

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http")) return imagePath
    // Las imágenes están en /uploads, no en /api/v1/uploads
    return `${domainUrl}${imagePath}`
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? imagenes.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === imagenes.length - 1 ? 0 : prev + 1
    )
  }

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden border bg-card relative aspect-[4/3] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No hay imágenes disponibles</p>
        </div>
      </div>
    )
  }

  const currentImage = imagenes[currentIndex]
  const imageUrl = getImageUrl(currentImage)

  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div className="rounded-lg overflow-hidden border bg-card relative aspect-[4/3]">
        <img
          src={imageUrl}
          alt={`${nombre} - ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src = "/placeholder.svg"
          }}
        />
      </div>

      {/* Controles y Miniaturas */}
      {imagenes.length > 1 && (
        <div className="space-y-3">
          {/* Botones de navegación */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-lg border hover:bg-accent transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-sm text-muted-foreground font-medium">
              {currentIndex + 1} / {imagenes.length}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-lg border hover:bg-accent transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Miniaturas */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imagenes.map((imagePath, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  src={getImageUrl(imagePath)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = "/placeholder.svg"
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
