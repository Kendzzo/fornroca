import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  location: string;
  body: Record<Language, string>;
  source: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    author: 'M. Garcia',
    location: 'Girona',
    body: {
      ca: "El millor pa de Girona, sense cap dubte. Més de 20 anys venint aquí i la qualitat mai ha baixat.",
      es: "El mejor pan de Girona, sin duda. Más de 20 años viniendo aquí y la calidad nunca ha bajado.",
      en: "The best bread in Girona, without a doubt. Over 20 years coming here and the quality has never dropped."
    },
    source: 'Google'
  },
  {
    id: '2',
    author: 'J. Puig',
    location: 'Girona',
    body: {
      ca: "Els donuts artesanals són increïbles. Es nota que tot és fet amb cura i bons ingredients.",
      es: "Los donuts artesanales son increíbles. Se nota que todo está hecho con cuidado y buenos ingredientes.",
      en: "The artisanal donuts are incredible. You can tell everything is made with care and good ingredients."
    },
    source: 'Google'
  },
  {
    id: '3',
    author: 'A. Martí',
    location: 'Girona',
    body: {
      ca: "Una panaderia de tota la vida amb valors de veritat. M'agrada saber que donen feina a persones amb discapacitat.",
      es: "Una panadería de toda la vida con valores de verdad. Me gusta saber que dan trabajo a personas con discapacidad.",
      en: "A lifelong bakery with real values. I like knowing they employ people with disabilities."
    },
    source: 'Google'
  },
  {
    id: '4',
    author: 'E. Roca',
    location: 'Girona',
    body: {
      ca: "Els croissants són espectaculars, sempre surto amb una bossa plena. Atenció excel·lent.",
      es: "Los croissants son espectaculares, siempre salgo con una bolsa llena. Atención excelente.",
      en: "The croissants are spectacular, I always leave with a full bag. Excellent service."
    },
    source: 'Instagram'
  },
  {
    id: '5',
    author: 'L. Ferrer',
    location: 'Girona',
    body: {
      ca: "Tradició i qualitat. El pa de pagès és dels millors que he tastat mai.",
      es: "Tradición y calidad. El pan de payés es de los mejores que he probado nunca.",
      en: "Tradition and quality. The country bread is one of the best I've ever tasted."
    },
    source: 'Google'
  },
  {
    id: '6',
    author: 'C. Vila',
    location: 'Girona',
    body: {
      ca: "Producte local, de proximitat i deliciós. Una joia de la ciutat.",
      es: "Producto local, de proximidad y delicioso. Una joya de la ciudad.",
      en: "Local, nearby and delicious product. A gem of the city."
    },
    source: 'Instagram'
  }
];

export function TestimonialsSection() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="section-padding bg-background" ref={ref}>
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <span className="text-caption text-muted-foreground block mb-4">
            {t('testimonials.label')}
          </span>
          <h2 className="heading-section text-foreground">
            {t('testimonials.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-secondary p-6 md:p-8"
            >
              <Quote className="w-6 h-6 text-gold mb-4 opacity-60" />
              <p className="text-body text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.body[language]}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground/60">
                  {testimonial.source}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
