"use client"

import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "¿Qué evalúa el modelo?",
    answer: "Competencias, aptitudes y motivadores que muestran las personas.",
  },
  {
    question: "¿Qué garantiza el modelo?",
    answer: "Rigurosidad metodológica y mayor nivel de información para la toma de decisiones acertadas.",
  },
  {
    question: "¿Qué beneficios obtiene la organización?",
    answer: "Atraer, promover y desarrollar colaboradores más afines a los perfiles de éxito.",
  },
  {
    question: "¿Qué gana el evaluado?",
    answer: "Más autoconocimiento y foco en su desarrollo.",
  },
  {
    question: "¿En qué se diferencia de un test tradicional?",
    answer: "Es un modelo de valoración integral con acompañamiento, talleres y reportería robusta.",
  },
]

export function FAQSection() {
  return (
    <section className="py-12 md:py-14 px-4 border-t bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Preguntas Frecuentes</h2>

        <div className="grid md:grid-cols-2 gap-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow p-6 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-semibold leading-tight">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
