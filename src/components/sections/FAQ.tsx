'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/useTranslation';
import faqContent from '@/content/faq.json';

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="bg-cool py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <span className="section-label">
            {t({ en: 'Common Questions', es: 'Preguntas Frecuentes' })}
          </span>
          <h2 className="font-display text-4xl font-black leading-[1.0] tracking-[-0.03em] sm:text-5xl max-w-md">
            {t(faqContent.sectionTitle)}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqContent.questions.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/60 py-1"
              >
                <AccordionTrigger className="font-display text-left text-lg font-bold tracking-[-0.02em] leading-snug hover:no-underline py-5 text-foreground hover:text-primary transition-colors duration-200 [&>svg]:text-muted-foreground [&>svg]:shrink-0">
                  {t(item.question)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {t(item.answer)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
