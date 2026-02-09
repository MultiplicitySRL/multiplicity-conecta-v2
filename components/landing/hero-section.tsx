"use client"

import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-20 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Image
              src="/images/multiplicity-logo.png"
              alt="Multiplicity Logo"
              width={400}
              height={160}
              className="object-contain"
              priority
            />

            <div className="space-y-4">
              <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
                Modelo de valoración integral de las personas a través de un sistema de evaluación por competencias
                online para procesos de selección y desarrollo de talentos.
              </p>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/design-mode/Plataforma-de-Evaluacion-removebg-preview.png"
              alt="Plataforma de Evaluación Multiplicity"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
