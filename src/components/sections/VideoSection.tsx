"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import homeContent from "@/content/home.json";

// ─── Video URL helpers ────────────────────────────────────────────────────────

function toYouTubeEmbed(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : url;
}

function toVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}?dnt=1` : url;
}

type EmbedType = "youtube" | "vimeo" | "html5" | "placeholder";

function detectEmbedType(url: string): EmbedType {
  if (!url) return "placeholder";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "html5";
}

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  {
    n: "01",
    title: { en: "Reduced Logistics Complexity", es: "Menor Complejidad Logística" },
    description: {
      en: "Because the biomass is processed on-site, hotels may reduce the need for frequent transport and disposal operations.",
      es: "Al procesar la biomasa in situ, los hoteles pueden reducir la necesidad de operaciones frecuentes de transporte y disposición.",
    },
  },
  {
    n: "02",
    title: { en: "Odor Significantly Reduced", es: "Olor Significativamente Reducido" },
    description: {
      en: "Drying the biomass stabilizes the material and helps reduce the odor associated with decomposing sargassum.",
      es: "Secar la biomasa estabiliza el material y ayuda a reducir el olor asociado a la descomposición del sargazo.",
    },
  },
  {
    n: "03",
    title: { en: "Path to Value Recovery", es: "Vía hacia la Recuperación de Valor" },
    description: {
      en: "What was a costly disposal burden may become a manageable, stable material with potential for future reuse — currently being explored with circular economy and industrial partners.",
      es: "Lo que era una carga costosa de disposición puede convertirse en un material manejable y estable con potencial de reutilización futura, actualmente en exploración con socios de economía circular e industria.",
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoSection() {
  const { t } = useTranslation();
  const content = homeContent.videoSection;
  const videoUrl = content.videoUrl;
  const embedType = detectEmbedType(videoUrl);

  return (
    <section id="video" className="bg-cool py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 lg:mb-12"
        >
          <span className="section-label">
            {t({ en: "The System", es: "El Sistema" })}
          </span>
          <h2
            className="font-display font-black leading-[1.0] tracking-[-0.03em] max-w-xl"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--section-heading)" }}
          >
            {t(content.sectionTitle)}
          </h2>
        </motion.div>

        {/* ── A. System explanation — always visible ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-10 lg:mb-16">

          {/* LEFT — 3-step process */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <h3
              className="font-display text-xl font-black tracking-[-0.03em] leading-tight mb-3"
              style={{ color: 'var(--section-subheading)' }}
            >
              {t({
                en: "What Changes for Your Property",
                es: "Qué Cambia para Tu Propiedad",
              })}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-8 max-w-md">
              {t({
                en: "The Alga.e system fits seamlessly into your existing operations — removing cost, odor, and complexity from your sargassum problem.",
                es: "El sistema Alga.e se integra perfectamente en tus operaciones existentes — eliminando el costo, el olor y la complejidad de tu problema de sargazo.",
              })}
            </p>

            <div>
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-5 py-4 border-t border-[#0897B326] dark:border-[#47AECC30]"
                >
                  <div className="shrink-0 pt-0.5 w-6">
                    <span
                      className="font-display text-xs font-black tracking-[0.1em] tabular-nums"
                      style={{ color: "#0897B3" }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-display text-base font-black tracking-[-0.02em] mb-0.5"
                      style={{ color: 'var(--section-heading)' }}
                    >
                      {t(step.title)}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(step.description)}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-[#0897B326] dark:border-[#47AECC30]" />
            </div>

            {/* Watch CTA — directs attention down to the video */}
            <a
              href="#video-player"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("video-player")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold group"
              style={{ color: "#0897B3" }}
            >
              <span style={{ transition: "opacity 0.2s ease" }} className="group-hover:opacity-80">
                {t({ en: "Watch how it works", es: "Ver cómo funciona" })}
              </span>
              <span
                className="text-base inline-block transition-transform duration-200 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              >
                →
              </span>
            </a>
          </motion.div>

          {/* RIGHT — machine illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-md lg:max-w-none">
              {/* Glow behind machine */}
              <div
                className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_70%_60%_at_50%_55%,#FF751F28_0%,transparent_75%)] dark:[background:radial-gradient(ellipse_70%_60%_at_50%_55%,#FF751F28_0%,transparent_75%)]"
                style={{ transform: "scale(1.15)" }}
              />

              <motion.div
                className="relative z-10 flex items-center justify-center px-2 py-4"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/machine.png"
                  alt="Alga.e on-site processing unit"
                  width={500}
                  height={330}
                  className="w-full h-auto [filter:sepia(1)_saturate(4)_hue-rotate(10deg)_brightness(0.72)] dark:[filter:sepia(1)_saturate(5)_hue-rotate(10deg)_brightness(0.8)]"
                  style={{ maxHeight: "380px", objectFit: "contain" }}
                />
              </motion.div>

              {/* Floating metric badge */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-2 lg:right-0 px-3 py-2.5 rounded-xl bg-white dark:bg-[#0D3D57]"
                style={{
                  border: "1px solid #0897B32a",
                  boxShadow: "0 6px 20px #0897B322",
                }}
              >
                <div
                  className="font-display text-2xl font-black tracking-[-0.03em] leading-none"
                  style={{ color: "#FF751F" }}
                >
                  95%
                </div>
                <div className="text-xs font-medium mt-0.5" style={{ color: "#729DB9" }}>
                  {t({ en: "volume reduction", es: "reducción de volumen" })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── B. Video block — placeholder or real embed ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Divider with label */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-[#0897B31e] dark:bg-[#47AECC26]" />
            <span
              className="text-xs font-bold uppercase tracking-[0.16em]"
              style={{ color: "#47AECC" }}
            >
              {t({ en: "Explainer Video", es: "Video Explicativo" })}
            </span>
            <div className="h-px flex-1 bg-[#0897B31e] dark:bg-[#47AECC26]" />
          </div>

          {/* Video heading */}
          <h3
            id="video-player"
            className="font-display text-xl font-black tracking-[-0.03em] mb-3"
            style={{ color: "var(--section-heading)" }}
          >
            {t({ en: "See it in 90 seconds", es: "Míralo en 90 segundos" })}
          </h3>

          {/* Video container — auto-switches when videoUrl is set */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              aspectRatio: "16/9",
              minHeight: "220px",
              boxShadow: "0 8px 40px #0897B322, 0 2px 8px #00000010",
            }}
          >

            {/* ── Real video embeds ── */}
            {embedType === "youtube" && (
              <iframe
                src={toYouTubeEmbed(videoUrl)}
                title={t(content.sectionTitle)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
            {embedType === "vimeo" && (
              <iframe
                src={toVimeoEmbed(videoUrl)}
                title={t(content.sectionTitle)}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
            {embedType === "html5" && (
              <video
                src={videoUrl}
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* ── Premium placeholder — shown only when no videoUrl ── */}
            {embedType === "placeholder" && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backgroundColor: "#063D57" }}
              >
                {/* Background grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(#47AECC08 1px, transparent 1px), linear-gradient(90deg, #47AECC08 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                  }}
                />

                {/* Radial glow behind content */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 70% at 50% 50%, #0897B318 0%, transparent 70%)",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
                  {/* Play icon */}
                  <div
                    className="mb-3 sm:mb-5 p-3 sm:p-4 rounded-full"
                    style={{
                      background: "#FF751F18",
                      border: "1px solid #FF751F30",
                      boxShadow: "0 0 32px #FF751F18",
                    }}
                  >
                    <PlayCircle
                      size={28}
                      strokeWidth={1.5}
                      className="sm:hidden"
                      style={{ color: "#FF751F" }}
                    />
                    <PlayCircle
                      size={36}
                      strokeWidth={1.5}
                      className="hidden sm:block"
                      style={{ color: "#FF751F" }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display font-black tracking-[-0.03em] leading-tight mb-2 sm:mb-3"
                    style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)", color: "#CCE6EA" }}
                  >
                    {t(content.placeholderTitle)}
                  </h3>

                  {/* Description — hide on very small screens to avoid overflow */}
                  <p
                    className="hidden sm:block text-sm leading-relaxed max-w-sm"
                    style={{ color: "#729DB9" }}
                  >
                    {t(content.placeholderDescription)}
                  </p>

                  {/* Coming soon pill */}
                  <div
                    className="mt-3 sm:mt-5 px-3 py-1 rounded-full"
                    style={{
                      background: "#47AECC14",
                      border: "1px solid #47AECC26",
                    }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-[0.14em]"
                      style={{ color: "#47AECC" }}
                    >
                      {t({ en: "Coming Soon", es: "Próximamente" })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
