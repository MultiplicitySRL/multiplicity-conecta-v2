"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, TrendingUp } from "lucide-react"

interface ProgressTrackerProps {
  completedResources: string[]
  activeTab: string
}

export function ProgressTracker({ completedResources, activeTab }: ProgressTrackerProps) {
  // Total resources available in recursos tab
  const totalResourcesRecursos = 60
  const totalResourcesAcerca = 6

  const totalResources = activeTab === "recursos" ? totalResourcesRecursos : totalResourcesAcerca
  const completedCount = completedResources.length
  const progressPercentage = Math.round((completedCount / totalResources) * 100)

  // Don't show if no progress yet
  if (completedCount === 0) return null

  return (
    <Card className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-navy/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-full p-2">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Tu Progreso</h3>
            <p className="text-sm text-gray-600">
              {completedCount} de {totalResources} recursos completados
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-2xl font-bold text-navy">{progressPercentage}%</span>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-3" />
    </Card>
  )
}
