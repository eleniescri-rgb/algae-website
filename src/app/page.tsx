"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/analytics";
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

export default function Home() {
  useEffect(() => {
    trackVisit()
  }, [])

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsStrip />
      <Recognition />
      <BrandMoment />
      <Features />
      <HowItWorks />
      <VideoSection />
      <PilotSection />
      <FAQ />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
