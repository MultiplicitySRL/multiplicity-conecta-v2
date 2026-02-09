"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useState } from "react"
import { Users, Calendar, BarChart3, Plus, Minus, CheckCircle2 } from "lucide-react"

interface Participant {
  nombre: string
  apellido: string
  posicion: string
  email: string
}

export function DemoSection() {
  const [participants, setParticipants] = useState<Participant[]>([
    { nombre: "", apellido: "", posicion: "", email: "" },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const addParticipant = () => {
    if (participants.length < 5) {
      setParticipants([...participants, { nombre: "", apellido: "", posicion: "", email: "" }])
    }
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = [...participants]
    updated[index][field] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const randomId = crypto.randomUUID()

      const payload = {
        id: randomId,
        descripcion:
          "Crea el Negocio, con el demo y los participantes y responsable del demo el cual es el contacto principal del negocio",
        empresa: "",
        contacto_email: "",
        contacto_nombre: "",
        participante1_nombre: participants[0]?.nombre || "",
        participante1_apellido: participants[0]?.apellido || "",
        participante1_posicion: participants[0]?.posicion || "",
        participante1_email: participants[0]?.email || "",
        participante2_nombre: participants[1]?.nombre || "",
        participante2_apellido: participants[1]?.apellido || "",
        participante2_posicion: participants[1]?.posicion || "",
        participante2_email: participants[1]?.email || "",
        participante3_nombre: participants[2]?.nombre || "",
        participante3_apellido: participants[2]?.apellido || "",
        participante3_posicion: participants[2]?.posicion || "",
        participante3_email: participants[2]?.email || "",
        participante4_nombre: participants[3]?.nombre || "",
        participante4_apellido: participants[3]?.apellido || "",
        participante4_posicion: participants[3]?.posicion || "",
        participante4_email: participants[3]?.email || "",
        participante5_nombre: participants[4]?.nombre || "",
        participante5_apellido: participants[4]?.apellido || "",
        participante5_posicion: participants[4]?.posicion || "",
        participante5_email: participants[4]?.email || "",
      }

      console.log("[v0] Sending demo request:", payload)

      const response = await fetch(
        "https://carlossantos147.app.n8n.cloud/webhook/300af3f6-c278-4934-b680-21591df7a825",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("[v0] Demo request sent successfully")
      setIsSubmitted(true)
    } catch (error) {
      console.error("[v0] Error sending demo request:", error)
      alert("Hubo un error al enviar la solicitud. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setTimeout(() => {
      setIsSubmitted(false)
      setParticipants([{ nombre: "", apellido: "", posicion: "", email: "" }])
    }, 300)
  }

  const steps = [
    {
      icon: Users,
      title: "Primer paso",
      description: "Selecciona a los candidatos para evaluar",
      color: "text-white/90",
    },
    {
      icon: BarChart3,
      title: "Segundo paso",
      description: "Recibe los reportes",
      color: "text-purple-200",
    },
    {
      icon: Calendar,
      title: "Tercer paso",
      description: "Agenda tu sesión con un asesor para interpretar tus reportes",
      color: "text-pink-200",
    },
  ]

  return (
    <section id="demo" className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#4A1A4F] to-[#E11383]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                ¿Quieres solicitar un demo?
              </h2>
              <p className="text-lg md:text-xl text-white/90 text-pretty">
                Prueba Multiplicity y descubre cómo puede ayudarte a colocar a las personas correctas en los puestos
                correctos y a conocer todo su potencial.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-lg font-semibold text-white">A continuación, los pasos para solicitar un demo:</p>

              <div className="grid grid-cols-1 gap-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                      <p className="text-sm text-white/80">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#b630b6] hover:bg-white/90 font-bold text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Solicitar demo
                </Button>
              </DialogTrigger>

              <DialogContent className="!max-w-[1400px] !w-[90vw] max-h-[90vh] overflow-y-auto p-0">
                {isSubmitted ? (
                  <div className="py-8 space-y-6 text-center">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-green-600">¡Solicitud enviada con éxito!</h3>
                      <p className="text-muted-foreground text-lg">Hemos recibido tu solicitud de demo.</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-left">
                      <h4 className="font-semibold text-lg">Próximos pasos:</h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            1
                          </span>
                          <span>
                            Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en las próximas 24-48
                            horas.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            2
                          </span>
                          <span>
                            Agendaremos una sesión personalizada con un asesor especializado para tu organización.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            3
                          </span>
                          <span>
                            Los participantes recibirán acceso a la plataforma para realizar las evaluaciones
                            psicométricas.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            4
                          </span>
                          <span>
                            Recibirás un informe completo con los resultados y recomendaciones personalizadas para tu
                            equipo.
                          </span>
                        </li>
                      </ol>
                    </div>

                    <Button
                      onClick={handleCloseDialog}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 font-bold"
                    >
                      Cerrar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col max-h-[90vh]">
                    <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm space-y-3 px-8 pt-8 pb-6 border-b">
                      <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#4A1A4F] to-[#E11383] bg-clip-text text-transparent">
                        Solicitar demo
                      </DialogTitle>
                      <DialogDescription className="text-base text-muted-foreground">
                        Completa la información para iniciar el demo dentro de tu organización.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 px-8">
                      <form onSubmit={handleSubmit} className="space-y-8 py-6">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                1
                              </span>
                              <div>
                                <Label className="text-xl font-bold text-foreground">Candidatos para evaluar</Label>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  Agrega de 1 a 5 personas para participar en el demo
                                </p>
                              </div>
                            </div>
                            <span className="text-lg font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                              {participants.length}/5
                            </span>
                          </div>

                          <div className="space-y-4">
                            {participants.map((participant, index) => (
                              <Card
                                key={index}
                                className="p-6 space-y-4 relative border-2 hover:border-primary/30 transition-all hover:shadow-md bg-gradient-to-br from-background to-muted/5"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-base font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Candidato {index + 1}
                                  </span>
                                  {participants.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeParticipant(index)}
                                      className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Minus className="w-4 h-4 mr-1" />
                                      Eliminar
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`participant-nombre-${index}`} className="text-sm font-medium">
                                      Nombre *
                                    </Label>
                                    <Input
                                      id={`participant-nombre-${index}`}
                                      value={participant.nombre}
                                      onChange={(e) => updateParticipant(index, "nombre", e.target.value)}
                                      required
                                      className="h-12 bg-background"
                                      placeholder="Nombre"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`participant-apellido-${index}`} className="text-sm font-medium">
                                      Apellido *
                                    </Label>
                                    <Input
                                      id={`participant-apellido-${index}`}
                                      value={participant.apellido}
                                      onChange={(e) => updateParticipant(index, "apellido", e.target.value)}
                                      required
                                      className="h-12 bg-background"
                                      placeholder="Apellido"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`participant-posicion-${index}`} className="text-sm font-medium">
                                      Posición *
                                    </Label>
                                    <Input
                                      id={`participant-posicion-${index}`}
                                      value={participant.posicion}
                                      onChange={(e) => updateParticipant(index, "posicion", e.target.value)}
                                      required
                                      className="h-12 bg-background"
                                      placeholder="Cargo"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`participant-email-${index}`} className="text-sm font-medium">
                                      Email *
                                    </Label>
                                    <Input
                                      id={`participant-email-${index}`}
                                      type="email"
                                      value={participant.email}
                                      onChange={(e) => updateParticipant(index, "email", e.target.value)}
                                      required
                                      className="h-12 bg-background"
                                      placeholder="email@ejemplo.com"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}

                            {participants.length < 5 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addParticipant}
                                className="w-full h-14 border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary hover:text-primary transition-all bg-transparent"
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                <span className="font-medium">
                                  Agregar otro candidato ({5 - participants.length} disponibles)
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t px-8 py-6">
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseDialog}
                          className="flex-1 h-12 bg-transparent hover:bg-muted"
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault()
                            const form = e.currentTarget.closest("form")
                            if (form) {
                              form.requestSubmit()
                            }
                          }}
                          size="lg"
                          className="flex-1 h-12 bg-gradient-to-r from-[#4A1A4F] to-[#E11383] hover:opacity-90 font-bold text-base shadow-lg hover:shadow-xl transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative h-[400px] lg:h-[600px] rounded-[20px] overflow-hidden shadow-2xl">
            <Image
              src="/images/quieressolicitardemo.png"
              alt="Equipo colaborando con Multiplicity"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
