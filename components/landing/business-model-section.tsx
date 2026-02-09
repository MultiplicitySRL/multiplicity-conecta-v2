"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function BusinessModelSection() {
  return (
    <section id="modelo-negocio" className="py-12 md:py-14 px-4 border-t">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-balance">Modelo de Negocio</h2>

        <div className="space-y-12">
          {/* Main Model Description */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-balance">MODELO DE EVALUACIÓN</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Diagnóstico de las competencias, aptitudes y motivadores que muestran las personas. Centrada en ver
                diferentes facetas del evaluado y abrirles puertas de desarrollo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                <CardContent className="pt-6 space-y-2">
                  <h4 className="text-base md:text-lg font-bold text-center">COMPETENCIAS</h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed text-center">
                    Habilidad para poner en práctica conductas que se traducen en desempeño superior y contribuyen al
                    logro de objetivos institucionales.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                <CardContent className="pt-6 space-y-2">
                  <h4 className="text-base md:text-lg font-bold text-center">APTITUDES</h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed text-center">
                    Capacidad de afrontar problemas, manejar datos de distinta naturaleza y aprendizaje futuro del
                    participante.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                <CardContent className="pt-6 space-y-2">
                  <h4 className="text-base md:text-lg font-bold text-center">MOTIVADORES</h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed text-center">
                    Impulsores que mueven a las personas a actuar. Evalúan el posible encaje de la persona a la cultura
                    organizacional.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Model Benefits */}
          <div className="bg-muted/50 rounded-2xl p-6 md:p-8 border-2 shadow-lg space-y-5">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center">
              Modelo que permite ver múltiples variables del comportamiento para decisiones acertadas con rigurosidad
              metodológica.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center space-y-2 p-4 rounded-lg bg-background">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-xs md:text-sm font-medium">Evalúas solo lo necesario</p>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-background">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-xs md:text-sm font-medium">Modelo multifuncional</p>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-background">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-xs md:text-sm font-medium">Rigurosidad metodológica</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-2xl p-8 md:p-12 text-center space-y-6 border-2 border-primary/20 shadow-lg">
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-balance">
                Descubre la cotización que más se adapta a tus necesidades
              </h3>
            </div>
            <Link href="/">
              <Button size="lg" className="text-base px-16 py-6 h-auto shadow-md hover:shadow-lg transition-all">
                Ir al Cotizador
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
