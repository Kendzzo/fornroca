import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-fornroca.png';
import { Instagram } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 md:py-20 border-t border-border bg-background">
      <div className="container-editorial">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8 items-start">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <img 
              src={logo} 
              alt="Forn Roca" 
              className="h-10 w-auto mb-6"
            />
            <p className="text-body text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-caption text-muted-foreground mb-4">Girona</p>
            <div className="space-y-2">
              <p>
                <a 
                  href="mailto:Gruproca.girona@gmail.com" 
                  className="text-body text-foreground/70 hover:text-gold transition-colors"
                >
                  Gruproca.girona@gmail.com
                </a>
              </p>
              <p>
                <a 
                  href="https://www.fornroca.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-body text-foreground/70 hover:text-gold transition-colors"
                >
                  www.FornRoca.com
                </a>
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-caption text-muted-foreground mb-4">{t('footer.followUs')}</p>
            <a 
              href="https://www.instagram.com/fornroca?igsh=MWVwOTV2d2R2anExMQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body text-foreground/70 hover:text-gold transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span>@Fornroca</span>
            </a>
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
