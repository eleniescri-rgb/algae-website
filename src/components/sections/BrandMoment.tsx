"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function BrandMoment() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#fafcfd" }}
    >
      {/* SVG grain */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.018]" aria-hidden="true">
        <filter id="bm-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bm-noise)" />
      </svg>

      {/* Ghost numeral — far right, low opacity */}
      <div
        className="pointer-events-none absolute right-0 top-0 select-none leading-none font-display font-black"
        style={{
          fontSize: "clamp(14rem, 32vw, 28rem)",
          color: "#0897B306",
          lineHeight: 0.8,
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        alg
      </div>

      {/* Top rule */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, #0897B322, transparent 60%)" }}
      />

      {/* Bottom rule */}
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, #0897B318, transparent 50%)" }}
      />

      {/* Main content — asymmetric 2-col */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-end">

          {/* LEFT — oversized headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:pr-12"
          >
            {/* Vertical orange bar + label */}
            <div className="flex items-center gap-3 mb-7">
              <div className="w-px h-8 shrink-0" style={{ background: "#FF751F" }} />
              <span
                className="section-label"
                style={{ color: "#FF751F", marginBottom: 0 }}
              >
                {t({ en: "Our Mission", es: "Nuestra Misión" })}
              </span>
            </div>

            <h2
              className="font-display font-black leading-[0.88] tracking-[-0.04em]"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
                color: "#063D57",
              }}
            >
              {t({ en: "Sargassum,", es: "El Sargazo," })}<br />
              <span style={{ color: "#0897B3" }}>
                {t({ en: "Reimagined", es: "Reimaginado" })}
              </span><br />
              {t({ en: "as a Resource.", es: "como un Recurso." })}
            </h2>

            {/* Animated accent bar — left-aligned */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{
                scaleX: { duration: 0.5, delay: 0.3 },
                opacity: { duration: 0.5, delay: 0.3 },
                backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" },
              }}
              className="mt-8 h-[2px] w-20 origin-left"
              style={{
                backgroundSize: "200% 100%",
                background: "linear-gradient(90deg, #FF751F, #F4AE5B, #FF751F, #F4AE5B)",
              }}
            />
          </motion.div>

          {/* RIGHT — logo + description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:pl-12 flex flex-col"
            style={{ borderLeft: "1px solid #0897B314" }}
          >
            {/* Logo */}
            <div className="mb-7">
              <Image
                src="/logo-white.png"
                alt="Alga.e"
                width={320}
                height={120}
                className="h-28 w-auto object-contain invert"
                priority={false}
              />
            </div>

            {/* Body copy */}
            <p
              className="text-base leading-[1.75]"
              style={{ color: "#5a7a8a", maxWidth: "380px" }}
            >
              {t({
                en: "Alga.e develops on-site systems that turn coastal sargassum from an operational burden into a recoverable resource — processed at the property, collected by our industrial partners.",
                es: "Alga.e desarrolla sistemas in situ que convierten el sargazo costero de una carga operativa en un recurso recuperable — procesado en la propiedad y recogido por nuestros socios industriales.",
              })}
            </p>

            {/* Small brand note */}
            <p
              className="mt-6 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#47AECC" }}
            >
              {t({ en: "Circular resource recovery", es: "Recuperación circular de recursos" })}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
