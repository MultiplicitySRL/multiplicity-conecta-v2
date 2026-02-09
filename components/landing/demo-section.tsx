"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X, Sparkles, CheckCircle2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Participant {
  id: string
  nombre: string
  apellido: string
  posicion: string
  correo: string
}

export function DemoSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", nombre: "", apellido: "", posicion: "", correo: "" },
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  const addParticipant = () => {
    const newId = (participants.length + 1).toString()
    setParticipants([...participants, { id: newId, nombre: "", apellido: "", posicion: "", correo: "" }])
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id))
    }
  }

  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setParticipants([{ id: "1", nombre: "", apellido: "", posicion: "", correo: "" }])
      setIsOpen(false)
    }, 5000)
  }

  return (
    <section id="demo" className="py-12 md:py-14 px-4 border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Experimenta Multiplicity</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Benefits and Process */}
          <div className="space-y-5">
            <p className="text-base text-muted-foreground leading-relaxed">
              Descubre cómo Multiplicity evalúa competencias, aptitudes y motivadores de forma integral.
            </p>
            <div className="space-y-3">
              {[
                { icon: Users, text: "Evaluación completa para múltiples participantes" },
                { icon: CheckCircle2, text: "Reportes individuales y grupales incluidos" },
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

          {/* Right: CTA Card */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Demo Gratuito</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Solicita acceso y recibe una evaluación completa sin costo
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="text-base px-8 py-5 h-auto shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Solicitar Demo
            </Button>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Solicitar Demo Gratuito</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed pt-2">
                Completa el formulario con los datos de los participantes que realizarán el demo. Una vez completado por
                todos, te propondremos una reunión para analizar los resultados.
              </DialogDescription>
            </DialogHeader>

            {showSuccess ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-medium">
                    ¡Gracias por tu solicitud! Te enviaremos el demo a tu correo electrónico.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Una vez completado por todos los participantes, te propondremos una reunión para revisar los
                    resultados.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="bg-primary/5 rounded-lg p-5 space-y-2 border border-primary/20">
                  <h4 className="font-semibold">Proceso del Demo</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Cada participante recibirá un correo con acceso al demo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>El demo toma aproximadamente 30-45 minutos por persona</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Una vez completado, agendaremos una reunión para revisar los resultados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Recibirás reportes individuales y grupales de las evaluaciones</span>
                    </li>
                  </ul>
                </div>

                {participants.map((participant, index) => (
                  <div key={participant.id} className="space-y-4 p-5 rounded-lg border bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Participante {index + 1}</h4>
                      {participants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticipant(participant.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`nombre-${participant.id}`} className="text-sm">
                          Nombre
                        </Label>
                        <Input
                          id={`nombre-${participant.id}`}
                          required
                          value={participant.nombre}
                          onChange={(e) => updateParticipant(participant.id, "nombre", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`apellido-${participant.id}`} className="text-sm">
                          Apellido
                        </Label>
                        <Input
                          id={`apellido-${participant.id}`}
                          required
                          value={participant.apellido}
                          onChange={(e) => updateParticipant(participant.id, "apellido", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`posicion-${participant.id}`} className="text-sm">
                        Posición
                      </Label>
                      <Input
                        id={`posicion-${participant.id}`}
                        required
                        value={participant.posicion}
                        onChange={(e) => updateParticipant(participant.id, "posicion", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`correo-${participant.id}`} className="text-sm">
                        Correo electrónico
                      </Label>
                      <Input
                        id={`correo-${participant.id}`}
                        type="email"
                        required
                        value={participant.correo}
                        onChange={(e) => updateParticipant(participant.id, "correo", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addParticipant} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Participante
                </Button>

                <Button type="submit" size="lg" className="w-full py-5 h-auto">
                  Enviar Solicitud
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
