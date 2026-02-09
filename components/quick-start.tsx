"use client"

import { Card } from "@/components/ui/card"
import { Rocket, BookOpen, Lightbulb, ArrowRight } from "lucide-react"

interface QuickStartProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function QuickStart({ activeTab, onTabChange }: QuickStartProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: elementPosition, behavior: "smooth" })
    }
  }

  const quickStartItems = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Nuevo Usuario",
      description: "Comienza con el Tour General",
      action: () => {
        onTabChange("recursos")
        setTimeout(() => scrollToSection("tour-general"), 300)
      },
      color: "from-primary/10 to-primary/5 border-primary/20",
      iconColor: "text-primary",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Crear Procesos",
      description: "Aprende a crear evaluaciones",
      action: () => {
        onTabChange("recursos")
        setTimeout(() => scrollToSection("creacion-procesos"), 300)
      },
      color: "from-navy/10 to-navy/5 border-navy/20",
      iconColor: "text-navy",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Interpretar Resultados",
      description: "Guías de interpretación",
      action: () => {
        onTabChange("recursos")
        setTimeout(() => scrollToSection("reportes-interpretacion"), 300)
      },
      color: "from-orange/10 to-orange/5 border-orange/20",
      iconColor: "text-orange",
    },
  ]

  return (
    <div className="mb-12">
      <h3 className="text-lg font-bold text-navy mb-4">Inicio Rápido</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStartItems.map((item, index) => (
          <Card
            key={index}
            className={`p-5 border bg-gradient-to-br ${item.color} hover:shadow-lg transition-all cursor-pointer group`}
            onClick={item.action}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${item.iconColor}`}>{item.icon}</div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-navy mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
