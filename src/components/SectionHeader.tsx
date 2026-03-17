"use client";

import { motion } from "framer-motion";
import { EASE, VIEWPORT } from "@/lib/brand";

interface SectionHeaderProps {
  /** Small eyebrow label above the heading */
  label: string;
  /** Main heading text */
  heading: string;
  /**
   * "light" = dark bg sections (About, Hero, HowItWorks) — uses section-label-light + #CCE6EA text
   * "dark"  = light bg sections (FAQ, Features, VideoSection) — uses section-label + var(--section-heading)
   */
  variant?: "light" | "dark";
  /** clamp() string for heading font-size. Defaults differ by variant. */
  fontSize?: string;
  /** Tailwind margin-bottom class on wrapper. Default: "mb-14" */
  mb?: string;
}

export function SectionHeader({
  label,
  heading,
  variant = "dark",
  fontSize,
  mb = "mb-14",
}: SectionHeaderProps) {
  const isLight = variant === "light";

  const defaultFontSize = isLight
    ? "clamp(2.4rem, 5vw, 4.5rem)"
    : "clamp(2rem, 4vw, 3.2rem)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT.loose}
      transition={{ duration: 0.6, ease: EASE }}
      className={mb}
    >
      <span className={isLight ? "section-label-light" : "section-label"}>
        {label}
      </span>
      <h2
        className="font-display font-black leading-[0.95] tracking-[-0.04em]"
        style={{
          fontSize: fontSize ?? defaultFontSize,
          color: isLight ? "#CCE6EA" : "var(--section-heading)",
        }}
      >
        {heading}
      </h2>
    </motion.div>
  );
}
