"use client"

import { Calendar, CheckCircle2, BarChart3, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MeetingSection() {
  return (
    <section className="py-12 md:py-14 px-4 border-t">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Agendar Reunión con el Equipo</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: CTA */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all p-8 text-center space-y-6 order-2 md:order-1">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Agenda una Reunión</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Descubre cómo la plataforma puede transformar la gestión de talento en tu organización
              </p>
            </div>
            <Button
              size="lg"
              className="text-base px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Agendar Reunión
            </Button>
          </div>

          {/* Right: Platform Description */}
          <div className="space-y-5 order-1 md:order-2">
            <p className="text-base text-muted-foreground leading-relaxed">
              Nuestra plataforma tecnológica te permite gestionar todos tus procesos de evaluación de manera eficiente y
              centralizada.
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: BarChart3,
                  text: "Panel de administración intuitivo para gestionar evaluaciones y resultados",
                },
                {
                  icon: FileSpreadsheet,
                  text: "Exporta reportes individuales y grupales en múltiples formatos",
                },
                {
                  icon: CheckCircle2,
                  text: "Seguimiento en tiempo real del progreso de las evaluaciones",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed pt-1.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
