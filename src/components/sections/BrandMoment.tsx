"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function BrandMoment() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* SVG grain texture */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.025]" aria-hidden="true">
        <filter id="brand-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#brand-noise)" />
      </svg>

      {/* Radial glow — top center */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "60%",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #47AECC0a 0%, transparent 70%)",
        }}
      />

      {/* Thin top accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #0897B326, transparent)",
        }}
      />

      {/* Thin bottom accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #0897B320, transparent)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7"
        >
          <Image
            src="/logo-white.png"
            alt="Alga.e"
            width={260}
            height={100}
            className="h-20 w-auto sm:h-24 lg:h-28 object-contain invert"
            priority={false}
          />
        </motion.div>

        {/* Brand statement */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl font-black leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl max-w-2xl"
          style={{ color: "#063D57" }}
        >
          {t({
            en: "Sargassum, Reimagined as a Resource.",
            es: "El Sargazo, Reimaginado como un Recurso.",
          })}
        </motion.h2>

        {/* Accent bar */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="my-5 h-[2px] w-16 origin-left relative overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(90deg, #FF751F, #F4AE5B)",
          }}
        >
          <div className="bar-shimmer" />
        </motion.div>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="text-base leading-relaxed max-w-xl"
          style={{ color: "#2E769C" }}
        >
          {t({
            en: "Alga.e develops on-site systems that transform coastal sargassum accumulation into a manageable and reusable biomass stream.",
            es: "Alga.e desarrolla sistemas in situ que transforman la acumulación costera de sargazo en una corriente de biomasa manejable y reutilizable.",
          })}
        </motion.p>

      </div>
    </section>
  );
}
