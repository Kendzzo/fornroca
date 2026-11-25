// Textos de los documentos que firman los trabajadores.
// Si cambias un texto, sube también "version" para que quede constancia de qué versión firmó cada persona.

export type DocKey = 'carnet' | 'manual' | 'cameras' | 'medical' | 'rotation';

export interface PortalDocument {
  key: DocKey;
  version: string;
  title: string;
  short: string;
  text: string;
  /** Si existe, el trabajador elige una opción antes de firmar. */
  choices?: { value: string; label: string; statement: string }[];
  /** Pide subir el carnet (foto o PDF). */
  needsUpload?: boolean;
}

export const PORTAL_DOCUMENTS: PortalDocument[] = [
  {
    key: 'carnet',
    version: '1',
    title: 'Carnet de manipulador de alimentos',
    short: 'Confirma que tienes el carnet y súbelo.',
    needsUpload: true,
    text:
      'Declaro que estoy en posesión del certificado de formación de manipulador de alimentos vigente, ' +
      'que la copia que aporto es auténtica, y que comunicaré a la empresa cualquier caducidad o cambio.',
  },
  {
    key: 'manual',
    version: '1',
    title: 'Manual del trabajador',
    short: 'Confirma que conoces y aceptas el manual.',
    text:
      'Declaro que he recibido el Manual del Trabajador de Forn Roca, que he tenido la oportunidad de leerlo ' +
      'y consultarlo, y que me comprometo a cumplir las normas y procedimientos que contiene.',
  },
  {
    key: 'cameras',
    version: '1',
    title: 'Videovigilancia en las tiendas',
    short: 'Confirma que sabes que hay cámaras.',
    text:
      'He sido informado/a de que todas las tiendas de Forn Roca disponen de cámaras de videovigilancia ' +
      'con fines de seguridad, y de que las imágenes pueden captarme durante mi jornada. ' +
      'Conozco que puedo ejercer mis derechos de acceso, rectificación y supresión ante la empresa ' +
      '(Reglamento UE 2016/679 y LOPDGDD, art. 89).',
  },
  {
    key: 'medical',
    version: '1',
    title: 'Revisión médica',
    short: 'Elige si quieres hacer la revisión médica.',
    text:
      'La empresa me ofrece la posibilidad de realizar una revisión médica de vigilancia de la salud, ' +
      'de carácter voluntario (Ley 31/1995, art. 22). Puedo cambiar mi decisión en cualquier momento ' +
      'comunicándolo a la empresa.',
    choices: [
      { value: 'accept', label: 'Quiero hacerla', statement: 'Solicito realizar la revisión médica.' },
      { value: 'decline', label: 'No quiero hacerla', statement: 'Renuncio voluntariamente a realizar la revisión médica.' },
    ],
  },
  {
    key: 'rotation',
    version: '1',
    title: 'Rotación entre tiendas',
    short: 'Confirma que aceptas trabajar en cualquier tienda.',
    text:
      'Entiendo que presto servicios para un grupo de empresa formado por varias tiendas en Girona, ' +
      'y acepto que la rotación del personal entre ellas es habitual, pudiendo ser asignado/a a cualquiera ' +
      'de las tiendas en cualquier momento según las necesidades del servicio.',
  },
];

export const normalizeDni = (v: string) => v.toUpperCase().replace(/[\s.-]/g, '');

/** Convierte día/mes/año en el código DDMMAA que guarda el sistema. */
export const birthCode = (d: string, m: string, y: string) =>
  d.padStart(2, '0') + m.padStart(2, '0') + y.slice(-2).padStart(2, '0');

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
