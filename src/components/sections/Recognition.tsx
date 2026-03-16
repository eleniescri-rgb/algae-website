"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function Recognition() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#041820" }}>

      {/* Full-bleed photo layer */}
      <div className="absolute inset-0">
        <Image
          src="/images/awards-collage.png"
          alt="Alga.e team winning IE awards"
          fill
          className="object-cover object-center"
          priority={false}
        />
        {/* Dark overlay — keeps photo as texture, text fully legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #041820f5 0%, #041820cc 50%, #04182099 100%)",
          }}
        />
      </div>

      {/* Ghost "2024" numeral — editorial depth */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 font-display font-black leading-none select-none"
        style={{
          fontSize: "clamp(8rem, 22vw, 22rem)",
          color: "#47AECC08",
          lineHeight: 0.85,
          letterSpacing: "-0.05em",
        }}
        aria-hidden="true"
      >
        2024
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-10" style={{ background: "#FF751F" }} />
            <span
              className="text-[0.65rem] font-bold uppercase tracking-[0.22em]"
              style={{ color: "#FF751F" }}
            >
              {t({ en: "Recognition", es: "Reconocimiento" })}
            </span>
          </div>
        </motion.div>

        {/* Award names — oversized stacked display */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-display font-black leading-[0.92] tracking-[-0.04em] mb-2"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                color: "#CCE6EA",
              }}
            >
              {t({
                en: "IE Venture Lab",
                es: "IE Venture Lab",
              })}
            </p>
            <p
              className="font-display font-black leading-[0.92] tracking-[-0.04em]"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                color: "#FF751F",
              }}
            >
              {t({
                en: "Sustainability Award",
                es: "Premio Sostenibilidad",
              })}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="my-7 h-px origin-left"
            style={{ background: "linear-gradient(to right, #47AECC60, transparent)" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-display font-black leading-[0.92] tracking-[-0.04em] mb-2"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                color: "#CCE6EA",
              }}
            >
              {t({
                en: "Best Startup",
                es: "Mejor Startup",
              })}
            </p>
            <p
              className="font-display font-black leading-[0.92] tracking-[-0.04em]"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                color: "#FF751F",
              }}
            >
              {t({
                en: "IE University — 2024",
                es: "IE University — 2024",
              })}
            </p>
          </motion.div>
        </div>

        {/* Bottom caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-sm max-w-sm leading-relaxed"
          style={{ color: "#729DB9" }}
        >
          {t({
            en: "Recognised at IE University's annual competition for innovation, venture viability, and sustainability impact.",
            es: "Reconocidos en la competición anual de IE University por innovación, viabilidad empresarial e impacto en sostenibilidad.",
          })}
        </motion.p>
      </div>

    </section>
  );
}
