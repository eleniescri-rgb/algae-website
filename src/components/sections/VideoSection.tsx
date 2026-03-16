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
    title: { en: "No Logistics", es: "Sin Logística" },
    description: {
      en: "No third-party pickups, no trucking schedules, no coordination. Everything stays on your property.",
      es: "Sin recolecciones externas, sin horarios de camiones, sin coordinación. Todo se gestiona en tu propiedad.",
    },
  },
  {
    n: "02",
    title: { en: "Odor Eliminated", es: "Olor Eliminado" },
    description: {
      en: "Dried sargassum doesn't rot or smell. Guest complaints about beach odor disappear.",
      es: "El sargazo seco no se pudre ni huele. Las quejas de huéspedes por el olor en la playa desaparecen.",
    },
  },
  {
    n: "03",
    title: { en: "Cost Becomes Value", es: "El Costo Se Convierte en Valor" },
    description: {
      en: "What used to be a disposal problem becomes a recoverable resource — collected by Alga.e's industrial partners.",
      es: "Lo que antes era un problema de eliminación se convierte en un recurso recuperable, recogido por los socios industriales de Alga.e.",
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
    <section id="video" className="bg-cool py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="section-label">
            {t({ en: "The System", es: "El Sistema" })}
          </span>
          <h2 className="font-display text-4xl font-black leading-[1.0] tracking-[-0.03em] sm:text-5xl max-w-xl">
            {t(content.sectionTitle)}
          </h2>
        </motion.div>

        {/* ── A. System explanation — always visible ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">

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
              style={{ color: "#093349" }}
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
                  className="flex gap-5 py-4 group"
                  style={{ borderTop: "1px solid #0897B326" }}
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
                      style={{ color: "#063D57" }}
                    >
                      {t(step.title)}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(step.description)}
                    </p>
                  </div>
                  <div className="shrink-0 pt-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                      style={{ backgroundColor: "#FF751F" }}
                    />
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop: "1px solid #0897B326" }} />
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
                className="text-base"
                style={{ transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)" }}
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
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Glow behind machine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 55%, #0897B348 0%, #0897B318 50%, transparent 80%)",
                  transform: "scale(1.2)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 40% at 50% 45%, #47AECC22 0%, transparent 70%)",
                }}
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
                  className="w-full h-auto"
                  style={{
                    filter: "sepia(1) saturate(4) hue-rotate(152deg) brightness(0.48)",
                    maxHeight: "380px",
                    objectFit: "contain",
                  }}
                />
              </motion.div>

              {/* Floating metric badge */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-2 lg:right-0 px-3 py-2.5 rounded-xl"
                style={{
                  background: "#ffffff",
                  border: "1px solid #0897B31e",
                  boxShadow: "0 6px 20px #0897B312",
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
            <div className="h-px flex-1" style={{ background: "#0897B31e" }} />
            <span
              className="text-xs font-bold uppercase tracking-[0.16em]"
              style={{ color: "#47AECC" }}
            >
              {t({ en: "Explainer Video", es: "Video Explicativo" })}
            </span>
            <div className="h-px flex-1" style={{ background: "#0897B31e" }} />
          </div>

          {/* Video heading */}
          <h3
            id="video-player"
            className="font-display text-xl font-black tracking-[-0.03em] mb-3"
            style={{ color: "#CCE6EA" }}
          >
            {t({ en: "See it in 90 seconds", es: "Míralo en 90 segundos" })}
          </h3>

          {/* Video container — auto-switches when videoUrl is set */}
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px #0897B322, 0 2px 8px #00000010" }}
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
                    className="mb-5 p-4 rounded-full"
                    style={{
                      background: "#FF751F18",
                      border: "1px solid #FF751F30",
                      boxShadow: "0 0 32px #FF751F18",
                    }}
                  >
                    <PlayCircle
                      size={36}
                      strokeWidth={1.5}
                      style={{ color: "#FF751F" }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-xl font-black tracking-[-0.03em] leading-tight mb-3 sm:text-2xl"
                    style={{ color: "#CCE6EA" }}
                  >
                    {t(content.placeholderTitle)}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed max-w-sm"
                    style={{ color: "#729DB9" }}
                  >
                    {t(content.placeholderDescription)}
                  </p>

                  {/* Coming soon pill */}
                  <div
                    className="mt-5 px-3 py-1 rounded-full"
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
