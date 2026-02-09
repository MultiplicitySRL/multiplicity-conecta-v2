"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen, Video, FileText, CheckCircle2 } from "lucide-react"

interface OnboardingGuideProps {
  onComplete: () => void
}

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Bienvenido al Portal de Clientes",
      description:
        "Este portal contiene todos los recursos que necesitas para aprovechar al máximo la plataforma Multiplicity.",
      icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
    },
    {
      title: "Comienza con el Tour General",
      description:
        "Te recomendamos iniciar con el video del Tour General para familiarizarte con todas las funcionalidades.",
      icon: <Video className="w-12 h-12 text-primary" />,
      action: "Ver Tour",
    },
    {
      title: "Explora por Categorías",
      description:
        "Utiliza el menú lateral para navegar entre tutoriales, documentación técnica, y bases conceptuales según tus necesidades.",
      icon: <BookOpen className="w-12 h-12 text-primary" />,
    },
    {
      title: "Sigue tu Progreso",
      description: "Marca recursos como completados para llevar un seguimiento de tu aprendizaje.",
      icon: <FileText className="w-12 h-12 text-primary" />,
    },
  ]

  const currentStep = steps[step]

  return (
    <Dialog open={true} onOpenChange={onComplete}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{currentStep.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          {currentStep.icon}
          <p className="text-center text-gray-600 text-balance">{currentStep.description}</p>

          <div className="flex gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-all ${
                  index === step ? "bg-primary" : index < step ? "bg-primary/50" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3 w-full">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Anterior
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1)
                } else {
                  onComplete()
                }
              }}
              className="flex-1"
            >
              {step === steps.length - 1 ? "Comenzar" : "Siguiente"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
