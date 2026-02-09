import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { BusinessModelSection } from "@/components/business-model-section"
import { ReportsSection } from "@/components/reports-section"
import { DemoSection } from "@/components/demo-section"
import { FAQSection } from "@/components/faq-section"
import { BookingSection } from "@/components/booking-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <BusinessModelSection />
      <ReportsSection />
      <DemoSection />
      {/* <FAQSection /> */}
      <BookingSection />
      <Footer />
    </main>
  )
}
