import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import premiSeal from '@/assets/premi-trajectoria.png';

export function AwardSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-8">
            {t('award.label')}
          </span>
          
          {/* Award Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10"
          >
            <img 
              src={premiSeal} 
              alt="Premi Trajectòria - Ajuntament de Girona" 
              className="w-40 h-40 md:w-52 md:h-52 mx-auto object-contain"
            />
          </motion.div>
          
          <p className="font-serif text-xl md:text-2xl text-foreground max-w-2xl mx-auto leading-relaxed">
            {t('award.text')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
