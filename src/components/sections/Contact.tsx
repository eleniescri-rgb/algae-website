"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import contactContent from "@/content/contact.json";
import { submitLead } from "@/lib/analytics";

type Field = (typeof contactContent.form.fields)[number];

function buildInitialState(fields: Field[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.name, ""]));
}

export default function Contact() {
  const { t } = useTranslation();
  const fields = contactContent.form.fields;

  const [formData, setFormData] = useState<Record<string, string>>(buildInitialState(fields));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ interest: string }>).detail;
      if (detail?.interest) setFormData((prev) => ({ ...prev, interestType: detail.interest }));
    };
    window.addEventListener("pilot:interest", handler);
    return () => window.removeEventListener("pilot:interest", handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValidationError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !formData[f.name]?.trim()).map((f) => f.name);
    if (missing.length > 0) { setValidationError(t({ en: "Please fill in all required fields.", es: "Por favor completa todos los campos obligatorios." })); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setValidationError(t({ en: "Please enter a valid email address.", es: "Por favor ingresa un correo electrónico válido." })); return; }
    setStatus("loading");
    try {
      await submitLead(formData);
      setStatus("success");
      setFormData(buildInitialState(fields));
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-cool py-14 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p
            className="text-base font-medium italic mb-3"
            style={{ color: "#0897B3" }}
          >
            {t({
              en: "Ready to stop hauling sargassum and start recovering value from it?",
              es: "¿Listo para dejar de transportar sargazo y empezar a recuperar su valor?",
            })}
          </p>
          <span className="section-label">
            {t({ en: "Get In Touch", es: "Contáctanos" })}
          </span>
          <h2 className="font-display text-4xl font-black leading-[1.0] tracking-[-0.03em] sm:text-5xl max-w-xl">
            {t(contactContent.sectionTitle)}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg leading-relaxed">
            {t(contactContent.sectionDescription)}
          </p>
          <p className="mt-3 text-xs leading-relaxed max-w-lg" style={{ color: "var(--section-body)" }}>
            {t({
              en: "Hotel operators: apply for the pilot program below. Industrial partners and press: use the same form and tell us about your interest.",
              es: "Operadores hoteleros: solicita el programa piloto a continuación. Socios industriales y prensa: usa el mismo formulario e indícanos tu interés.",
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-5"
          >
            {fields.map((field, index) => {
              const groupLabel =
                index === 0 ? t({ en: "About You", es: "Sobre Ti" }) :
                index === 4 ? t({ en: "Your Property", es: "Tu Propiedad" }) :
                index === 7 ? t({ en: "Your Goals", es: "Tus Objetivos" }) :
                null;
              return (
              <div key={field.name}>
                {groupLabel && (
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] pt-4 pb-1 first:pt-0" style={{ color: "#0897B3" }}>
                    {groupLabel}
                  </p>
                )}
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                  {t(field.label)}
                  {field.required && <span className="text-primary ml-1">*</span>}
                </Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={t(field.placeholder)}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    required={field.required}
                    rows={"rows" in field ? field.rows : 5}
                    className="resize-none bg-background"
                  />
                ) : field.type === "select" && "options" in field ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    required={field.required}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="" disabled>{t(field.placeholder)}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={t(field.placeholder)}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    required={field.required}
                    className="bg-background"
                  />
                )}
              </div>
              </div>
              );
            })}

            {validationError && (
              <p className="text-sm font-medium" style={{ color: "#FF751F" }}>
                {validationError}
              </p>
            )}

            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full mt-2 font-semibold"
              style={{
                backgroundColor: "#FF751F",
                color: "white",
                boxShadow: "0 4px 20px #FF751F40",
                transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease",
                opacity: status === "loading" || status === "success" ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (status === "loading" || status === "success") return;
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px #FF751F59";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px #FF751F40";
              }}
            >
              {status === "loading"
                ? t({ en: "Sending…", es: "Enviando…" })
                : t(contactContent.form.submitText)}
            </Button>

            {status === "success" && (
              <div className="flex items-start gap-3 rounded-lg p-4 mt-1" style={{ background: "#0897B30d", border: "1px solid #0897B326" }}>
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: "#0897B3" }} />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t({
                    en: `Thank you! We'll review your submission and be in touch within 48 hours.`,
                    es: `¡Gracias! Revisaremos tu solicitud y te contactaremos en un plazo de 48 horas.`,
                  })}
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-start gap-3 rounded-lg p-4 mt-1" style={{ background: "#FF751F0d", border: "1px solid #FF751F26" }}>
                <AlertCircle size={18} className="shrink-0 mt-0.5" style={{ color: "#FF751F" }} />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t({
                    en: "Something went wrong. Please email us directly at algaerenewable@gmail.com",
                    es: "Algo salió mal. Por favor escríbenos directamente a algaerenewable@gmail.com",
                  })}
                </p>
              </div>
            )}
          </motion.form>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Direct contact */}
            <div
              className="rounded-xl p-6 border"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                boxShadow: "0 2px 12px #0897B31a",
              }}
            >
              <div
                className="w-8 h-[2px] mb-4"
                style={{ backgroundImage: "linear-gradient(90deg, #0897B3, #47AECC)" }}
              />
              <h3 className="font-display text-base font-black tracking-[-0.02em] mb-4 text-foreground">
                {t({ en: "Direct Contact", es: "Contacto Directo" })}
              </h3>
              <a
                href={`mailto:${contactContent.contactInfo.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail size={15} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="break-all">{contactContent.contactInfo.email}</span>
              </a>
              <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                <Clock size={15} className="shrink-0" />
                <span>{t(contactContent.contactInfo.responseTime)}</span>
              </div>
            </div>

            {/* Privacy note */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "#0897B30d",
                border: "1px solid #0897B326",
              }}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t({
                  en: "All submissions are reviewed personally. We only reach out if there is a genuine potential fit — we do not add you to marketing lists without consent.",
                  es: "Todas las solicitudes se revisan personalmente. Solo contactamos si hay un encaje genuino — no te añadimos a listas de marketing sin consentimiento.",
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
