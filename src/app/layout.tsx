import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css" // Asegúrate que la importación de globals.css esté aquí
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

// 1. Asigna las fuentes a las variables CSS que usa shadcn/Tailwind
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Esta será la fuente por defecto
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif", // Esta será la fuente para títulos
})

export const metadata: Metadata = {
  title: "Santa Barbara - Reserva Planes Turísticos",
  description: "Plataforma para la reserva de planes turísticos con guías expertos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // (Es necesario para que next-themes no lance un error en la consola)
    <html lang="es" suppressHydrationWarning>
      {/*
       * 2. Combina las variables de las fuentes en el className.
       * - ${inter.variable} -> activa la variable --font-sans
       * - ${playfair.variable} -> activa la variable --font-serif
       * - font-sans -> le dice a Tailwind que use --font-sans como fuente por defecto
       */}
      <body
        className={`${inter.variable} ${playfair.variable} font-sans`}
      >
       <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > 
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}