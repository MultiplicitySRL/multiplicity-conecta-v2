import Image from "next/image"
import { Mail, Linkedin, Twitter } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="py-16 md:py-20 px-4 border-t bg-gradient-to-b from-muted/50 to-muted">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6">
            <Image
              src="/images/multiplicity-logo.png"
              alt="Multiplicity Logo"
              width={180}
              height={72}
              className="object-contain"
            />
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Multiplicity – Modelo de Valoración Integral. Diagnóstico de competencias, aptitudes y motivadores con
              rigurosidad metodológica y reportería clara para decisiones acertadas.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Contacto</h3>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <a href="mailto:contacto@multiplicity.com" className="hover:underline">
                contacto@multiplicity.com
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-background border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-background border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Multiplicity. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
