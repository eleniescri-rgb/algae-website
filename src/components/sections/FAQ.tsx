"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import faqContent from "@/content/faq.json";
import { EASE, BRAND_ACCENTS } from "@/lib/brand";

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-cool py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-10"
        >
          <span className="section-label">
            {t({ en: "Common Questions", es: "Preguntas Frecuentes" })}
          </span>
          <h2
            className="font-display font-black leading-[0.92] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--section-heading)",
            }}
          >
            {t(faqContent.sectionTitle)}
          </h2>
        </motion.div>

        {/* ── Question list ── */}
        <div>
          {faqContent.questions.map((item, index) => {
            const isOpen = openIndex === index;
            const accent = BRAND_ACCENTS[index % BRAND_ACCENTS.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                  ease: EASE,
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="relative w-full text-left border-t-2 transition-colors duration-300"
                  style={{
                    borderColor: isOpen ? accent : "#0897B322",
                  }}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {/* ── Trigger row ── */}
                  <motion.div
                    className="flex items-start gap-5 py-7"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    {/* Number label */}
                    <span
                      className="font-display text-xs font-black tracking-[0.18em] shrink-0 pt-1.5 select-none"
                      style={{ color: accent }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Question text */}
                    <h3
                      className="font-display font-black tracking-[-0.025em] leading-snug flex-1"
                      style={{
                        fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
                        color: isOpen ? accent : "var(--section-heading)",
                        transition: "color 0.25s ease",
                      }}
                    >
                      {t(item.question)}
                    </h3>

                    {/* Animated chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="shrink-0 mt-1"
                      style={{ color: accent }}
                    >
                      <ChevronDown size={18} strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>

                  {/* ── Answer panel ── */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pl-9 pb-8 pr-8">
                          {/* Accent rule */}
                          <div
                            className="mb-4 h-px w-8"
                            style={{ backgroundColor: accent, opacity: 0.5 }}
                          />
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {t(item.answer)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}

          {/* Closing border */}
          <div
            className="border-t-2"
            style={{ borderColor: "#0897B322" }}
          />
        </div>

      </div>
    </section>
  );
}
