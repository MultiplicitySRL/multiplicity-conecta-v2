"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

const BOOKING_URL = "https://calendly.com/multiplicity-info/30min"

export function BookingSection() {
  return (
    <section id="booking" className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-navy text-center">Agenda una reunión con un asesor</h2>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#b92cc2] to-[#d847a0] hover:from-[#a025ad] hover:to-[#c23d8f] text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(BOOKING_URL, "_blank")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Programar reunión
          </Button>
        </div>
      </div>
    </section>
  )
}
