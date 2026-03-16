"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitToWaitlist } from "@/lib/waitlist";
import homeContent from "@/content/home.json";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  const content = homeContent.waitlistCta;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setFormState("loading");
    setMessage("");
    setIsFallback(false);

    try {
      const result = await submitToWaitlist(email);

      if (result.success) {
        setFormState("success");
        setMessage(result.message);
        setIsFallback(result.fallback);
        setEmail("");
      } else {
        setFormState("error");
        setMessage(result.message);
      }
    } catch (error) {
      setFormState("error");
      setMessage(t(content.errorMessage));
    }
  };

  const resetForm = () => {
    setFormState("idle");
    setMessage("");
    setIsFallback(false);
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:via-transparent dark:to-primary/20" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          {/* Card with accent border */}
          <div className="relative rounded-2xl border-2 border-primary/20 bg-card/50 p-8 shadow-lg backdrop-blur-sm dark:bg-card/30 sm:p-10 lg:p-12">
            {/* Accent gradient border overlay */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-xl" />

            <div className="text-center">
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              >
                {t(content.title)}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-base text-muted-foreground sm:text-lg"
              >
                {t(content.description)}
              </motion.p>

              {/* Form or Success Message */}
              <AnimatePresence mode="wait">
                {formState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 space-y-4"
                  >
                    <div className="flex items-center justify-center gap-3 rounded-lg bg-success/10 p-4 text-success dark:bg-success/20">
                      <CheckCircle2 className="size-5 shrink-0" />
                      <p className="text-sm font-medium">
                        {message || t(content.successMessage)}
                      </p>
                    </div>

                    {isFallback && (
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Info className="size-4" />
                        <p>Data stored locally</p>
                      </div>
                    )}

                    <Button
                      onClick={resetForm}
                      variant="ghost"
                      size="sm"
                      className="mt-4"
                    >
                      Submit another email
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="mt-8"
                  >
                    {/* Email input and button */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        type="email"
                        placeholder={t(content.placeholder)}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={formState === "loading"}
                        required
                        className="flex-1 text-base"
                        aria-label="Email address"
                      />
                      <Button
                        type="submit"
                        disabled={formState === "loading" || !email.trim()}
                        size="lg"
                        className="min-w-[140px]"
                      >
                        {formState === "loading" ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          t(content.buttonText)
                        )}
                      </Button>
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {formState === "error" && message && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/20"
                        >
                          <AlertCircle className="size-4 shrink-0" />
                          <p>{message}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
