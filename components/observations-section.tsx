import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Info } from "lucide-react"

export default function ObservationsSection() {
  return (
    <Card className="shadow-lg border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5 text-primary" />
          Observaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="font-semibold mb-2 text-base">Condiciones:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Pago único</li>
            <li>Las licencias de evaluaciones por uso no tienen fecha de vencimiento</li>
            <li>Permitido canjear productos de evaluación</li>
          </ul>
        </div>

        <Separator />

        <div>
          <p className="font-semibold mb-2 text-base">Autogestión</p>
          <p className="font-semibold mb-2 text-base mt-3">Responsabilidades de Multiplicity:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Ofrecer entrenamientos iniciales virtuales: Bases Conceptuales y Taller Gestión de la Plataforma</li>
            <li>Acompañamiento en definición de perfiles</li>
            <li>Otorgar claves de acceso a los administradores</li>
            <li>Soporte incidencias técnicas</li>
            <li>Asesoría en interpretación de resultados</li>
            <li>Manuales de Uso</li>
            <li>
              Talleres para Implementar un Proceso de Valoración Integral:
              <ul className="list-circle list-inside ml-4 mt-1">
                <li>Entrevista por Competencias</li>
                <li>Convirtiendo los datos de evaluación en entendimiento</li>
              </ul>
            </li>
          </ul>
        </div>

        <Separator />

        <div>
          <p className="font-semibold mb-2 text-base">
            Guías: Disponibles a través del Repositorio de Contenido Multiplicity Conecta:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Guía de interpretación de resultados</li>
            <li>Retroalimentación</li>
            <li>Manual de autodesarrollo</li>
            <li>Guía de entrevista por competencias</li>
          </ul>
        </div>

        <Separator />

        <div>
          <p className="font-semibold mb-2 text-base">Responsabilidades del Cliente:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Administrar los perfiles ideales dentro de la plataforma</li>
            <li>Enviar invitaciones y recordatorios a los evaluados</li>
            <li>
              Generar reportes: Estatus de evaluaciones, resultados individuales, resumen, participante y grupales
            </li>
            <li>
              Leer y hacer uso del Manual Funcional de la Plataforma y de los documentos de valoración integral para
              implementar buenas prácticas de evaluación
            </li>
            <li>Administrar (Crear/eliminar) usuarios para los administradores de la plataforma en su empresa</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
