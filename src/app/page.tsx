"use client";

import { useEffect } from "react";
import { trackVisit, trackScrollDepth, initSessionTracking } from "@/lib/analytics";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import VideoSection from "@/components/sections/VideoSection";
import PilotSection from "@/components/sections/Pricing";
import StatsStrip from "@/components/sections/StatsStrip";
import FAQ from "@/components/sections/FAQ";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import BrandMoment from "@/components/sections/BrandMoment";
import Recognition from "@/components/sections/Recognition";
import CircularLoop from "@/components/sections/CircularLoop";

export default function Home() {
  useEffect(() => {
    trackVisit()
    // Session duration — fires session_end on tab-hide / page unload
    const cleanup = initSessionTracking()
    return cleanup
  }, [])

  useEffect(() => {
    // Scroll depth — track when user reaches key validation sections
    const sectionIds = ['features', 'pilot'] // 'features' = Benefits, 'pilot' = Pilot Program
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) trackScrollDepth(id) },
        { threshold: 0.2 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsStrip />
      <Recognition />
      <BrandMoment />
      <HowItWorks />
      <VideoSection />
      <CircularLoop />
      <Features />
      <PilotSection />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
