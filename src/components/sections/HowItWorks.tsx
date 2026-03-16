"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import homeContent from "@/content/home.json";

export default function HowItWorks() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  const steps = homeContent.howItWorks.steps;

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#063D57" }}
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, #0897B3, transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
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
          {steps.map((step, index) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Ghost numeral — editorial depth */}
              <div
                className="absolute -top-3 -left-2 font-display font-black leading-none select-none pointer-events-none"
                style={{ fontSize: "6.5rem", color: "#47AECC12", lineHeight: 1 }}
                aria-hidden="true"
              >
                {step.stepNumber}
              </div>

              {/* Content */}
              <div
                className="relative pt-12 pr-4 pb-7 pl-0 border-t"
                style={{ borderColor: "#47AECC2a" }}
              >
                {/* Step label */}
                <span
                  className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: "#47AECC" }}
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
          ))}
        </div>
      </div>
    </section>
  );
}
