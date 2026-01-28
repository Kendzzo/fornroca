import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ca' | 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ca: {
    // Navigation
    'nav.home': 'Inici',
    'nav.bakery': 'La Panaderia',
    'nav.locations': 'Panaderías',
    'nav.contact': 'Contacte',
    
    // Hero
    'hero.tagline': 'Des de 1970',
    'hero.title': 'Forn Roca',
    'hero.subtitle': 'Tres generacions dedicades a l\'ofici del pa',
    
    // Identity
    'identity.label': 'Qui som',
    'identity.text': 'Som el Forn Roca. Tres generacions i més de 50 anys d\'experiència avalen la nostra dedicació. Amb Girona com a eix principal, la trajectòria de la nostra família envers la fleca sempre ha estat ferma.',
    'identity.vision': 'Creiem en un comerç just, de proximitat i confiança, basat en una gestió ètica i sostenible, i en una política laboral integradora.',
    
    // Products
    'products.label': 'El nostre ofici',
    'products.caption': 'Part del que elaborem cada dia.',
    
    // Daily Work Videos
    'dailyWork.label': 'Documenta',
    'dailyWork.title': 'El dia a dia',
    'dailyWork.caption': 'Imatges del nostre treball quotidià.',
    
    // Process
    'process.label': 'Cada dia',
    'process.text': 'Cada dia, desenes de persones treballen perquè el forn estigui a punt.',
    
    // Commitment
    'commitment.label': 'Compromís',
    'commitment.title': 'Valors que ens defineixen',
    'commitment.energy': 'energia neta',
    'commitment.energyDesc': 'des de fa 8 anys',
    'commitment.natural': 'productes naturals i de proximitat',
    'commitment.packaging': 'embalatge reciclat',
    'commitment.team': 'de l\'equip amb alguna discapacitat',
    'commitment.charity': 'dels beneficis a entitats benèfiques',
    
    // Award
    'award.label': 'Reconeixement',
    'award.text': 'Premi a la Trajectòria atorgat per l\'Ajuntament de Girona.',
    
    // Locations
    'locations.label': 'On trobar-nos',
    'locations.title': 'Les nostres panaderías',
    'locations.text': 'Amb quatre forns repartits per la ciutat de Girona.',
    'locations.city': 'Girona',
    
    // Testimonials
    'testimonials.label': 'Opinions',
    'testimonials.title': 'El que diuen els nostres clients',
    
    // Contact
    'contact.label': 'Contacte',
    'contact.title': 'Parlem',
    'contact.text': 'Per a qualsevol consulta, no dubtis en contactar-nos.',
    'contact.name': 'Nom',
    'contact.email': 'Correu electrònic',
    'contact.message': 'Missatge',
    'contact.send': 'Enviar',
    'contact.success': 'Missatge enviat correctament.',
    'contact.error': 'Error en enviar el missatge.',
    
    // Footer
    'footer.rights': 'Tots els drets reservats.',
    'footer.tagline': 'Tradició, proximitat i ofici des de 1970.',
    'footer.followUs': 'Segueix-nos',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.bakery': 'La Panadería',
    'nav.locations': 'Panaderías',
    'nav.contact': 'Contacto',
    
    // Hero
    'hero.tagline': 'Desde 1970',
    'hero.title': 'Forn Roca',
    'hero.subtitle': 'Tres generaciones dedicadas al oficio del pan',
    
    // Identity
    'identity.label': 'Quiénes somos',
    'identity.text': 'Somos Forn Roca. Tres generaciones y más de 50 años de experiencia avalan nuestra dedicación. Con Girona como eje principal, la trayectoria de nuestra familia en la panadería siempre ha sido firme.',
    'identity.vision': 'Creemos en un comercio justo, de proximidad y confianza, basado en una gestión ética y sostenible y en una política laboral integradora.',
    
    // Products
    'products.label': 'Nuestro oficio',
    'products.caption': 'Parte de lo que elaboramos cada día.',
    
    // Daily Work Videos
    'dailyWork.label': 'Documenta',
    'dailyWork.title': 'El día a día',
    'dailyWork.caption': 'Imágenes de nuestro trabajo cotidiano.',
    
    // Process
    'process.label': 'Cada día',
    'process.text': 'Cada día, decenas de personas trabajan para que el horno esté a punto.',
    
    // Commitment
    'commitment.label': 'Compromiso',
    'commitment.title': 'Valores que nos definen',
    'commitment.energy': 'energía limpia',
    'commitment.energyDesc': 'desde hace 8 años',
    'commitment.natural': 'productos naturales y de proximidad',
    'commitment.packaging': 'embalaje reciclado',
    'commitment.team': 'del equipo con alguna discapacidad',
    'commitment.charity': 'de los beneficios a entidades benéficas',
    
    // Award
    'award.label': 'Reconocimiento',
    'award.text': 'Premio a la Trayectoria otorgado por el Ayuntamiento de Girona.',
    
    // Locations
    'locations.label': 'Dónde encontrarnos',
    'locations.title': 'Nuestras panaderías',
    'locations.text': 'Con cuatro panaderías repartidas por la ciudad de Girona.',
    'locations.city': 'Girona',
    
    // Testimonials
    'testimonials.label': 'Opiniones',
    'testimonials.title': 'Lo que dicen nuestros clientes',
    
    // Contact
    'contact.label': 'Contacto',
    'contact.title': 'Hablemos',
    'contact.text': 'Para cualquier consulta, no dudes en contactarnos.',
    'contact.name': 'Nombre',
    'contact.email': 'Correo electrónico',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar',
    'contact.success': 'Mensaje enviado correctamente.',
    'contact.error': 'Error al enviar el mensaje.',
    
    // Footer
    'footer.rights': 'Todos los derechos reservados.',
    'footer.tagline': 'Tradición, proximidad y oficio desde 1970.',
    'footer.followUs': 'Síguenos',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.bakery': 'The Bakery',
    'nav.locations': 'Locations',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.tagline': 'Since 1970',
    'hero.title': 'Forn Roca',
    'hero.subtitle': 'Three generations dedicated to the craft of bread',
    
    // Identity
    'identity.label': 'Who we are',
    'identity.text': 'We are Forn Roca. Three generations and more than 50 years of experience support our dedication. With Girona at our core, our family\'s bakery tradition has remained strong over time.',
    'identity.vision': 'We believe in fair, local and trust-based commerce, grounded in ethical and sustainable management and a socially inclusive labour policy.',
    
    // Products
    'products.label': 'Our craft',
    'products.caption': 'Part of what we make every day.',
    
    // Daily Work Videos
    'dailyWork.label': 'Documentary',
    'dailyWork.title': 'Everyday work',
    'dailyWork.caption': 'Images from our daily work.',
    
    // Process
    'process.label': 'Every day',
    'process.text': 'Every day, dozens of people work to keep the ovens running.',
    
    // Commitment
    'commitment.label': 'Commitment',
    'commitment.title': 'Values that define us',
    'commitment.energy': 'clean energy',
    'commitment.energyDesc': 'for the past 8 years',
    'commitment.natural': 'natural and local products',
    'commitment.packaging': 'recycled packaging',
    'commitment.team': 'of our team with a disability',
    'commitment.charity': 'of profits to charity',
    
    // Award
    'award.label': 'Recognition',
    'award.text': 'Lifetime Achievement Award granted by the City of Girona.',
    
    // Locations
    'locations.label': 'Where to find us',
    'locations.title': 'Our bakeries',
    'locations.text': 'With four bakeries across the city of Girona.',
    'locations.city': 'Girona',
    
    // Testimonials
    'testimonials.label': 'Reviews',
    'testimonials.title': 'What our customers say',
    
    // Contact
    'contact.label': 'Contact',
    'contact.title': "Let's talk",
    'contact.text': 'For any enquiry, do not hesitate to contact us.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.success': 'Message sent successfully.',
    'contact.error': 'Error sending message.',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'Tradition, proximity and craft since 1970.',
    'footer.followUs': 'Follow us',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ca');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
