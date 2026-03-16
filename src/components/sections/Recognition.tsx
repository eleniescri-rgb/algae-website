"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const awards = [
  {
    title: { en: "IE Venture Lab Sustainability Award", es: "Premio IE Venture Lab de Sostenibilidad" },
    year: "2024",
  },
  {
    title: { en: "Best Startup — IE University", es: "Mejor Startup — IE University" },
    year: "2024",
  },
];

export default function Recognition() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#093349" }}
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FF751F40, transparent)" }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT — award text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <span className="section-label-light">
              {t({ en: "Recognition", es: "Reconocimiento" })}
            </span>

            <h2
              className="font-display text-3xl font-black leading-[1.0] tracking-[-0.03em] sm:text-4xl mb-8"
              style={{ color: "#CCE6EA" }}
            >
              {t({
                en: "Award-Winning from Day One.",
                es: "Premiados desde el Primer Día.",
              })}
            </h2>

            <div className="flex flex-col gap-4">
              {awards.map((award, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="flex items-start gap-4 rounded-xl px-5 py-4"
                  style={{
                    background: "#063D57",
                    border: "1px solid #FF751F26",
                    boxShadow: "0 2px 12px #00000020",
                  }}
                >
                  <div
                    className="shrink-0 mt-0.5 p-2 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #FF751F, #F4AE5B)",
                      boxShadow: "0 2px 8px #FF751F40",
                    }}
                  >
                    <Trophy size={14} className="text-white" />
                  </div>
                  <div>
                    <p
                      className="font-display text-sm font-black tracking-[-0.01em] leading-snug"
                      style={{ color: "#CCE6EA" }}
                    >
                      {t(award.title)}
                    </p>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.12em] mt-0.5 block"
                      style={{ color: "#47AECC" }}
                    >
                      {award.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <p
              className="mt-6 text-sm leading-relaxed"
              style={{ color: "#729DB9" }}
            >
              {t({
                en: "Selected from hundreds of student ventures at IE University's annual competition for innovation and sustainability.",
                es: "Seleccionados entre cientos de iniciativas estudiantiles en la competición anual de IE University por innovación y sostenibilidad.",
              })}
            </p>
          </motion.div>

          {/* RIGHT — photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 24px 64px #00000050, 0 0 0 1px #FF751F1a, 0 0 40px #FF751F0a",
              }}
            >
              <Image
                src="/images/awards-collage.png"
                alt="Alga.e team winning IE Venture Lab Sustainability Award and Best Startup IEU 2024"
                width={1400}
                height={788}
                className="w-full h-auto"
                priority={false}
              />
              {/* Subtle vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, #09334940 0%, transparent 40%)",
                }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
