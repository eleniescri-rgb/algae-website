"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { Building2, Cog, Package, Factory } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type NodePos = "top" | "right" | "bottom" | "left";

const NODES = [
  {
    n: "01",
    Icon: Building2,
    accent: "#FF751F",
    pos: "top" as NodePos,
    label: { en: "The Hotel", es: "El Hotel" },
    title: { en: "Sargassum Arrives", es: "El Sargazo Llega" },
    description: {
      en: "Beach staff collect sargassum during routine clean-ups — no extra contracts.",
      es: "El personal recoge el sargazo en sus limpiezas habituales — sin contratos extra.",
    },
  },
  {
    n: "02",
    Icon: Cog,
    accent: "#0897B3",
    pos: "right" as NodePos,
    label: { en: "The Machine", es: "La Máquina" },
    title: { en: "Processed On-Site", es: "Procesado In Situ" },
    description: {
      en: "Alga.e washes, dries, and compacts the biomass — 95% volume reduction.",
      es: "Alga.e lava, seca y compacta la biomasa — 95% de reducción de volumen.",
    },
  },
  {
    n: "03",
    Icon: Package,
    accent: "#47AECC",
    pos: "bottom" as NodePos,
    label: { en: "Biomass Output", es: "Biomasa Resultante" },
    title: { en: "Dry & Compact", es: "Seca y Compacta" },
    description: {
      en: "Stable, low-odour dry biomass ready for industrial collection.",
      es: "Biomasa seca, estable y de bajo olor lista para recolección industrial.",
    },
  },
  {
    n: "04",
    Icon: Factory,
    accent: "#FF751F",
    pos: "left" as NodePos,
    label: { en: "Industry", es: "La Industria" },
    title: { en: "Value Recovered", es: "Valor Recuperado" },
    description: {
      en: "Supplied to fertiliser, biostimulant, and bio-based materials companies.",
      es: "Suministrada a fertilizantes, bioestimulantes y materiales de base biológica.",
    },
  },
];

// SVG circle: cx=250 cy=250 r=150 in a 500×500 viewBox
// Arrowheads at midpoints between nodes (clockwise direction)
// Angles in SVG convention: 0°=right, clockwise positive
// Midpoints: Hotel(270°)→Machine(0°) ≈ 315°; Machine(0°)→Biomass(90°) ≈ 45°; etc.
// Tangent for clockwise at angle θ = θ + 90°
const ARROWS = [
  { x: 356.1, y: 143.9, rotate: 45 },   // Hotel → Machine (NE)
  { x: 356.1, y: 356.1, rotate: 135 },  // Machine → Biomass (SE)
  { x: 143.9, y: 356.1, rotate: 225 },  // Biomass → Industry (SW)
  { x: 143.9, y: 143.9, rotate: 315 },  // Industry → Hotel (NW)
];

// Framer Motion style (uses MotionStyle for translateX/Y + whileHover scale compat)
const NODE_STYLES: Record<NodePos, MotionStyle> = {
  top:    { position: "absolute", top: "20%", left: "50%", translateX: "-50%", translateY: "-50%" },
  right:  { position: "absolute", top: "50%", left: "80%", translateX: "-50%", translateY: "-50%" },
  bottom: { position: "absolute", top: "80%", left: "50%", translateX: "-50%", translateY: "-50%" },
  left:   { position: "absolute", top: "50%", left: "20%", translateX: "-50%", translateY: "-50%" },
};

export default function CircularLoop() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <section className="bg-cool py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <span className="section-label">
            {t({ en: "The Full Loop", es: "El Ciclo Completo" })}
          </span>
          <h2
            className="font-display font-black leading-[0.95] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--section-heading)" }}
          >
            {t({ en: "Circular from the Start", es: "Circular Desde el Principio" })}
          </h2>
        </motion.div>

        {/* ── Desktop: circular SVG diagram ── */}
        <motion.div
          className="hidden lg:block relative w-full max-w-[540px] aspect-square mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* SVG connector layer */}
          <svg
            viewBox="0 0 500 500"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {/* Soft glow track ring */}
            <circle
              cx="250" cy="250" r="150"
              stroke="#0897B3"
              strokeWidth="28"
              fill="none"
              opacity="0.05"
            />
            {/* Thin guide track */}
            <circle
              cx="250" cy="250" r="150"
              stroke="#0897B3"
              strokeWidth="1"
              fill="none"
              opacity="0.2"
            />

            {/* Animated flowing dashes — clockwise circular flow */}
            <motion.circle
              cx="250" cy="250" r="150"
              stroke="#0897B3"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10 30"
              initial={{ opacity: 0, strokeDashoffset: 0 }}
              animate={isInView ? { opacity: 1, strokeDashoffset: [0, -40] } : {}}
              transition={{
                opacity: { duration: 0.5, delay: 0.55 },
                strokeDashoffset: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.55,
                },
              }}
            />

            {/* Directional arrowheads at midpoints between nodes */}
            {ARROWS.map((arrow, i) => (
              <motion.g
                key={i}
                transform={`translate(${arrow.x},${arrow.y}) rotate(${arrow.rotate})`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.75 + i * 0.1 }}
              >
                <polygon points="-5,-3.5 5,0 -5,3.5" fill="#FF751F" />
              </motion.g>
            ))}
          </svg>

          {/* Center label */}
          <motion.div
            className="absolute top-1/2 left-1/2 z-10 pointer-events-none"
            style={{ translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="text-center px-3 py-2.5 rounded-xl"
              style={{
                background: "var(--color-background, #F0F8FA)",
                border: "1px solid #0897B326",
                boxShadow: "0 2px 20px #0897B31a",
              }}
            >
              <p
                className="font-bold uppercase leading-[1.55] whitespace-pre-line"
                style={{
                  fontSize: "0.52rem",
                  letterSpacing: "0.13em",
                  color: "#0897B3",
                  maxWidth: "6.5rem",
                }}
              >
                {t({
                  en: "Circular\nSargassum\nProcessing\nSystem",
                  es: "Sistema\nCircular de\nSargazo",
                })}
              </p>
            </div>
          </motion.div>

          {/* Node cards — positioned at N/E/S/W, centered at circle edge */}
          {NODES.map((node, i) => (
            <motion.div
              key={i}
              style={{ ...NODE_STYLES[node.pos], zIndex: 10, width: "7.5rem", textAlign: "center", cursor: "default", userSelect: "none" }}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
              onHoverStart={() => setHoveredNode(i)}
              onHoverEnd={() => setHoveredNode(null)}
            >
              {/* Icon badge */}
              <div
                className="mx-auto mb-1.5 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: hoveredNode === i ? node.accent : `${node.accent}1a`,
                  border: `1.5px solid ${node.accent}50`,
                  color: hoveredNode === i ? "#fff" : node.accent,
                  boxShadow: hoveredNode === i ? `0 4px 18px ${node.accent}50` : "none",
                  transition: "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <node.Icon size={20} />
              </div>
              {/* Step label */}
              <p
                className="font-bold uppercase leading-none mb-1"
                style={{ fontSize: "0.52rem", letterSpacing: "0.12em", color: node.accent, opacity: 0.75 }}
              >
                {node.n} · {t(node.label)}
              </p>
              {/* Title */}
              <p
                className="font-display font-black tracking-[-0.02em] leading-snug mb-1"
                style={{ fontSize: "0.75rem", color: "var(--section-heading)" }}
              >
                {t(node.title)}
              </p>
              {/* Description */}
              <p
                className="leading-relaxed"
                style={{ fontSize: "0.6rem", color: "var(--section-body)" }}
              >
                {t(node.description)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mobile: vertical timeline flow ── */}
        <div className="lg:hidden">
          {NODES.map((node, i) => (
            <motion.div
              key={i}
              className="flex gap-4"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Icon + vertical connector */}
              <div className="flex flex-col items-center shrink-0 w-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `${node.accent}1a`,
                    border: `1.5px solid ${node.accent}50`,
                    color: node.accent,
                  }}
                >
                  <node.Icon size={18} />
                </div>
                {i < NODES.length - 1 ? (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ minHeight: "1.5rem", background: `${node.accent}30` }}
                  />
                ) : (
                  /* Loopback arrow — last node back to first */
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-px h-3" style={{ background: "#FF751F30" }} />
                    <svg width="36" height="30" viewBox="0 0 36 30" fill="none" aria-hidden="true">
                      <path
                        d="M 18,2 Q 34,2 34,15 Q 34,28 4,28"
                        stroke="#FF751F"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        fill="none"
                        opacity="0.55"
                      />
                      <polygon points="4,22 0,28 8,28" fill="#FF751F" opacity="0.55" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <p
                  className="font-bold uppercase mb-0.5"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: node.accent, opacity: 0.8 }}
                >
                  {node.n} · {t(node.label)}
                </p>
                <h3
                  className="font-display font-black tracking-[-0.025em] leading-tight mb-1.5"
                  style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)", color: "var(--section-heading)" }}
                >
                  {t(node.title)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--section-body)" }}>
                  {t(node.description)}
                </p>
              </div>
            </motion.div>
          ))}

          {/* "Cycle repeats" label */}
          <motion.p
            className="font-bold uppercase pl-14 mt-0.5"
            style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: "#FF751F" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : {}}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            ↺ {t({ en: "Cycle repeats", es: "El ciclo se repite" })}
          </motion.p>
        </div>

        {/* Bottom note */}
        <motion.p
          className="mt-10 text-xs leading-relaxed max-w-lg"
          style={{
            color: "var(--section-body)",
            borderTop: "1px solid var(--section-border)",
            paddingTop: "1rem",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
