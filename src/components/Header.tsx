import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-fornroca.png';
const languages: {
  code: Language;
  label: string;
}[] = [{
  code: 'ca',
  label: 'CA'
}, {
  code: 'es',
  label: 'ES'
}, {
  code: 'en',
  label: 'EN'
}];
export function Header() {
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [{
    key: 'nav.home',
    href: '#'
  }, {
    key: 'nav.bakery',
    href: '#identity'
  }, {
    key: 'nav.locations',
    href: '#locations'
  }, {
    key: 'nav.contact',
    href: '#contact'
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <a href="#" className="relative z-50">
            <img src={logo} alt="Forn Roca" className="h-10 md:h-12 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(item => <a key={item.key} href={item.href} className="text-caption text-foreground/70 hover:text-foreground transition-colors duration-300">
                {t(item.key)}
              </a>)}
          </nav>

          {/* Language Selector - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {languages.map((lang, index) => <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 text-sm transition-colors duration-300 ${language === lang.code ? 'text-foreground font-medium' : 'text-foreground/50 hover:text-foreground/70'}`}>
                {lang.label}
                {index < languages.length - 1 && <span className="ml-2 text-foreground/30">/</span>}
              </button>)}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden relative z-50 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} transition={{
        duration: 0.3
      }} className="fixed inset-0 bg-background z-40 md:hidden">
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map(item => <a key={item.key} href={item.href} onClick={() => setIsMenuOpen(false)} className="heading-section text-foreground hover:text-gold transition-colors bg-white">
                  {t(item.key)}
                </a>)}
              
              {/* Language Selector - Mobile */}
              <div className="flex items-center gap-4 mt-8">
                {languages.map(lang => <button key={lang.code} onClick={() => {
              setLanguage(lang.code);
              setIsMenuOpen(false);
            }} className={`px-3 py-2 text-sm transition-colors ${language === lang.code ? 'text-foreground font-medium border-b-2 border-gold' : 'text-foreground/50'}`}>
                    {lang.label}
                  </button>)}
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
}