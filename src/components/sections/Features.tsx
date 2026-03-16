'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import homeContent from '@/content/home.json';

// Cycle distinct accents per feature row
const featureAccents = ['#FF751F', '#0897B3', '#47AECC', '#FF751F', '#0897B3', '#47AECC'];

export default function Features() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="bg-cool py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 lg:mb-12 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-end"
        >
          <div className="lg:col-span-5">
            <span className="section-label">
              {t({ en: 'Key Benefits', es: 'Beneficios Clave' })}
            </span>
            <h2
              className="font-display font-black leading-[1.0] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--section-heading)' }}
            >
              {t(homeContent.features.sectionTitle)}
            </h2>
          </div>

          <div className="lg:col-span-7 mt-6 lg:mt-0 lg:flex lg:items-end lg:gap-6">
            <div
              className="hidden lg:block shrink-0 h-px flex-1"
              style={{ background: 'linear-gradient(90deg, #0897B330, transparent)', marginBottom: '0.35rem' }}
            />
            <p
              className="text-sm leading-relaxed lg:text-right lg:max-w-[280px] shrink-0"
              style={{ color: 'var(--section-body)' }}
            >
              {t({
                en: 'Three reasons beachfront hotel operations teams choose Alga.e.',
                es: 'Tres razones por las que los equipos de operaciones hoteleras eligen Alga.e.',
              })}
            </p>
          </div>
        </motion.div>

        {/* Editorial row list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {homeContent.features.items.map((feature, i) => {
            const IconComponent =
              LucideIcons[feature.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;

            return (
              <motion.div
                key={i}
                className="group flex items-center gap-4 lg:gap-8 py-4 cursor-default"
                style={{ borderTop: '1px solid var(--section-border)' }}
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6 }}
              >
                {/* Ghost numeral */}
                <span
                  className="font-display font-black leading-none select-none shrink-0 w-10 lg:w-14"
                  style={{
                    fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
                    color: featureAccents[i],
                    opacity: 0.18,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <motion.div
                  className="shrink-0"
                  style={{ color: featureAccents[i] }}
                  whileHover={{ scale: 1.18 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {IconComponent && <IconComponent size={20} />}
                </motion.div>

                {/* Title + mobile description */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display font-black tracking-[-0.025em] transition-colors duration-200"
                    style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', color: 'var(--section-heading)', transition: `color 0.2s ease` }}
                  >
                    {t(feature.title)}
                  </p>
                  <p
                    className="lg:hidden mt-1 text-sm leading-relaxed"
                    style={{ color: 'var(--section-body)' }}
                  >
                    {t(feature.description)}
                  </p>
                </div>

                {/* Description — desktop right */}
                <p
                  className="hidden lg:block text-sm leading-relaxed text-right max-w-[260px] shrink-0"
                  style={{ color: 'var(--section-body)' }}
                >
                  {t(feature.description)}
                </p>
              </motion.div>
            );
          })}

          <div style={{ borderTop: '1px solid var(--section-border)' }} />
        </motion.div>

      </div>
    </section>
  );
}
