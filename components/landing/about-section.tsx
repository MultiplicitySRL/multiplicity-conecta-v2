"use client"

import Image from "next/image"
import { Target, TrendingUp, Users, Award } from "lucide-react"
import { ClientCarousel } from "./client-carousel"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section className="py-12 md:py-14 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-balance">Sobre Nosotros</h2>

        <div className="space-y-12">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Las empresas son redes de personas que agregan valor. Por eso es fundamental gestionar el talento con
              criterios sistemáticos y científicos, identificando, promoviendo y desarrollando colaboradores para elevar
              la efectividad organizacional y el bienestar de las personas.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">¿QUÉ ES VALORACIÓN INTEGRAL?</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Multiplicity es un modelo de valoración integral de las personas, a través de un sistema de evaluación
                por competencias online para procesos de selección y desarrollo de talentos.
              </p>
            </div>
            <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/design-mode/test1-1.png"
                alt="Valoración Integral - Evaluación de competencias"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold text-balance">Conociendo Multiplicity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
                Una introducción a nuestro modelo de evaluación por competencias, aptitudes y motivadores.
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl ring-1 ring-black/5 max-w-4xl mx-auto">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jUY4txWQeTE"
                title="Conociendo Multiplicity"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h3 className="text-2xl md:text-3xl font-semibold text-balance">Confían en nosotros</h3>
              <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                Hemos colaborado con instituciones líderes en educación, salud, banca, sector público y privado,
                acompañando procesos de selección y desarrollo del talento.
              </p>
            </div>
            <ClientCarousel />
          </div>

          {/* What We Offer */}
          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-center">¿QUÉ OFRECEMOS?</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  number: "1",
                  title: "IDENTIFICA",
                  description: "Definimos objetivamente las competencias diferenciadoras de tu organización.",
                  icon: Target,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  number: "2",
                  title: "EVALÚA",
                  description:
                    "Sistema robusto que garantiza el mejor ajuste de candidatos a los requerimientos organizacionales.",
                  icon: TrendingUp,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  number: "3",
                  title: "DESARROLLA",
                  description:
                    "Portafolio de actividades para desarrollar competencias claves y facilitar el autodesarrollo.",
                  icon: Users,
                  color: "from-orange-500 to-red-500",
                },
                {
                  number: "4",
                  title: "RECONOCE",
                  description:
                    "Plataforma digital Competenciando para reconocer competencias que impulsan metas organizacionales.",
                  icon: Award,
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all hover:scale-105 duration-300">
                  <CardContent className="pt-6 space-y-3">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xl font-bold shadow-lg mx-auto`}
                    >
                      {item.number}
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-base md:text-lg font-bold">{item.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
