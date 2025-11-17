"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Users, Calendar, Star } from "lucide-react"

import { useState, useEffect } from "react"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Revisar solo en el navegador
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken") 
      if (token) {
        setIsLoggedIn(true)
      }
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/placeholder.svg?height=600&width=1920&query=beautiful+mountain+landscape+tourism)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
            Descubre Aventuras Inolvidables
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-balance leading-relaxed">
            Explora los mejores planes turísticos con guías expertos
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Link href="/planes">Ver Planes</Link>
            </Button>
            {isLoggedIn ? (
              // Si está logueado: Botón "Mi Perfil"
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8"
              >
                <Link href="/perfil">Mi Perfil</Link>
              </Button>
            ) : (
              // Si NO está logueado: Botón "Registrarse"
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8"
              >
                <Link href="/registro">Registrarse</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Destinos Únicos</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Accede a lugares exclusivos con experiencias auténticas
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Guías Certificados</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Profesionales expertos en cada destino turístico
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reserva Fácil</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sistema simple y seguro de reservas en línea
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mejor Valorados</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Miles de clientes satisfechos con nuestros servicios
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold mb-6 text-balance">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Únete a miles de viajeros que han descubierto experiencias únicas
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/registro">Comenzar Ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
