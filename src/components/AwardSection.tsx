import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function AwardSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-caption text-muted-foreground block mb-8">
            {t('award.label')}
          </span>
          
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          
          <p className="heading-section text-foreground max-w-2xl mx-auto">
            {t('award.text')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
