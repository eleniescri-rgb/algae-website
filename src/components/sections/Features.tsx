'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import homeContent from '@/content/home.json';

export default function Features() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="bg-cool py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header — 2-col split on lg+ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 lg:mb-20 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-end"
        >
          <div className="lg:col-span-5">
            <span className="section-label">
              {t({ en: 'Key Benefits', es: 'Beneficios Clave' })}
            </span>
            <h2
              className="font-display font-black leading-[1.0] tracking-[-0.03em] text-[#063D57] dark:text-[#CCE6EA]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {t(homeContent.features.sectionTitle)}
            </h2>
          </div>

          {/* Connecting line + description */}
          <div className="lg:col-span-7 mt-6 lg:mt-0 lg:flex lg:items-end lg:gap-6">
            <div
              className="hidden lg:block shrink-0 h-px flex-1"
              style={{ background: 'linear-gradient(90deg, #0897B330, transparent)', marginBottom: '0.35rem' }}
            />
            <p className="text-sm leading-relaxed lg:text-right lg:max-w-[280px] shrink-0 text-[#5a7a8a] dark:text-[#729DB9]">
              {t({
                en: 'Six reasons beachfront hotels choose Alga.e for sargassum management.',
                es: 'Seis razones por las que los hoteles costeros eligen Alga.e.',
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
                className="group flex items-center gap-6 lg:gap-10 py-7 border-t border-[#0897B315] dark:border-[#47AECC18] cursor-default"
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6 }}
              >
                {/* Ghost numeral */}
                <span
                  className="font-display font-black leading-none select-none shrink-0 w-16 lg:w-20 text-[#47AECC] opacity-[0.12] dark:opacity-[0.28]"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="shrink-0 text-[#0897B3] dark:text-[#47AECC]">
                  {IconComponent && <IconComponent size={22} />}
                </div>

                {/* Title + mobile description */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display font-black tracking-[-0.025em] transition-colors duration-200 group-hover:text-[#0897B3] dark:group-hover:text-[#47AECC] text-[#093349] dark:text-[#CCE6EA]"
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
                  >
                    {t(feature.title)}
                  </p>
                  {/* Mobile-only description below title */}
                  <p className="lg:hidden mt-1 text-sm leading-relaxed text-[#5a7a8a] dark:text-[#729DB9]">
                    {t(feature.description)}
                  </p>
                </div>

                {/* Description — desktop only, right side */}
                <p className="hidden lg:block text-sm leading-relaxed text-right max-w-[260px] shrink-0 text-[#5a7a8a] dark:text-[#729DB9]">
                  {t(feature.description)}
                </p>
              </motion.div>
            );
          })}

          {/* Bottom border */}
          <div className="border-t border-[#0897B315] dark:border-[#47AECC18]" />
        </motion.div>

      </div>
    </section>
  );
}
