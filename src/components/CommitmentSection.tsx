import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const stats = [
  { value: '100%', key: 'commitment.energy', subkey: 'commitment.energyDesc' },
  { value: '90%', key: 'commitment.natural', subkey: null },
  { value: '80%', key: 'commitment.packaging', subkey: null },
  { value: '70%', key: 'commitment.team', subkey: null },
  { value: '4%', key: 'commitment.charity', subkey: null },
];

export function CommitmentSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-foreground text-primary-foreground" ref={ref}>
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-caption text-primary-foreground/60 block mb-4">
            {t('commitment.label')}
          </span>
          <h2 className="heading-editorial text-primary-foreground">
            {t('commitment.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <span className="text-stat text-gold block mb-3">
                {stat.value}
              </span>
              <p className="text-body text-primary-foreground/80">
                {t(stat.key)}
              </p>
              {stat.subkey && (
                <p className="text-sm text-primary-foreground/50 mt-1">
                  {t(stat.subkey)}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
