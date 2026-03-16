"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ClipboardList, BookOpen, Users2, Check, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import pilotContent from "@/content/pilot.json";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ClipboardList,
  BookOpen,
  Users2,
};

export default function Pricing() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  const handleScrollToContact = (interestValue: string) => {
    const el = document.querySelector("#contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("pilot:interest", { detail: { interest: interestValue } }));
    }
  };

  return (
    <section id="pilot" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Dark ocean background — brand #063D57 */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "#063D57" }} />

      {/* Background photo — replace src with a Caribbean beachfront hotel photo */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/caribbean-resort.jpg"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover object-center"
          priority={false}
        />
        {/* Heavy dark overlay so text remains legible */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, #063D57e8 0%, #063D57cc 50%, #063D57f0 100%)" }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(#47AECC 1px, transparent 1px), linear-gradient(90deg, #47AECC 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.03,
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#47AECC" }}
          >
            {t({ en: "Pilot Program", es: "Programa Piloto" })}
          </span>
          <h2
            className="font-display mb-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl"
            style={{ color: "#CCE6EA" }}
          >
            {t(pilotContent.sectionTitle)}
          </h2>
          <p
            className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "#729DB9" }}
          >
            {t(pilotContent.sectionDescription)}
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pilotContent.tiers.map((tier, i) => {
            const Icon = iconMap[tier.icon] ?? ClipboardList;
            const hl = tier.highlighted;

            const cardInner = (
              <div
                className="flex h-full flex-col rounded-2xl p-6"
                style={{
                  background: hl ? "#093349" : "#07304A",
                  ...(hl ? {} : { border: "1px solid #47AECC1f" }),
                }}
              >
                {/* Badge + icon row */}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                    style={
                      hl
                        ? { background: "#FF751F26", color: "#FF9A4D" }
                        : { background: "#47AECC1f", color: "#47AECC" }
                    }
                  >
                    {t(tier.badge)}
                  </span>
                  <div
                    className="inline-flex rounded-xl p-2.5"
                    style={{
                      backgroundImage: hl
                        ? "linear-gradient(135deg, #FF751F, #F4AE5B)"
                        : "linear-gradient(135deg, #0897B3, #47AECC)",
                      boxShadow: hl
                        ? "0 4px 14px #FF751F66"
                        : "0 4px 14px #0897B359",
                    }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-display mb-2 text-xl font-black leading-tight tracking-[-0.02em]"
                  style={{ color: "#CCE6EA" }}
                >
                  {t(tier.title)}
                </h3>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed" style={{ color: "#729DB9" }}>
                  {t(tier.description)}
                </p>

                {/* Divider */}
                <div
                  className="mb-6 h-px w-full"
                  style={{ background: hl ? "#FF751F33" : "#47AECC1a" }}
                />

                {/* Feature list */}
                <ul className="mb-8 flex-1 space-y-3">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: hl ? "#FF751F" : "#47AECC" }}
                      />
                      <span className="text-sm leading-snug" style={{ color: "#A8C8D8" }}>
                        {t(feature)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  size="sm"
                  className="group w-full gap-2 active:scale-[0.97]"
                  style={
                    hl
                      ? {
                          backgroundColor: "#FF751F",
                          color: "white",
                          boxShadow: "0 4px 20px #FF751F66",
                          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
                        }
                      : {
                          backgroundColor: "transparent",
                          border: "1px solid #47AECC4d",
                          color: "#47AECC",
                          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background-color 0.2s ease",
                        }
                  }
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "scale(1.02)";
                    if (hl) b.style.boxShadow = "0 6px 28px #FF751F8c";
                    else b.style.backgroundColor = "#47AECC14";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "scale(1)";
                    if (hl) b.style.boxShadow = "0 4px 20px #FF751F66";
                    else b.style.backgroundColor = "transparent";
                  }}
                  onClick={() => handleScrollToContact(tier.interestValue)}
                >
                  {t(tier.ctaText)}
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </div>
            );

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: hl ? -6 : -4, transition: { duration: 0.25 } }}
                className="relative"
              >
                {hl ? (
                  /* Gradient border wrapper for highlighted */
                  <div
                    className="h-full rounded-2xl p-[1.5px]"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #FF751F, #F4AE5B 50%, #47AECC)",
                      boxShadow: "0 0 40px #FF751F26, 0 8px 32px #00000050",
                    }}
                  >
                    {cardInner}
                  </div>
                ) : (
                  cardInner
                )}

                {/* "Recommended" pill on highlighted */}
                {hl && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                      style={{ backgroundImage: "linear-gradient(135deg, #FF751F, #47AECC)" }}
                    >
                      {t({ en: "Recommended", es: "Recomendado" })}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
