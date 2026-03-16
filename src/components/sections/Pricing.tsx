"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import pilotContent from "@/content/pilot.json";

export default function Pricing() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  const pilot = pilotContent.tiers.find((tier) => tier.id === "pilot")!;

  const handleScrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(
        new CustomEvent("pilot:interest", { detail: { interest: pilot.interestValue } })
      );
    }
  };

  return (
    <section id="pilot" className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Dark ocean background */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "#063D57" }} />

      {/* Background photo */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/caribbean-resort.jpg"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover object-center"
          priority={false}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, #063D57e8 0%, #063D57cc 50%, #063D57f0 100%)" }}
        />
      </div>

      {/* Top edge rule */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #47AECC30, transparent)" }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className="h-px origin-left"
              style={{ background: "#FF751F" }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-10" />
            </motion.div>
            <span className="section-label-light" style={{ color: "#FF751F", marginBottom: 0 }}>
              {t({ en: "Pilot Program", es: "Programa Piloto" })}
            </span>
          </div>
          <h2
            className="font-display font-black leading-[0.92] tracking-[-0.04em] max-w-2xl"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#CCE6EA" }}
          >
            {t(pilotContent.sectionTitle)}
          </h2>
        </motion.div>

        {/* Two-column offer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT — offer context */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <h3
              className="font-display text-3xl font-black tracking-[-0.03em] leading-tight mb-5"
              style={{ color: "#CCE6EA" }}
            >
              {t(pilot.title)}
            </h3>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#729DB9" }}>
              {t(pilot.description)}
            </p>

            {/* Key metric callout — float (outer) + hover scale (inner) */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <motion.div
                className="inline-flex flex-col py-5 px-6 rounded-2xl cursor-default"
                style={{
                  background: "#09334966",
                  border: "1px solid #47AECC20",
                  backdropFilter: "blur(8px)",
                }}
                whileHover={{ scale: 1.04, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              >
              <span
                className="font-display text-5xl font-black tracking-[-0.04em] leading-none"
                style={{ color: "#FF751F" }}
              >
                €0
              </span>
              <span className="text-sm mt-1.5 font-medium" style={{ color: "#47AECC" }}>
                {t({ en: "upfront investment required", es: "inversión inicial requerida" })}
              </span>
            </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT — features + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            {/* Feature list */}
            <div className="mb-10">
              {pilot.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4 py-4 cursor-default"
                  style={{ borderTop: "1px solid #47AECC18" }}
                  whileHover={{ x: 6, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <motion.div
                    className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#FF751F1a", border: "1px solid #FF751F40" }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Check size={11} style={{ color: "#FF751F" }} />
                  </motion.div>
                  <span className="text-sm leading-snug" style={{ color: "#A8C8D8" }}>
                    {t(feature)}
                  </span>
                </motion.div>
              ))}
              <div style={{ borderTop: "1px solid #47AECC18" }} />
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                size="lg"
                className="group gap-3 active:scale-[0.97]"
                style={{
                  backgroundColor: "#FF751F",
                  color: "white",
                  boxShadow: "0 4px 28px #FF751F59",
                  transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease",
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.transform = "scale(1.03)";
                  b.style.boxShadow = "0 6px 36px #FF751F7a";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.transform = "scale(1)";
                  b.style.boxShadow = "0 4px 28px #FF751F59";
                }}
                onClick={handleScrollToContact}
              >
                {t(pilot.ctaText)}
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <p className="mt-4 text-xs" style={{ color: "#47AECC66" }}>
                {t({ en: "Limited pilot slots available.", es: "Cupos piloto limitados." })}
              </p>
              <p className="mt-1 text-xs" style={{ color: "#47AECC55" }}>
                {t({ en: "Fill out the short form below — we'll review and respond within 48 hours.", es: "Completa el breve formulario — revisaremos y responderemos en 48 horas." })}
              </p>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
