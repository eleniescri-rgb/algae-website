"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import aboutContent from "@/content/about.json";

// Distinct accent color per principle
const valueAccents = ["#FF751F", "#0897B3", "#47AECC"];

export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#093349" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="section-label-light">
            {t({ en: "Our Story", es: "Nuestra Historia" })}
          </span>
          <h2
            className="font-display font-black leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", color: "#CCE6EA" }}
          >
            {t(aboutContent.sectionTitle)}
          </h2>
        </motion.div>

        {/* ── Story + Image ── */}
        <div className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* LEFT — text */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-start">

            {/* Story title — bigger, more editorial */}
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black tracking-[-0.03em] leading-tight mb-7"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#47AECC" }}
            >
              {t(aboutContent.story.title)}
            </motion.h3>

            {/* Paragraphs */}
            <div className="space-y-5">
              {aboutContent.story.content.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={index === 0 ? "text-lg leading-relaxed font-medium" : "text-base leading-relaxed"}
                  style={{ color: index === 0 ? "#CCE6EA" : "#729DB9" }}
                >
                  {t(paragraph)}
                </motion.p>
              ))}
            </div>
          </div>

          {/* RIGHT — image */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 lg:col-span-6 flex flex-col"
          >
            <div
              className="relative w-full overflow-hidden rounded-xl flex-1"
              style={{
                aspectRatio: "4/5",
                minHeight: "320px",
                maxHeight: "540px",
                boxShadow: "0 24px 64px #00000059, 0 0 0 1px #47AECC18",
              }}
            >
              <Image
                src="/images/sargassum-beach.jpg"
                alt="Sargassum seaweed covering a Caribbean beach, showing the scale of the problem for beachfront hotels"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, #093349cc 0%, transparent 60%)" }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Values header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2"
        >
          <span className="section-label-light">
            {t({ en: "Our Values", es: "Nuestros Valores" })}
          </span>
          <h3
            className="font-display font-black tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#CCE6EA" }}
          >
            {t(aboutContent.valuesTitle)}
          </h3>
        </motion.div>

        {/* ── Values — bold editorial stack with distinct accent colors ── */}
        <div className="mt-10">
          {aboutContent.values.map((value, index) => {
            const accent = valueAccents[index];
            return (
              <motion.div
                key={index}
                className="relative overflow-hidden py-10 pl-7 cursor-default"
                style={{ borderLeft: `3px solid ${accent}` }}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 5, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
              >
                {/* Ghost numeral — far right background */}
                <motion.div
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none"
                  style={{
                    fontSize: "clamp(6rem, 16vw, 14rem)",
                    color: `${accent}`,
                    opacity: 0.05,
                    lineHeight: 0.85,
                    letterSpacing: "-0.05em",
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.05 }}
                  whileHover={{ opacity: 0.1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.12 }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.div>

                {/* Step label */}
                <motion.span
                  className="text-xs font-bold uppercase tracking-[0.18em] block mb-3"
                  style={{ color: accent }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.12 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>

                {/* Value title — dramatic large display */}
                <h4
                  className="font-display font-black tracking-[-0.03em] leading-tight mb-4 relative z-10"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#CCE6EA" }}
                >
                  {t(value.title)}
                </h4>

                {/* Description */}
                <p
                  className="text-base leading-relaxed max-w-xl relative z-10"
                  style={{ color: "#729DB9" }}
                >
                  {t(value.description)}
                </p>

                {/* Animated bottom separator */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px origin-left"
                  style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
