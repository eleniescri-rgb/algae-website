"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import content from "@/content/home.json";

const metricChips = [
  { value: "95%", label: { en: "volume reduction", es: "reducción de volumen" } },
  { value: "€0", label: { en: "upfront cost", es: "costo inicial" } },
  { value: "3 days", label: { en: "to deploy", es: "para desplegar" } },
];

const Hero = () => {
  const { t } = useTranslation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.13, delayChildren: 0.25 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const handleScrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToHowItWorks = () => {
    document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden px-4 py-20 lg:px-8"
      style={{ backgroundColor: "#063D57" }}
    >
      {/* ── Ambient glows ── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.55, 0.80, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 75% 50% at 50% -5%, #0897B388, transparent 70%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 88% 75%, #FF751F12, transparent 60%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 30% 40% at 5% 70%, #47AECC18, transparent 60%)",
        }}
      />
      {/* Right-side atmosphere — reinforces machine image */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 90% 50%, #0897B322, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(#47AECC 1px, transparent 1px),
            linear-gradient(90deg, #47AECC 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* SVG noise grain */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* ── Content grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8"
      >
        {/* ── Left column: text ── */}
        <div className="text-left lg:col-span-7">

          {/* Pill badge */}
          <motion.div variants={itemVariants} className="mb-5">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase"
              style={{
                letterSpacing: "0.14em",
                color: "#CCE6EA",
                border: "1px solid #47AECC2e",
                background: "#47AECC0f",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#FF751F" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {t({ en: "Pilot Program Open", es: "Programa Piloto Abierto" })}
            </span>
          </motion.div>

          {/* Headline — two lines with typographic contrast */}
          <motion.h1
            variants={itemVariants}
            className="font-display mb-6 text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl"
          >
            <span
              className="block italic"
              style={{
                backgroundImage: "linear-gradient(135deg, #FF751F 0%, #F4AE5B 60%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {t({ en: "Turn Sargassum", es: "Convierte el Sargazo" })}
            </span>
            <span
              className="block"
              style={{ color: "#CCE6EA" }}
            >
              {t({ en: "Into a Resource", es: "en un Recurso" })}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-md text-base leading-relaxed sm:text-lg"
            style={{ color: "#729DB9" }}
          >
            {t(content.hero.subheadline)}
          </motion.p>

          {/* Metric chips */}
          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-wrap gap-3"
            style={{ borderTop: "1px solid #47AECC1a", paddingTop: "1.5rem" }}
          >
            {metricChips.map((chip, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  background: "#09334933",
                  border: "1px solid #47AECC24",
                  backdropFilter: "blur(8px)",
                }}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              >
                <span
                  className="font-display text-sm font-black tracking-tight"
                  style={{ color: "#FF751F" }}
                >
                  {chip.value}
                </span>
                <span className="text-xs" style={{ color: "#729DB9" }}>
                  {t(chip.label)}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={handleScrollToContact}
              className="w-full text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
              style={{
                backgroundColor: "#FF751F",
                color: "white",
                boxShadow: "0 4px 28px #FF751F73",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 36px #FF751F8c";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 28px #FF751F73";
              }}
            >
              {t(content.hero.ctaText)}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleScrollToHowItWorks}
              className="w-full text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
              style={{
                borderColor: "#47AECC40",
                backgroundColor: "#47AECC0d",
                color: "#CCE6EA",
                backdropFilter: "blur(8px)",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#47AECC1f";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#47AECC66";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#47AECC0d";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#47AECC40";
              }}
            >
              {t(content.hero.ctaSecondaryText)}
            </Button>
          </motion.div>
        </div>

        {/* ── Right column: machine image ── */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden lg:col-span-5"
        >
          {/* Teal glow behind machine */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl blur-3xl"
            style={{
              background: "radial-gradient(ellipse 80% 70% at 50% 60%, #0897B350, transparent 70%)",
              transform: "scale(1.1)",
            }}
          />
          {/* Orange accent glow at base */}
          <div
            className="pointer-events-none absolute inset-x-4 bottom-0 h-1/3 blur-2xl"
            style={{
              background: "radial-gradient(ellipse 100% 60% at 50% 100%, #FF751F18, transparent 70%)",
            }}
          />

          {/* Floating machine image */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Image
              src="/machine.png"
              alt="Alga.e on-site sargassum processing system"
              width={640}
              height={420}
              className="w-full"
              style={{
                filter: "invert(1) brightness(0.95) sepia(0.2) hue-rotate(175deg) saturate(0.8)",
                mixBlendMode: "screen",
              }}
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <ChevronDown
          size={24}
          style={{ color: "#47AECC", opacity: 0.35 }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
