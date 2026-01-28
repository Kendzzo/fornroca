import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import bakeryStorefront from '@/assets/bakery-storefront.jpg';
export function HeroSection() {
  const {
    t
  } = useLanguage();
  return <section className="relative min-h-screen flex items-end pb-16 md:pb-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bakeryStorefront} alt="Forn Roca storefront" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="container-editorial relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.2
      }} className="max-w-3xl">
          <span className="text-caption text-foreground/70 block mb-px font-bold">
            {t('hero.tagline')}
          </span>
          
          <h1 className="heading-display text-foreground mb-6 text-center text-8xl pb-0 pt-0 my-0 font-semibold">
            {t('hero.title')}
          </h1>
          
          <p className="text-editorial text-foreground/80 max-w-xl text-center">
            {t('hero.subtitle')}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5,
      duration: 1
    }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-px h-16 bg-gradient-to-b from-foreground/50 to-transparent" />
      </motion.div>
    </section>;
}