import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

import doughPreparation from '@/assets/dough-preparation.jpg';
import breadBag from '@/assets/bread-bag.jpg';

export function ProcessSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-structure/30" ref={ref}>
      <div className="container-editorial">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={doughPreparation}
                alt=""
                className="img-editorial w-full h-full"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden mt-12">
              <img
                src={breadBag}
                alt=""
                className="img-editorial w-full h-full"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:pl-8"
          >
            <span className="text-caption text-muted-foreground block mb-6">
              {t('process.label')}
            </span>
            
            <p className="heading-section text-foreground leading-snug">
              {t('process.text')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
