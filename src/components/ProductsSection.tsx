import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

import donutArtesanal from '@/assets/donut-artesanal.jpg';
import croissants from '@/assets/croissants.jpg';
import pastryNapolitanas from '@/assets/pastry-napolitanas.jpg';
import panini from '@/assets/panini.jpg';

const products = [
  { image: donutArtesanal, span: 'col-span-2 row-span-2' },
  { image: croissants, span: 'col-span-1 row-span-1' },
  { image: pastryNapolitanas, span: 'col-span-1 row-span-1' },
  { image: panini, span: 'col-span-2 row-span-1' },
];

export function ProductsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-caption text-muted-foreground block mb-4">
            {t('products.label')}
          </span>
        </motion.div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${product.span} overflow-hidden`}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt=""
                  className="img-editorial w-full h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-body text-muted-foreground text-center mt-12 italic"
        >
          {t('products.caption')}
        </motion.p>
      </div>
    </section>
  );
}
