import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { BusinessModelSection } from "@/components/landing/business-model-section"
import { ReportsSection } from "@/components/landing/reports-section"
import { DemoSection } from "@/components/landing/demo-section"
import { MeetingSection } from "@/components/landing/meeting-section"
import { FAQSection } from "@/components/landing/faq-section"
import { FooterSection } from "@/components/landing/footer-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <HeroSection />
      <AboutSection />
      <BusinessModelSection />
      <ReportsSection />
      <DemoSection />
      <MeetingSection />
      <FAQSection />
      <FooterSection />
    </div>
  )
}
