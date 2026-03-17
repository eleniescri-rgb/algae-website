"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function BrandMoment() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[#fafcfd] dark:bg-[#063D57]">
      {/* SVG grain */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.018]" aria-hidden="true">
        <filter id="bm-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bm-noise)" />
      </svg>

      {/* Ghost text — far right */}
      <div
        className="pointer-events-none absolute right-0 top-0 select-none leading-none font-display font-black text-[#0897B306] dark:text-[#47AECC08]"
        style={{
          fontSize: "clamp(14rem, 32vw, 28rem)",
          lineHeight: 0.8,
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        alg
      </div>


      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-end">

          {/* LEFT — headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:pr-12"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-px h-8 shrink-0 bg-[#FF751F]" />
              <span className="section-label" style={{ color: "#FF751F", marginBottom: 0 }}>
                {t({ en: "Our Mission", es: "Nuestra Misión" })}
              </span>
            </div>

            <h2
              className="font-display font-black leading-[0.88] tracking-[-0.04em] text-[#063D57] dark:text-[#E8F4F7]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
            >
              {t({ en: "Sargassum,", es: "El Sargazo," })}<br />
              <span className="text-[#0897B3] dark:text-[#FF751F]">
                {t({ en: "Reimagined", es: "Reimaginado" })}
              </span><br />
              {t({ en: "as a Resource.", es: "como un Recurso." })}
            </h2>

            {/* Animated accent bar */}
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
            className="lg:col-span-5 lg:pl-12 flex flex-col border-l-0 lg:border-l border-[#0897B314] dark:border-[#47AECC20]"
          >
            {/* Logo — invert on light (white→dark), no invert on dark (white stays white) */}
            <div className="mb-7">
              <Image
                src="/logo-white.png"
                alt="Alga.e"
                width={320}
                height={120}
                className="h-28 w-auto object-contain invert dark:invert-0"
                priority={false}
              />
            </div>

            {/* Brand note */}
            <p className="mt-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#47AECC]">
              {t({ en: "Circular resource recovery", es: "Recuperación circular de recursos" })}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
