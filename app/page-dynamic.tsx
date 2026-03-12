"use client"

import { useState, useEffect } from "react"
import { Plus, ArrowRight, FileText, Calendar, Users, BarChart3, CheckCircle2, Minus, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { AccessGate } from "@/components/access-gate"
import { useUser } from "@/lib/user-context"
import type { LandingItem } from "@/lib/landing-cms"
import { isLandingSection, getSectionItems, getSectionHeader } from "@/lib/landing-cms"

// ─── Helpers ────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(idOrUrl: string): string {
  if (!idOrUrl?.trim()) return ""
  const s = idOrUrl.trim()
  if (!s.includes("/") && !s.includes("?")) return `https://www.youtube.com/embed/${s}`
  try {
    const matchBe = s.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{10,12})(?:\?|$)/)
    if (matchBe) return `https://www.youtube.com/embed/${matchBe[1]}`
    const url = new URL(s.startsWith("http") ? s : `https://${s}`)
    const v = url.searchParams.get("v")
    if (v) return `https://www.youtube.com/embed/${v}`
    const pathId = url.pathname.split("/").filter(Boolean).pop()
    if (pathId) return `https://www.youtube.com/embed/${pathId}`
  } catch {
    // fallback
  }
  return `https://www.youtube.com/embed/${s}`
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

// ─── Hero Section ────────────────────────────────────────────────────────────

// Mapeo de color CSV → sección destino para scroll
const HERO_SCROLL_TARGETS: Record<string, string> = {
  pink: "about",
  "pink-light": "faq",
  navy: "business-model",
  orange: "reports",
}


function DynamicHeroSection({ items }: { items: LandingItem[] }) {
  const handleCardAction = (item: LandingItem) => {
    if (!item.url_archivo) return
    if (item.url_archivo.startsWith("http")) {
      window.open(item.url_archivo, "_blank")
    } else {
      window.open(item.url_archivo, "_blank")
    }
  }

  // Orden fijo de las 7 tarjetas (órdenes 2-8 en el CSV)
  const sorted = [...items].sort((a, b) => a.orden - b.orden)

  // Posición en el grid: tarjetas 0 y 1 (órdenes 2,3) ocupan 2 filas; tarjeta 2 (orden 4) ocupa 2 filas
  // Tarjeta 3 (orden 5) ocupa 2 filas; tarjetas 4,5,6 (órdenes 6,7,8) ocupan 1 fila
  const gridSpan = (index: number) => {
    if (index === 0 || index === 1 || index === 2 || index === 3) return "md:row-span-2"
    return ""
  }

  const renderCard = (item: LandingItem, index: number) => {
    const color = item.color || ""
    const scrollTarget = HERO_SCROLL_TARGETS[color]
    const isImageCard = color === "imagen"
    const isDecorativo = item.tipo === "Decorativo"

    const onClick = () => {
      if (scrollTarget) {
        scrollToSection(scrollTarget)
      } else if (item.url_archivo) {
        handleCardAction(item)
      }
    }

    // Tarjeta con imagen de fondo
    if (isImageCard) {
      return (
        <Card
          key={item.id}
          onClick={onClick}
          className={`group relative overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
        >
          <div className="absolute inset-0">
            <Image src={item.imagen || "/images/agendaunareu.jpg"} alt={item.titulo} fill className="object-cover" />
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
            <Plus className="w-5 h-5 text-[#00BCB4]" strokeWidth={2.5} />
          </div>
        </Card>
      )
    }

    // Tarjeta decorativa roja (¿Qué quieres conocer?)
    if (isDecorativo || color === "red") {
      return (
        <Card
          key={item.id}
          className={`group bg-red text-red-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
        >
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight">
            {item.titulo.split(" ").map((word, i) => (
              <span key={i}>{word}<br /></span>
            ))}
          </h3>
          <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
            <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
          </div>
        </Card>
      )
    }

    // Tarjeta teal (Agenda con asesor)
    if (color === "teal") {
      return (
        <Card
          key={item.id}
          onClick={onClick}
          className={`group relative p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
          style={{ backgroundColor: "#00BCB4", color: "white" }}
        >
          <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5" style={{ color: "#00BCB4" }} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold">{item.titulo}</h3>
        </Card>
      )
    }

    // Tarjeta pink (Acerca de)
    if (color === "pink") {
      return (
        <Card
          key={item.id}
          onClick={onClick}
          className={`group relative p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
          style={{ backgroundColor: "#E11383", color: "white" }}
        >
          <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5" style={{ color: "#E11383" }} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold">{item.titulo}</h3>
        </Card>
      )
    }

    // Tarjeta pink-light (Preguntas frecuentes)
    if (color === "pink-light") {
      return (
        <Card
          key={item.id}
          onClick={onClick}
          className={`group relative bg-pink text-pink-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
        >
          <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-pink" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold">{item.titulo}</h3>
        </Card>
      )
    }

    // Tarjeta navy (Modelo de Negocios)
    if (color === "navy") {
      return (
        <Card
          key={item.id}
          onClick={onClick}
          className={`group relative bg-navy text-navy-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
        >
          <div className="absolute top-4 right-4 w-8 h-8 bg-pink rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-navy" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold">{item.titulo}</h3>
        </Card>
      )
    }

    // Tarjeta orange (Reportes)
    if (color === "orange") {
      return (
        <Card
          key={item.id}
          onClick={onClick}
          className={`group relative bg-orange text-orange-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
        >
          <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-orange" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold">{item.titulo}</h3>
        </Card>
      )
    }

    // Fallback genérico
    return (
      <Card
        key={item.id}
        onClick={onClick}
        className={`group relative bg-navy text-navy-foreground p-6 md:p-8 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-0 flex flex-col justify-end md:col-span-1 ${gridSpan(index)} min-h-[200px] md:min-h-0`}
      >
        <h3 className="text-xl md:text-2xl font-semibold">{item.titulo}</h3>
      </Card>
    )
  }

  return (
    <section className="py-6 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-6xl md:grid-rows-[140px_140px_280px]">
          {/* Logo — siempre primero */}
          <Card className="bg-background p-4 rounded-3xl flex items-center justify-center md:col-span-1 min-h-[100px] md:min-h-0 border-0 shadow-none">
            <Image
              src="/images/multiplicity-logo.png"
              alt="Multiplicity"
              width={270}
              height={110}
              className="h-auto w-full max-w-[270px]"
            />
          </Card>

          {/* Tarjetas dinámicas en orden */}
          {sorted.map((item, index) => renderCard(item, index))}
        </div>
      </div>
    </section>
  )
}

// ─── About Section ───────────────────────────────────────────────────────────

function DynamicAboutSection({ header, items }: { header?: LandingItem; items: LandingItem[] }) {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [activeVideoItem, setActiveVideoItem] = useState<LandingItem | null>(null)

  const handleItemClick = (item: LandingItem) => {
    if (item.tipo === "Video" && item.url_video_youtube) {
      setActiveVideoItem(item)
      setVideoDialogOpen(true)
    } else if (item.url_archivo) {
      window.open(item.url_archivo, "_blank")
    }
  }

  const getImageSrc = (item: LandingItem) => item.imagen || "/placeholder.svg"

  return (
    <section id="about" className="py-16 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            {header?.titulo || "Acerca de Multiplicity"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0"
            >
              <div className="h-72 overflow-hidden flex-shrink-0">
                <img
                  src={getImageSrc(item)}
                  alt={item.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24">
                <h3 className="text-lg font-bold">{item.titulo}</h3>
                <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {activeVideoItem && (
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogContent
            className="max-w-6xl w-[95vw] p-0 gap-0 overflow-hidden rounded-2xl border bg-background shadow-xl lg:max-w-[min(92vw,1600px)] lg:w-[92vw]"
            showCloseButton={true}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b bg-background pr-14">
              <DialogTitle className="text-xl font-bold text-foreground">
                {activeVideoItem.titulo}
              </DialogTitle>
            </div>
            <div className="relative w-full aspect-video bg-black rounded-b-2xl overflow-hidden lg:min-h-[70vh]">
              <iframe
                src={`${getYouTubeEmbedUrl(activeVideoItem.url_video_youtube)}?autoplay=1`}
                title={activeVideoItem.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}

// ─── Business Model Section ──────────────────────────────────────────────────

function DynamicBusinessModelSection({ header, items }: { header?: LandingItem; items: LandingItem[] }) {
  return (
    <section id="business-model" className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            {header?.titulo || "Modelo de Negocios"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {items.map((item) => {
            const isInternal = item.url_archivo && !item.url_archivo.startsWith("http") && !item.url_archivo.includes(".")
            const content = (
              <Card className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer flex flex-col p-0 gap-0">
                <div className="h-72 overflow-hidden flex-shrink-0">
                  <img
                    src={item.imagen || "/placeholder.svg"}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24 flex-shrink-0">
                  <h3 className="text-lg font-bold">{item.titulo}</h3>
                  <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                </div>
              </Card>
            )

            if (isInternal) {
              return (
                <Link key={item.id} href={item.url_archivo} className="block">
                  {content}
                </Link>
              )
            }

            return (
              <div
                key={item.id}
                onClick={() => item.url_archivo && window.open(item.url_archivo, "_blank")}
                className="cursor-pointer"
              >
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Reports Section ─────────────────────────────────────────────────────────

function DynamicReportsSection({ header, items }: { header?: LandingItem; items: LandingItem[] }) {
  const videoItem = items.find((i) => i.orden === 31)
  const plusItems = items.filter((i) => i.subseccion === "Reportes Individuales Plus")
  const basicItem = items.find((i) => i.subseccion === "Reporte Individual Básico")
  const grupalItem = items.find((i) => i.subseccion === "Reporte Grupal")

  const getCardBg = (color: string) => {
    if (color === "teal") return "#00A99D"
    if (color === "orange") return "#F15A24"
    if (color === "navy") return "#1E1A3C"
    return "#00A99D"
  }

  return (
    <section id="reports" className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">
            {header?.titulo || "Reportes de Evaluación"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Card */}
          {videoItem && (
            <Card
              onClick={() => videoItem.url_archivo && window.open(videoItem.url_archivo, "_blank")}
              className="group overflow-hidden rounded-3xl hover:shadow-xl transition-all duration-300 border-0 cursor-pointer lg:row-span-2 flex flex-col p-0 gap-0"
            >
              <div className="relative w-full h-72 lg:h-[calc(100%-6rem)] overflow-hidden flex-shrink-0">
                <Image
                  src={videoItem.imagen || "/global-education.jpeg"}
                  alt={videoItem.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-navy text-navy-foreground p-6 flex items-center justify-between h-24 flex-shrink-0">
                <h3 className="text-lg font-bold">{videoItem.titulo}</h3>
                <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          )}

          {/* Reportes Plus */}
          {plusItems.length > 0 && (
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-5" style={{ color: "#00A99D" }}>
                Reportes Individuales Plus
              </h3>
              <div className="grid grid-cols-1 gap-5">
                {plusItems.map((report) => (
                  <Card
                    key={report.id}
                    className="group text-white p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                    style={{ borderRadius: "16px", backgroundColor: getCardBg(report.color) }}
                    onClick={() => report.url_archivo && window.open(report.url_archivo, "_blank")}
                  >
                    <div className="flex items-start gap-4 justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <FileText className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                        <div>
                          <h4 className="text-base font-semibold mb-2">{report.titulo}</h4>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Reporte Básico */}
            {basicItem && (
              <div>
                <h3 className="text-xl font-bold mb-5" style={{ color: "#F15A24" }}>
                  Reporte Individual Básico
                </h3>
                <Card
                  className="group text-white p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                  style={{ borderRadius: "16px", backgroundColor: getCardBg(basicItem.color) }}
                  onClick={() => basicItem.url_archivo && window.open(basicItem.url_archivo, "_blank")}
                >
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <FileText className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                      <div>
                        <h4 className="text-base font-semibold mb-2">{basicItem.titulo}</h4>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                  </div>
                </Card>
              </div>
            )}

            {/* Reporte Grupal */}
            {grupalItem && (
              <div>
                <h3 className="text-xl font-bold mb-5" style={{ color: "#1E1A3C" }}>
                  Reporte Grupal
                </h3>
                <Card
                  className="group text-white p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                  style={{ borderRadius: "16px", backgroundColor: getCardBg(grupalItem.color) }}
                  onClick={() => grupalItem.url_archivo && window.open(grupalItem.url_archivo, "_blank")}
                >
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <FileText className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                      <div>
                        <h4 className="text-base font-semibold mb-2">{grupalItem.titulo}</h4>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Demo Section ─────────────────────────────────────────────────────────────

interface Participant {
  nombre: string
  apellido: string
  posicion: string
  email: string
}

function DynamicDemoSection({ header, items }: { header?: LandingItem; items: LandingItem[] }) {
  const user = useUser()
  const [participants, setParticipants] = useState<Participant[]>([
    { nombre: "", apellido: "", posicion: "", email: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const steps = items.filter((i) => i.tipo === "Decorativo")
  const stepIcons = [Users, BarChart3, Calendar]

  const addParticipant = () => {
    if (participants.length < 5) {
      setParticipants([...participants, { nombre: "", apellido: "", posicion: "", email: "" }])
    }
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = [...participants]
    updated[index][field] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const randomId = crypto.randomUUID()
      const payload = {
        id: randomId,
        descripcion: "Crea el Negocio, con el demo y los participantes y responsable del demo el cual es el contacto principal del negocio",
        responsable_id: user?.id || "",
        responsable_nombre: user?.nombre || "",
        responsable_email: user?.email || "",
        responsable_cargo: user?.cargo || "",
        empresa_id: user?.empresa || "",
        participante1_nombre: participants[0]?.nombre || "",
        participante1_apellido: participants[0]?.apellido || "",
        participante1_posicion: participants[0]?.posicion || "",
        participante1_email: participants[0]?.email || "",
        participante2_nombre: participants[1]?.nombre || "",
        participante2_apellido: participants[1]?.apellido || "",
        participante2_posicion: participants[1]?.posicion || "",
        participante2_email: participants[1]?.email || "",
        participante3_nombre: participants[2]?.nombre || "",
        participante3_apellido: participants[2]?.apellido || "",
        participante3_posicion: participants[2]?.posicion || "",
        participante3_email: participants[2]?.email || "",
        participante4_nombre: participants[3]?.nombre || "",
        participante4_apellido: participants[3]?.apellido || "",
        participante4_posicion: participants[3]?.posicion || "",
        participante4_email: participants[3]?.email || "",
        participante5_nombre: participants[4]?.nombre || "",
        participante5_apellido: participants[4]?.apellido || "",
        participante5_posicion: participants[4]?.posicion || "",
        participante5_email: participants[4]?.email || "",
      }
      const response = await fetch(
        "https://n8n.srv1464241.hstgr.cloud/webhook/4e292a4c-ff0b-440f-ba99-02d0ccfc0e7c",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      )
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error sending demo request:", error)
      alert("Hubo un error al enviar la solicitud. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setTimeout(() => {
      setIsSubmitted(false)
      setParticipants([{ nombre: "", apellido: "", posicion: "", email: "" }])
    }, 300)
  }

  return (
    <section id="demo" className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#4A1A4F] to-[#E11383]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                {header?.titulo || "¿Quieres solicitar un demo?"}
              </h2>
              {header?.descripcion && (
                <p className="text-lg md:text-xl text-white/90 text-pretty">{header.descripcion}</p>
              )}
            </div>

            {steps.length > 0 && (
              <div className="space-y-6">
                <p className="text-lg font-semibold text-white">A continuación, los pasos para solicitar un demo:</p>
                <div className="grid grid-cols-1 gap-6">
                  {steps.map((step, index) => {
                    const Icon = stepIcons[index] || Users
                    return (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white/90" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{step.titulo}</h3>
                          <p className="text-sm text-white/80">{step.descripcion}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#b630b6] hover:bg-white/90 font-bold text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {header?.texto_boton || "Solicitar demo"}
                </Button>
              </DialogTrigger>

              <DialogContent className="!max-w-[1400px] !w-[90vw] max-h-[90vh] overflow-y-auto p-0">
                {isSubmitted ? (
                  <div className="py-8 space-y-6 text-center">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-green-600">¡Solicitud enviada con éxito!</h3>
                      <p className="text-muted-foreground text-lg">Hemos recibido tu solicitud de demo.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-left">
                      <h4 className="font-semibold text-lg">Próximos pasos:</h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        {[
                          "Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en las próximas 24-48 horas.",
                          "Agendaremos una sesión personalizada con un asesor especializado para tu organización.",
                          "Los participantes recibirán acceso a la plataforma para realizar las evaluaciones psicométricas.",
                          "Recibirás un informe completo con los resultados y recomendaciones personalizadas para tu equipo.",
                        ].map((text, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span>{text}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <Button onClick={handleCloseDialog} size="lg" className="w-full bg-primary hover:bg-primary/90 font-bold">
                      Cerrar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col max-h-[90vh]">
                    <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm space-y-3 px-8 pt-8 pb-6 border-b">
                      <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#4A1A4F] to-[#E11383] bg-clip-text text-transparent">
                        Solicitar demo
                      </DialogTitle>
                      <DialogDescription className="text-base text-muted-foreground">
                        Completa la información para iniciar el demo dentro de tu organización.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 px-8">
                      <form id="demo-form" onSubmit={handleSubmit} className="space-y-8 py-6">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                              <div>
                                <Label className="text-xl font-bold text-foreground">Candidatos para evaluar</Label>
                                <p className="text-sm text-muted-foreground mt-0.5">Agrega de 1 a 5 personas para participar en el demo</p>
                              </div>
                            </div>
                            <span className="text-lg font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                              {participants.length}/5
                            </span>
                          </div>

                          <div className="space-y-4">
                            {participants.map((participant, index) => (
                              <Card key={index} className="p-6 space-y-4 relative border-2 hover:border-primary/30 transition-all hover:shadow-md bg-gradient-to-br from-background to-muted/5">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-base font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Candidato {index + 1}
                                  </span>
                                  {participants.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeParticipant(index)}
                                      className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Minus className="w-4 h-4 mr-1" />
                                      Eliminar
                                    </Button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {(["nombre", "apellido", "posicion", "email"] as const).map((field) => (
                                    <div key={field} className="space-y-2">
                                      <Label htmlFor={`participant-${field}-${index}`} className="text-sm font-medium capitalize">
                                        {field === "posicion" ? "Posición" : field.charAt(0).toUpperCase() + field.slice(1)} *
                                      </Label>
                                      <Input
                                        id={`participant-${field}-${index}`}
                                        type={field === "email" ? "email" : "text"}
                                        value={participant[field]}
                                        onChange={(e) => updateParticipant(index, field, e.target.value)}
                                        required
                                        className="h-12 bg-background"
                                        placeholder={field === "email" ? "email@ejemplo.com" : field === "posicion" ? "Cargo" : field.charAt(0).toUpperCase() + field.slice(1)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            ))}

                            {participants.length < 5 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addParticipant}
                                className="w-full h-14 border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary hover:text-primary transition-all bg-transparent"
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                <span className="font-medium">Agregar otro candidato ({5 - participants.length} disponibles)</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t px-8 py-6">
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseDialog}
                          className="flex-1 h-12 bg-transparent hover:bg-muted"
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          form="demo-form"
                          size="lg"
                          className="flex-1 h-12 bg-gradient-to-r from-[#4A1A4F] to-[#E11383] hover:opacity-90 font-bold text-base shadow-lg hover:shadow-xl transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative h-[400px] lg:h-[600px] rounded-[20px] overflow-hidden shadow-2xl">
            <Image
              src={header?.imagen || "/images/quieressolicitardemo.png"}
              alt="Equipo colaborando con Multiplicity"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Booking Section ──────────────────────────────────────────────────────────

function DynamicBookingSection({ item }: { item?: LandingItem }) {
  const bookingUrl = item?.url_archivo || "https://calendly.com/multiplicity-info/30min"

  return (
    <section id="booking" className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-navy text-center">
            {item?.titulo || "Agenda una reunión con un asesor"}
          </h2>
        </div>
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#b92cc2] to-[#d847a0] hover:from-[#a025ad] hover:to-[#c23d8f] text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(bookingUrl, "_blank")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {item?.texto_boton || "Programar reunión"}
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Dynamic Footer ───────────────────────────────────────────────────────────

function DynamicFooter({ emailItem }: { emailItem?: LandingItem }) {
  const email = emailItem?.titulo || "info@multiplicity.com.do"

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
                href={`mailto:${email}`}
                className="text-navy/80 hover:text-primary transition-colors font-medium"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePageDynamic() {
  const [items, setItems] = useState<LandingItem[] | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/landing?_=${Date.now()}&r=${Math.random()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        })
        if (!res.ok) throw new Error("Error al cargar landing data")
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setItems([])
      }
    }
    load()
  }, [])

  if (items === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#E11383] border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-medium">Cargando...</p>
        </div>
      </main>
    )
  }

  // Usar emoji + nombre exacto del CSV para que el includes() funcione
  const heroItems    = items.filter((i) => i.seccion.includes("Hero") && !isLandingSection(i))
  const aboutHeader  = items.find((i) => i.seccion.includes("Acerca de") && isLandingSection(i))
  const aboutItems   = items.filter((i) => i.seccion.includes("Acerca de") && !isLandingSection(i))
  const businessHeader = items.find((i) => i.seccion.includes("Modelo de Negocios") && isLandingSection(i))
  const businessItems  = items.filter((i) => i.seccion.includes("Modelo de Negocios") && !isLandingSection(i))
  const reportsHeader  = items.find((i) => i.seccion.includes("Reportes") && isLandingSection(i))
  const reportsItems   = items.filter((i) => i.seccion.includes("Reportes") && !isLandingSection(i))
  const demoHeader     = items.find((i) => i.seccion.includes("Demo") && isLandingSection(i))
  const demoItems      = items.filter((i) => i.seccion.includes("Demo") && !isLandingSection(i))
  const bookingItem    = items.find((i) => i.seccion.includes("Booking") && !isLandingSection(i))
  const footerEmailItem = items.find((i) => i.seccion.includes("Footer") && i.tipo === "Email")

  return (
    <AccessGate>
      <main className="min-h-screen">
        <DynamicHeroSection items={heroItems} />
        <DynamicAboutSection header={aboutHeader} items={aboutItems} />
        <DynamicBusinessModelSection header={businessHeader} items={businessItems} />
        <DynamicReportsSection header={reportsHeader} items={reportsItems} />
        <DynamicDemoSection header={demoHeader} items={demoItems} />
        <DynamicBookingSection item={bookingItem} />
        <DynamicFooter emailItem={footerEmailItem} />
      </main>
    </AccessGate>
  )
}
