"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

// ── Animated counter (unchanged logic) ────────────────────────────────────────
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!isInView) return;
    if (target === 0) { setCount(0); return; }
    const duration = 1400;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ── Solution stats (3 Alga.e achievements) ────────────────────────────────────
const solutionStats = [
  {
    value: 95,
    suffix: "%",
    label: { en: "Volume Reduction", es: "Reducción de Volumen" },
    sublabel: { en: "of sargassum volume, dried on-site", es: "del volumen de sargazo, secado in situ" },
  },
  {
    value: 0,
    prefix: "€",
    label: { en: "Upfront Investment", es: "Inversión Inicial" },
    sublabel: { en: "zero CAPEX deployment model", es: "modelo sin inversión de capital" },
  },
  {
    value: 3,
    suffix: " days",
    label: { en: "To Deploy", es: "Para Desplegar" },
    sublabel: { en: "average pilot setup time", es: "tiempo promedio de configuración del piloto" },
  },
];

export default function StatsStrip() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#093349", borderBottom: "1px solid #47AECC1a" }}
    >
      {/* SVG grain — same as Hero */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="stats-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stats-noise)" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Tier 1: Problem statement ($150M) ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-10 lg:py-14"
        >
          <p
            className="mb-1 text-xs font-medium uppercase tracking-[0.16em]"
            style={{ color: "#47AECC66" }}
          >
            {t({ en: "The scale of the problem", es: "La escala del problema" })}
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span
              className="font-display font-black leading-none tracking-[-0.05em]"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 7rem)",
                color: "#CCE6EA",
              }}
            >
              <AnimatedCounter target={150} prefix="$" suffix="M" />
            </span>
            <span
              className="max-w-sm text-base leading-snug"
              style={{ color: "#47AECC" }}
            >
              {t({
                en: "spent by Quintana Roo hotels on sargassum removal in 2025 alone",
                es: "gastados por hoteles de Quintana Roo en remoción de sargazo solo en 2025",
              })}
            </span>
          </div>
        </motion.div>

        {/* ── Gradient divider ───────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            border: "none",
            background: "linear-gradient(90deg, transparent 0%, #0897B3 40%, transparent 100%)",
          }}
        />

        {/* ── Tier 2: Solution stats (95%, €0, 3 days) ──────────────────────── */}
        <div className="grid grid-cols-1 gap-y-8 py-10 sm:grid-cols-3 lg:py-12">
          {solutionStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <span
                className="font-display mb-1.5 font-black leading-none tracking-[-0.04em]"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "#FF751F",
                }}
              >
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </span>
              <p
                className="font-display mb-1 text-sm font-black tracking-[-0.01em]"
                style={{ color: "#CCE6EA" }}
              >
                {t(stat.label)}
              </p>
              <p className="text-xs leading-snug" style={{ color: "#47AECC99" }}>
                {t(stat.sublabel)}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
