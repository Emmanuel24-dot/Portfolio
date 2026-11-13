export interface Profile {
  firstName: string;
  lastName: string;
  role: string;
  roleDetail: string;
  tagline: string;
  subline: string;
  location: string;
  coordinates: string;
  timezone: string;
  availability: string;
  availabilityDetail: string;
  /** Chemin vers la photo (ex. 'images/portrait.webp' dans /public). Vide = emplacement esthétique. */
  photo: string;
  photoAlt: string;
}

export interface PhoneNumber {
  /** Affichage lisible, ex. '+228 70 90 24 00' */
  display: string;
  /** Format international sans espace ni '+', ex. '22870902400' */
  e164: string;
  whatsapp: boolean;
}

export interface SocialLink {
  label: string;
  icon: 'github' | 'linkedin';
  /** Laisser vide pour masquer le lien (aucun lien mort). */
  url: string;
  handle?: string;
}

export interface ContactConfig {
  email: string;
  phones: PhoneNumber[];
  socials: SocialLink[];
  /**
   * Point d'envoi du formulaire (Formspree, Web3Forms, API perso…) qui accepte un POST JSON.
   * Vide = le formulaire ouvre la messagerie du visiteur avec le message pré-rempli.
   */
  formEndpoint: string;
  whatsappMessage: string;
}

export interface TechItem {
  name: string;
  /** Fichier dans /public/icons */
  icon: string;
  note: string;
}

export interface TechGroup {
  id: string;
  label: string;
  summary: string;
  items: TechItem[];
}

export type ProjectMotif = 'ledger' | 'modules' | 'catalog' | 'scan' | 'pulse' | 'stock' | 'lookbook';

export interface Project {
  slug: string;
  name: string;
  category: string;
  client?: string;
  description: string;
  features: string[];
  /** Technologies - n'afficher que ce qui est réellement utilisé. */
  stack: string[];
  /** Périmètre fonctionnel (web, back-office, mobile…). */
  scope: string[];
  role?: string;
  kind: 'web' | 'mobile';
  motif: ProjectMotif;
  tint: string;
  /** Capture réelle (dans /public). Vide = illustration abstraite. */
  image?: string;
  imageAlt?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface Experience {
  year: string;
  role: string;
  company?: string;
  location?: string;
  points: string[];
  tags: string[];
}

export interface Education {
  period: string;
  title: string;
  speciality?: string;
  location: string;
  status: string;
  inProgress: boolean;
}

export interface NavLink {
  id: string;
  label: string;
}

export interface OtherProject {
  name: string;
  type: string;
  /** Famille utilisée par les filtres. */
  group: 'vitrine' | 'ecommerce' | 'app';
  sector: string;
  stack?: string;
  /** Site en ligne (optionnel). Vide = ligne non cliquable. */
  url?: string;
  /** Capture (optionnelle), ex. 'images/projects/btp.webp' — affichée au survol. */
  image?: string;
}
