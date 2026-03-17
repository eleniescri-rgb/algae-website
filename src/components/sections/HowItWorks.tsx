"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import homeContent from "@/content/home.json";

// Distinct accent per step — matches the brand cycling pattern
const stepAccents = ["#FF751F", "#0897B3", "#47AECC", "#FF751F"];

export default function HowItWorks() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  const steps = homeContent.howItWorks.steps;

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#063D57" }}
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, #0897B3, transparent)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <span className="section-label-light">
            {t({ en: "The Process", es: "El Proceso" })}
          </span>
          <h2
            className="font-display text-4xl font-black leading-[1.0] tracking-[-0.03em] sm:text-5xl max-w-xl"
            style={{ color: "#CCE6EA" }}
          >
            {t(homeContent.howItWorks.sectionTitle)}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => {
            const accent = stepAccents[index];
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                {/* Ghost numeral — distinct accent per step */}
                <div
                  className="absolute -top-3 -left-2 font-display font-black leading-none select-none pointer-events-none opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-300"
                  style={{ fontSize: "6.5rem", color: accent, lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {step.stepNumber}
                </div>

                {/* Animated accent border — scaleX reveal */}
                <motion.div
                  className="h-[2px] origin-left"
                  style={{ backgroundColor: accent }}
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.55, delay: 0.08 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Content */}
                <div className="relative pt-10 pr-4 pb-7 pl-0">
                  {/* Step label */}
                  <span
                    className="text-xs font-bold uppercase tracking-[0.18em] block mb-4"
                    style={{ color: accent }}
                  >
                    {t({ en: `Step ${step.stepNumber}`, es: `Paso ${step.stepNumber}` })}
                  </span>

                  <h3
                    className="font-display text-xl font-black leading-tight tracking-[-0.02em] mb-3"
                    style={{ color: "#CCE6EA" }}
                  >
                    {t(step.title)}
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: "#729DB9" }}>
                    {t(step.description)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cross-link to video */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid #47AECC18" }}
        >
          <a
            href="#video"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("video")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold group"
            style={{ color: "#FF751F" }}
          >
            <span style={{ transition: "opacity 0.2s ease" }} className="group-hover:opacity-70">
              {t({ en: "Watch it happen", es: "Míralo en acción" })}
            </span>
            <motion.span
              className="text-base"
              initial={false}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              →
            </motion.span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
