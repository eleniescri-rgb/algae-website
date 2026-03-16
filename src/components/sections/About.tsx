"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import aboutContent from "@/content/about.json";

export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#093349" }}
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #47AECC40, transparent)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <span className="section-label-light">
            {t({ en: "Our Story", es: "Nuestra Historia" })}
          </span>
          <h2
            className="font-display text-4xl font-black leading-[1.0] tracking-[-0.03em] sm:text-5xl max-w-xl"
            style={{ color: "#CCE6EA" }}
          >
            {t(aboutContent.sectionTitle)}
          </h2>
        </motion.div>

        {/* Story + Image — two-column editorial layout */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* LEFT — text content (desktop: 6 cols, mobile: below image) */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-start">

            {/* Story title */}
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="font-display text-2xl font-black tracking-[-0.03em] leading-tight mb-7"
              style={{ color: "#47AECC" }}
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
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={index === 0 ? "text-lg leading-relaxed font-medium" : "text-base leading-relaxed"}
                  style={{ color: index === 0 ? "#CCE6EA" : "#729DB9" }}
                >
                  {t(paragraph)}
                </motion.p>
              ))}
            </div>
          </div>

          {/* RIGHT — image (desktop: 6 cols, mobile: above text) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 lg:col-span-6 flex flex-col"
          >
            {/* Image container */}
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

              {/* Dark gradient overlay — bottom to top */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, #093349ee 0%, #09334966 40%, transparent 70%)",
                }}
              />

              {/* Teal top-left corner accent */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #0897B314 0%, transparent 50%)",
                }}
              />

              {/* Inline badge — top right */}
              <div
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full"
                style={{
                  background: "#00000059",
                  backdropFilter: "blur(8px)",
                  border: "1px solid #47AECC26",
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#47AECC" }}
                >
                  {t({ en: "The Problem", es: "El Problema" })}
                </span>
              </div>
            </div>

            {/* Caption */}
            <p
              className="mt-3 text-xs leading-relaxed"
              style={{ color: "#47AECC66" }}
            >
              {t({
                en: "Seasonal sargassum arrivals affecting beachfront hotels across the Caribbean.",
                es: "Las llegadas estacionales de sargazo afectan a los hoteles de playa en todo el Caribe.",
              })}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <span className="section-label-light">
            {t({ en: "Our Values", es: "Nuestros Valores" })}
          </span>
          <h3
            className="font-display text-2xl font-black tracking-[-0.03em]"
            style={{ color: "#CCE6EA" }}
          >
            {t(aboutContent.valuesTitle)}
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "#47AECC14" }}>
          {aboutContent.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, boxShadow: "0 8px 28px #0897B322", transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-7 group"
              style={{ backgroundColor: "#063D57" }}
            >
              {/* Accent line */}
              <div
                className="w-8 h-[2px] mb-5 transition-all duration-300 group-hover:w-14"
                style={{ backgroundImage: "linear-gradient(90deg, #FF751F, #F4AE5B)" }}
              />
              <h4
                className="font-display text-lg font-black tracking-[-0.02em] mb-3"
                style={{ color: "#CCE6EA" }}
              >
                {t(value.title)}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "#729DB9" }}>
                {t(value.description)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
