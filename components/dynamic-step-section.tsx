import { DynamicResourceCard } from "@/components/dynamic-resource-card"
import type { ResourceV3 } from "@/lib/resources-cms-v3"

interface DynamicStepSectionProps {
  stepNumber: string
  stepTitle: string
  resources: ResourceV3[]
  onResourceComplete?: (resourceId: string) => void
}

export function DynamicStepSection({
  stepNumber,
  stepTitle,
  resources,
  onResourceComplete,
}: DynamicStepSectionProps) {
  if (resources.length === 0) return null

  return (
    <div className="w-full max-w-full mx-auto px-6 py-8">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E11383] to-[#C01070] shadow-lg">
              <span className="text-4xl font-black text-white">{stepNumber}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E11383] uppercase tracking-wider mb-1">
                {stepNumber === "1" && "Primer Paso"}
                {stepNumber === "2" && "Segundo Paso"}
                {stepNumber === "3" && "Tercer Paso"}
                {stepNumber === "4" && "Cuarto Paso"}
              </div>
              <h2 className="text-3xl font-bold text-[#1B1733] leading-tight">{stepTitle}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {resources.map((resource, index) => (
          <DynamicResourceCard key={`${resource.seccion}-${resource.orden}-${index}`} resource={resource} onComplete={onResourceComplete} />
        ))}
      </div>
    </div>
  )
}
