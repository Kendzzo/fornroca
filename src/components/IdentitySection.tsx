import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function IdentitySection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="identity" className="section-padding bg-secondary" ref={ref}>
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-caption text-muted-foreground block mb-8">
            {t('identity.label')}
          </span>
          
          <p className="text-editorial text-foreground leading-relaxed mb-12">
            {t('identity.text')}
          </p>
          
          <div className="w-12 h-px bg-gold mx-auto mb-12" />
          
          <p className="text-body text-muted-foreground italic max-w-2xl mx-auto">
            {t('identity.vision')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
