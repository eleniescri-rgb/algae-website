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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section id="features" ref={ref} className="bg-cool py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header — left-aligned on md+ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16 md:flex md:items-end md:justify-between"
        >
          <div>
            <span className="section-label">
              {t({ en: 'Key Benefits', es: 'Beneficios Clave' })}
            </span>
            <h2 className="font-display text-4xl font-black leading-[1.0] tracking-[-0.03em] sm:text-5xl max-w-xl">
              {t(homeContent.features.sectionTitle)}
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
            {t({
              en: 'Six reasons beachfront hotels choose Alga.e for sargassum management.',
              es: 'Seis razones por las que los hoteles costeros eligen Alga.e.',
            })}
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30"
        >
          {homeContent.features.items.map((feature, index) => {
            const IconComponent =
              LucideIcons[feature.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;

            return (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="group relative h-full bg-background p-7 flex flex-col gap-5 hover:bg-cool transition-colors duration-200"
                >
                  {/* Accent line on hover */}
                  <div
                    className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundImage: 'linear-gradient(90deg, #0897B3, #47AECC)' }}
                  />

                  {/* Icon */}
                  <div
                    className="inline-flex w-fit rounded-xl p-3"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #0897B3, #47AECC)',
                      boxShadow: '0 4px 14px #0897B340',
                    }}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg font-black tracking-[-0.02em] leading-tight">
                      {t(feature.title)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(feature.description)}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
