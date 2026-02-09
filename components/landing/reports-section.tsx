"use client"
import { FileText, TrendingUp, Brain, Heart, Users, Target, Zap, Award, Briefcase, FileCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const competenciasPorArea = [
  {
    area: "Autogestión",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    competencias: [
      "Tolerancia a la presión",
      "Flexibilidad",
      "Compromiso organizacional",
      "Autoaprendizaje",
      "Innovación",
      "Visión estratégica",
    ],
  },
  {
    area: "Gestión del Cambio y Liderazgo",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    competencias: ["Impacto e influencia", "Dirección de personas", "Negociación"],
  },
  {
    area: "Logro",
    icon: Target,
    color: "from-orange-500 to-red-500",
    competencias: [
      "Planificación",
      "Iniciativa",
      "Orientación a resultados",
      "Orientación al cliente",
      "Toma de decisiones",
    ],
  },
  {
    area: "Relaciones",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    competencias: ["Trabajo en equipo", "Desarrollo de redes", "Sensibilidad interpersonal"],
  },
]

const clusters = [
  {
    nombre: "Ventas",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    competencias: [
      "Impacto e influencia",
      "Iniciativa",
      "Orientación a resultados",
      "Desarrollo de redes",
      "Negociación",
    ],
  },
  {
    nombre: "Servicio",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    competencias: [
      "Flexibilidad",
      "Tolerancia a la presión",
      "Orientación a resultados",
      "Orientación al cliente",
      "Sensibilidad interpersonal",
    ],
  },
  {
    nombre: "Emprendurismo",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    competencias: ["Dirección de personas", "Iniciativa", "Innovación", "Desarrollo de redes", "Visión de negocio"],
  },
  {
    nombre: "Inteligencia Emocional",
    icon: Brain,
    color: "from-green-500 to-emerald-500",
    competencias: ["Tolerancia a la presión", "Flexibilidad", "Negociación", "Sensibilidad interpersonal"],
  },
]

const reportes = [
  {
    titulo: "Con perfil ideal",
    descripcion: "Ajuste a las competencias críticas del puesto",
    icon: Target,
  },
  {
    titulo: "Sin perfil ideal",
    descripcion: "Resultados directos sin comparación",
    icon: FileText,
  },
  {
    titulo: "Reporte resumen",
    descripcion: "Visualización de resultados en una sola página",
    icon: FileCheck,
  },
  {
    titulo: "Para el evaluado",
    descripcion: "Reporte con retroalimentación para desarrollo personal",
    icon: Award,
  },
]

export function ReportsSection() {
  return (
    <section className="py-12 md:py-14 px-4 border-t bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Reportes de Evaluación</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Información detallada sobre competencias, aptitudes, motivadores y tipos de reportes
          </p>
        </div>

        <Tabs defaultValue="competencias" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
            <TabsTrigger value="competencias" className="text-xs md:text-sm py-2">
              Competencias
            </TabsTrigger>
            <TabsTrigger value="clusters" className="text-xs md:text-sm py-2">
              Clusters
            </TabsTrigger>
            <TabsTrigger value="aptitudes" className="text-xs md:text-sm py-2">
              Aptitudes
            </TabsTrigger>
            <TabsTrigger value="motivadores" className="text-xs md:text-sm py-2">
              Motivadores
            </TabsTrigger>
          </TabsList>

          {/* Competencias Tab */}
          <TabsContent value="competencias" className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold">Competencias del Modelo</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mx-auto">
                Las siguientes son las dimensiones que mide el modelo con sus competencias. Se seleccionan acorde a la
                posición y se pueden comparar con distintos perfiles.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {competenciasPorArea.map((area, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center shadow-lg`}
                      >
                        <area.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{area.area}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {area.competencias.map((comp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clusters Tab */}
          <TabsContent value="clusters" className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold">Información de Tendencias por Clusters</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mx-auto">
                Cluster es una agrupación de competencias que nos brindan tendencias hacia dimensiones críticas.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {clusters.map((cluster, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cluster.color} flex items-center justify-center shadow-lg`}
                      >
                        <cluster.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{cluster.nombre}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {cluster.competencias.map((comp, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Aptitudes Tab */}
          <TabsContent value="aptitudes" className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-center">Aptitudes</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-base md:text-lg">Razonamiento General</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Evaluación centrada en mostrar la capacidad para resolver tareas de razonamiento verbal, numérico,
                    lógico y abstracto.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-base md:text-lg">Pensamiento Analítico y Sistémico</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Capacidad de solucionar problemas analizando sus partes constitutivas, integrando información y
                    distinguiendo lo relevante de lo irrelevante. Excelente predictor de la capacidad de aprendizaje
                    futuro del participante y su capacidad de afrontar y solucionar problemas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Motivadores Tab */}
          <TabsContent value="motivadores" className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold">Motivadores</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mx-auto">
                Valoración del posible encaje de la persona en la organización: Perfil cultural de la organización y
                Perfil de motivadores personales.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  nombre: "ACQUIRE (Recompensa)",
                  items: ["Recompensa económica", "Reconocimiento profesional", "Promoción"],
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  nombre: "BOND (Vínculo)",
                  items: ["Pertenencia", "Relaciones", "Identificación"],
                  color: "from-purple-500 to-pink-500",
                },
                {
                  nombre: "CHALLENGE (Reto)",
                  items: ["Desafío", "Significado", "Autonomía"],
                  color: "from-orange-500 to-red-500",
                },
                {
                  nombre: "DUTY (Deber)",
                  items: ["Equidad", "Confianza", "Trascendencia"],
                  color: "from-green-500 to-emerald-500",
                },
              ].map((motivador, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${motivador.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}
                    >
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <CardTitle className="text-sm text-center">{motivador.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {motivador.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Reportes Individuales */}
        <div className="space-y-6 mt-12">
          <div className="text-center space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold">Reportes Individuales</h3>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
              Diferentes formatos de reportes para adaptarse a tus necesidades de evaluación
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="border-2 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => window.open("/documentos/reportes/Informe con nivel ideal.pdf", "_blank")}
            >
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Con Perfil Ideal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Compara los resultados del evaluado con un perfil ideal predefinido, mostrando el ajuste a las
                  competencias críticas del puesto. Ideal para procesos de selección donde se busca un perfil
                  específico.
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-2 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => window.open("/documentos/reportes/Informe sin nivel ideal.pdf", "_blank")}
            >
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Sin Perfil Ideal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Presenta los resultados directos del evaluado sin comparación con un perfil específico. Útil para
                  evaluaciones de desarrollo o cuando no existe un perfil ideal definido.
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-2 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => window.open("/documentos/reportes/Informe resumen con nivel ideal.pdf", "_blank")}
            >
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Reporte Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Visualización compacta de todos los resultados en una sola página. Perfecto para tener una vista
                  rápida y general del perfil del evaluado sin perder información relevante.
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-2 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => window.open("/documentos/reportes/Informe participante con nivel ideal.pdf", "_blank")}
            >
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Para el Evaluado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Reporte diseñado específicamente para compartir con el evaluado, incluyendo retroalimentación
                  constructiva y recomendaciones para su desarrollo personal y profesional.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reportes Grupales */}
        <div className="bg-muted/50 rounded-2xl p-8 border-2 space-y-4 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">Reportes Grupales</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Permite comparar grupos de participantes entre sí, generando rankings por competencia o adecuación al
            perfil. También se muestra comparación con la media del mercado.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Visualiza competencias representativas como fortalezas y oportunidades para detectar necesidades de
            desarrollo y establecer planes acorde a los resultados.
          </p>
        </div>

        {/* Video */}
        <div className="space-y-6 mt-12">
          <div className="space-y-3 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold text-balance">Utilidad de los Reportes</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
              Cómo interpretar los resultados y utilizar los reportes para decisiones organizacionales.
            </p>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl ring-1 ring-black/5 max-w-4xl mx-auto">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/jUY4txWQeTE"
              title="Utilidad de los Reportes de Multiplicity"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
