import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin } from 'lucide-react';

import pastriesHand from '@/assets/pastries-hand.jpg';

export function LocationsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="locations" className="section-padding bg-secondary" ref={ref}>
      <div className="container-editorial">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-caption text-muted-foreground block mb-6">
              {t('locations.label')}
            </span>
            
            <p className="heading-section text-foreground mb-8">
              {t('locations.text')}
            </p>
            
            <div className="flex items-center gap-3 text-foreground/70">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-body">{t('locations.city')}</span>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-square overflow-hidden"
          >
            <img
              src={pastriesHand}
              alt=""
              className="img-editorial w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
