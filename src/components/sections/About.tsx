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
        <div className="mb-14 lg:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

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
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
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

        {/* ── Values — compact quiet rows ── */}
        <div>
          {aboutContent.values.map((value, index) => {
            const accent = valueAccents[index];
            return (
              <motion.div
                key={index}
                className="flex gap-4 py-3 cursor-default"
                style={{ borderTop: `1px solid ${accent}22` }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
              >
                {/* Accent dot + number */}
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-display font-black tracking-[-0.025em] leading-snug mb-1"
                    style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)", color: "#CCE6EA" }}
                  >
                    {t(value.title)}
                  </h4>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#729DB9" }}
                  >
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
