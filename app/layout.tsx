import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ChatwootWidget } from "@/components/chatwoot-widget"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Multiplicity - Evaluación y Consultoría Empresarial",
  description: "Empresa de evaluación y consultoría empresarial",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        {/* Vercel Analytics solo existe en Vercel; en el EC2 daría 404 en cada página. */}
        {process.env.VERCEL ? <Analytics /> : null}
        <ChatwootWidget />
      </body>
    </html>
  )
}
