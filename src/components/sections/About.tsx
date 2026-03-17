"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import aboutContent from "@/content/about.json";
import { EASE, BRAND_ACCENTS, VIEWPORT } from "@/lib/brand";

export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#093349" }}
    >
      {/* SVG noise grain */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]"
        aria-hidden="true"
      >
        <filter id="about-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#about-noise)" />
      </svg>

      {/* Ghost watermark */}
      <div
        className="pointer-events-none absolute -right-4 top-0 font-display font-black leading-none select-none"
        style={{
          fontSize: "clamp(14rem, 28vw, 26rem)",
          color: "#47AECC05",
          letterSpacing: "-0.05em",
          lineHeight: 0.85,
        }}
        aria-hidden="true"
      >
        A
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Section label ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT.loose}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-5"
        >
          <span className="section-label-light">
            {t({ en: "Our Story", es: "Nuestra Historia" })}
          </span>
        </motion.div>

        {/* ── Big editorial headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT.loose}
          transition={{ duration: 0.75, ease: EASE }}
          className="mb-14 lg:mb-20"
        >
          <h2
            className="font-display font-black leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)" }}
          >
            <span style={{ color: "#CCE6EA" }}>
              {t({ en: "A Crisis Turned", es: "Una Crisis Convertida" })}
            </span>
            <br />
            <span style={{ color: "#FF751F" }}>
              {t({ en: "Into an Opportunity", es: "en una Oportunidad" })}
            </span>
          </h2>
        </motion.div>

        {/* ── Image + Story ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 lg:mb-20">

          {/* LEFT — image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT.default}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-5"
          >
            <motion.div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "3/4",
                maxHeight: "520px",
                boxShadow: "0 32px 80px #00000055, 0 0 0 1px #47AECC1a",
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.5, ease: EASE } }}
            >
              <Image
                src="/images/sargassum-beach.jpg"
                alt="Sargassum seaweed covering a Caribbean beach"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, #093349d0 0%, transparent 50%), linear-gradient(160deg, #0897B318 0%, transparent 55%)",
                }}
              />
              {/* Location badge */}
              <motion.div
                className="absolute bottom-5 left-5 px-3 py-2 rounded-lg"
                style={{
                  background: "#09334988",
                  backdropFilter: "blur(8px)",
                  border: "1px solid #47AECC22",
                }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT.default}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#47AECC" }}
                >
                  {t({ en: "Caribbean Coast", es: "Costa Caribeña" })}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT — story text */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-5">
              {aboutContent.story.content.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT.tight}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
                  className={
                    index === 0
                      ? "text-lg leading-relaxed font-medium"
                      : "text-base leading-relaxed"
                  }
                  style={{ color: index === 0 ? "#CCE6EA" : "#729DB9" }}
                >
                  {t(paragraph)}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Values ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT.default}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-4"
          style={{ borderTop: "1px solid #47AECC18", paddingTop: "2.5rem" }}
        >
          <span className="section-label-light">
            {t({ en: "Our Values", es: "Nuestros Valores" })}
          </span>
          <h3
            className="font-display font-black tracking-[-0.03em]"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "#CCE6EA" }}
          >
            {t(aboutContent.valuesTitle)}
          </h3>
        </motion.div>

        <div>
          {aboutContent.values.map((value, index) => {
            const accent = BRAND_ACCENTS[index % BRAND_ACCENTS.length];
            return (
              <motion.div
                key={index}
                className="flex gap-4 py-3 cursor-default"
                style={{ borderTop: `1px solid ${accent}22` }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT.flush}
                transition={{ duration: 0.45, delay: index * 0.09, ease: EASE }}
                whileHover={{ x: 4, transition: { duration: 0.2, ease: EASE } }}
              >
                <div className="shrink-0 pt-0.5 flex flex-col items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1"
                    style={{ backgroundColor: accent }}
                  />
                  <span
                    className="font-display font-black tabular-nums"
                    style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: accent, opacity: 0.6 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-display font-black tracking-[-0.025em] leading-snug mb-1"
                    style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)", color: "#CCE6EA" }}
                  >
                    {t(value.title)}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#729DB9" }}>
                    {t(value.description)}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div style={{ borderTop: "1px solid #47AECC18" }} />
        </div>

      </div>
    </section>
  );
}
