"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: { en: string; es: string };
  sublabel: { en: string; es: string };
}

const stats: Stat[] = [
  {
    value: 95,
    suffix: "%",
    label: { en: "Volume Reduction", es: "Reducción de Volumen" },
    sublabel: { en: "in sargassum biomass, on-site", es: "en biomasa, procesado in situ" },
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
    sublabel: { en: "typical installation timeline", es: "tiempo de instalación típico" },
  },
  {
    value: 12,
    suffix: "+",
    label: { en: "Properties", es: "Propiedades" },
    sublabel: { en: "in active pilot evaluation", es: "en evaluación de piloto activa" },
  },
];

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ y: -3, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center px-6 py-10 text-center cursor-default"
              style={{
                borderRight: i < 3 ? "1px solid #47AECC1a" : "none",
                borderBottom: i < 2 ? "1px solid #47AECC1a" : "none",
              }}
            >
              {/* Stat number */}
              <span
                className="font-display mb-1.5 text-4xl font-black leading-none tracking-[-0.04em] sm:text-5xl"
                style={{ color: "#FF751F" }}
              >
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </span>
              <p className="font-display mb-1 text-sm font-black tracking-[-0.01em]" style={{ color: "#CCE6EA" }}>
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
