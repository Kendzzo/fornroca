import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin } from 'lucide-react';

import pastriesHand from '@/assets/pastries-hand.jpg';

const locations = [
  { name: 'C/ Andreu Tuyet Santamaria', city: 'Girona' },
  { name: 'C/ Àgudes', city: 'Girona' },
  { name: 'C/ Campcardós', city: 'Girona' },
  { name: 'Plaça Llimoners', city: 'Girona' }
];

export function LocationsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="locations" className="section-padding bg-background" ref={ref}>
      <div className="container-editorial">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-caption text-muted-foreground block mb-4">
              {t('locations.label')}
            </span>
            
            <h2 className="heading-section text-foreground mb-6">
              {t('locations.title')}
            </h2>
            
            <p className="text-body text-foreground/70 mb-8">
              {t('locations.text')}
            </p>
            
            <div className="space-y-4">
              {locations.map((location, index) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-body text-foreground/80">{location.name}</span>
                </motion.div>
              ))}
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
