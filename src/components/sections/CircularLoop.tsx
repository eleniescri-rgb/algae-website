"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const nodes = [
  {
    n: "01",
    accent: "#FF751F",
    label: { en: "The Hotel", es: "El Hotel" },
    title: { en: "Sargassum Arrives", es: "El Sargazo Llega" },
    description: {
      en: "Beach staff collect sargassum as part of routine operations. No extra labour, no new contracts.",
      es: "El personal de playa recoge el sargazo como parte de sus operaciones habituales. Sin mano de obra adicional ni nuevos contratos.",
    },
  },
  {
    n: "02",
    accent: "#0897B3",
    label: { en: "The Machine", es: "La Máquina" },
    title: { en: "Processed On-Site", es: "Procesado In Situ" },
    description: {
      en: "The Alga.e unit washes, dries, and compacts the biomass at your property — 95% weight reduction before it leaves.",
      es: "La unidad Alga.e lava, seca y compacta la biomasa en tu propiedad — 95% de reducción de peso antes de que salga.",
    },
  },
  {
    n: "03",
    accent: "#47AECC",
    label: { en: "Industry", es: "La Industria" },
    title: { en: "Value Recovered", es: "Valor Recuperado" },
    description: {
      en: "We collect the dry biomass and supply it to fertilizer, biostimulant, and bio-based materials companies. The hotel pays nothing.",
      es: "Recogemos la biomasa seca y la suministramos a empresas de fertilizantes, bioestimulantes y materiales de base biológica. El hotel no paga nada.",
    },
  },
];

export default function CircularLoop() {
  const { t } = useTranslation();

  return (
    <section className="bg-cool py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="section-label">
            {t({ en: "The Full Loop", es: "El Ciclo Completo" })}
          </span>
          <h2
            className="font-display font-black leading-[1.0] tracking-[-0.03em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--section-heading)" }}
          >
            {t({ en: "Circular from the Start", es: "Circular Desde el Principio" })}
          </h2>
        </motion.div>

        {/* 3-node flow */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          {nodes.map((node, i) => (
            <div key={i} className="flex lg:flex-col items-stretch flex-1">

              {/* Node card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 pb-8 pr-8"
              >
                {/* Animated accent border — scaleX reveal */}
                <motion.div
                  className="h-[3px] origin-left mb-6"
                  style={{ backgroundColor: node.accent }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: 0.06 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Number + label */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-display text-xs font-black tracking-[0.18em]"
                    style={{ color: node.accent }}
                  >
                    {node.n}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-[0.14em]"
                    style={{ color: node.accent, opacity: 0.6 }}
                  >
                    {t(node.label)}
                  </span>
                </div>

                <h3
                  className="font-display font-black tracking-[-0.025em] leading-tight mb-3"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: "var(--section-heading)" }}
                >
                  {t(node.title)}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(node.description)}
                </p>
              </motion.div>

              {/* Arrow between nodes — desktop: right → / mobile: ↓ */}
              {i < 2 && (
                <motion.div
                  className="hidden lg:flex items-start pt-10 px-3 shrink-0 text-lg font-black select-none"
                  style={{ color: "#0897B326" }}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-xs leading-relaxed max-w-lg"
          style={{ color: "var(--section-body)", borderTop: "1px solid var(--section-border)", paddingTop: "1rem" }}
        >
          {t({
            en: "Alga.e retains 100% of the processed biomass and handles all downstream logistics. Hotels participating in the pilot may earn a small revenue share as the model develops.",
            es: "Alga.e retiene el 100% de la biomasa procesada y gestiona toda la logística posterior. Los hoteles participantes en el piloto podrían obtener una pequeña participación en ingresos conforme el modelo madure.",
          })}
        </motion.p>

      </div>
    </section>
  );
}
