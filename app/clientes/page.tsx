import { Suspense } from "react"
import ClientesPageDynamic from "./page-dynamic"

// La data se carga en el cliente desde /api/resources
export default function ClientesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#E11383] border-t-transparent rounded-full animate-spin" />
            <p className="text-navy font-medium">Cargando...</p>
          </div>
        </main>
      }
    >
      <ClientesPageDynamic />
    </Suspense>
  )
}
