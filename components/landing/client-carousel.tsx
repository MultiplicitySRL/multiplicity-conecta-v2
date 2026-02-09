"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const clients = [
  { name: "IESA", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/iesa-logo.png" },
  { name: "Ateneo", src: "https://multiplicityweb.com/wp-content/uploads/2023/03/Logo-Ateneo.png" },
  { name: "Unique", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/unique.png" },
  { name: "IESA 2", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/iesa-logo.png" },
  { name: "Ateneo 2", src: "https://multiplicityweb.com/wp-content/uploads/2023/03/Logo-Ateneo.png" },
  { name: "Unique 2", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/unique.png" },
  { name: "IESA 3", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/iesa-logo.png" },
  { name: "Ateneo 3", src: "https://multiplicityweb.com/wp-content/uploads/2023/03/Logo-Ateneo.png" },
  { name: "Unique 3", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/unique.png" },
  { name: "IESA 4", src: "https://multiplicityweb.com/wp-content/uploads/2022/05/iesa-logo.png" },
]

export function ClientCarousel() {
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isPaused) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      scrollPosition += scrollSpeed

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isPaused])

  return (
    <div
      className="relative w-full overflow-hidden border-y bg-muted/30"
      aria-label="Cartera de clientes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={scrollRef} className="flex gap-8 md:gap-12 py-8 overflow-x-hidden" style={{ scrollBehavior: "auto" }}>
        {[...clients, ...clients].map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            className="flex-shrink-0 w-32 md:w-40 h-16 md:h-20 relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            role="img"
            aria-label={`Logo ${client.name}`}
          >
            <Image
              src={client.src || "/placeholder.svg"}
              alt={`Logo ${client.name}`}
              fill
              className="object-contain"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML =
                    '<div class="w-full h-full flex items-center justify-center bg-muted rounded text-muted-foreground text-sm">Logo</div>'
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
