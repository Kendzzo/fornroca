import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-fornroca.png';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="py-16 md:py-20 border-t border-border">
      <div className="container-editorial">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 items-start">
          {/* Logo & Tagline */}
          <div>
            <img 
              src={logo} 
              alt="Forn Roca" 
              className="h-10 w-auto mb-6"
            />
            <p className="text-body text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Contact placeholder */}
          <div className="md:text-center">
            <p className="text-caption text-muted-foreground mb-4">Girona</p>
            <p className="text-body text-foreground/70">
              info@fornroca.cat
            </p>
          </div>

          {/* Copyright */}
          <div className="md:text-right">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Forn Roca
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
