import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "¿Qué es Multiplicity?",
      answer:
        "Multiplicity es una empresa de evaluación y consultoría empresarial que ayuda a las organizaciones a evaluar su desempeño, identificar áreas de mejora y desarrollar estrategias de crecimiento efectivas.",
    },
    {
      question: "¿Qué tipo de reportes ofrecen?",
      answer:
        "Ofrecemos dos tipos principales de reportes: Multiplicity PLUS (que incluye informes con y sin perfil ideal, informes resumen y del participante) y Multiplicity Básico (que incluye informes básicos y reportes grupales).",
    },
    {
      question: "¿Cómo puedo obtener una cotización?",
      answer:
        "Puedes obtener una cotización utilizando nuestro cotizador en línea o agendando una reunión con uno de nuestros asesores. Estaremos encantados de ayudarte a encontrar la solución perfecta para tu empresa.",
    },
    {
      question: "¿Qué incluye el servicio básico y PLUS?",
      answer:
        "El servicio básico incluye evaluaciones fundamentales y reportes grupales. El servicio PLUS ofrece análisis más detallados con perfiles ideales, informes personalizados del participante y reportes resumen completos.",
    },
    {
      question: "¿Cuánto tarda una evaluación?",
      answer:
        "El tiempo de evaluación varía según el tipo de servicio y el tamaño de la organización. Generalmente, una evaluación básica toma de 2 a 4 semanas, mientras que una evaluación PLUS puede tomar de 4 a 6 semanas para garantizar un análisis completo y detallado.",
    },
  ]

  return (
    <section id="faq" className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">Preguntas Frecuentes</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-[16px] px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
