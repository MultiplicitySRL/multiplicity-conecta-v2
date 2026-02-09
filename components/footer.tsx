import Image from "next/image"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-16">
          <div className="relative w-[300px] h-[90px] md:w-[400px] md:h-[120px] lg:w-[500px] lg:h-[150px]">
            <Image
              src="/images/multiplicity-logo.png"
              alt="Multiplicity Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-navy">Contacto</h3>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href="mailto:info@multiplicity.com.do"
                className="text-navy/80 hover:text-primary transition-colors font-medium"
              >
                info@multiplicity.com.do
              </a>
            </div>
            {/* <span className="hidden md:inline text-navy/40">|</span>
            <p className="text-navy/80 font-medium">Natalia Batista</p> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
