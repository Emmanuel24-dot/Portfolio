/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENU DU PORTFOLIO - fichier unique à personnaliser.
 *  Textes, projets, images, coordonnées et réseaux sociaux.
 * ─────────────────────────────────────────────────────────────
 */
import {
  ContactConfig,
  Education,
  Experience,
  NavLink,
  OtherProject,
  Profile,
  Project,
  TechGroup,
} from '../models/portfolio.models';

export const PROFILE: Profile = {
  firstName: 'Emmanuel',
  lastName: 'Tchedie',
  role: 'Full Stack Developer',
  roleDetail: 'Web & Mobile',
  tagline: 'Je transforme les idées en applications web et mobiles performantes.',
  subline: 'Je conçois et développe des solutions digitales qui répondent à de vrais besoins.',
  location: 'Lomé, Togo',
  coordinates: '6.13° N - 1.22° E',
  timezone: 'Africa/Lome',
  availability: 'Disponible',
  availabilityDetail: 'Emploi · Freelance · Remote',
  // Déposez votre photo dans /public/images/ puis indiquez son chemin, ex. 'images/portrait.webp'
  photo: '',
  photoAlt: 'Portrait d’Emmanuel TCHEDIE',
};

export const CONTACT: ContactConfig = {
  email: 'tchedieemmanuel2@gmail.com',
  phones: [
    { display: '+228 70 90 24 00', e164: '22870902400', whatsapp: true },
    { display: '+228 96 40 49 26', e164: '22896404926', whatsapp: false },
  ],
  socials: [
    // Renseignez vos URLs : un lien vide n'est pas affiché.
    { label: 'GitHub', icon: 'github', url: '' },
    { label: 'LinkedIn', icon: 'linkedin', url: '' },
  ],
  formEndpoint: '',
  whatsappMessage: 'Bonjour Emmanuel, je viens de voir votre portfolio et j’aimerais échanger avec vous.',
};

export const NAV_LINKS: NavLink[] = [
  { id: 'profil', label: 'Profil' },
  { id: 'stack', label: 'Stack' },
  { id: 'projets', label: 'Projets' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'contact', label: 'Contact' },
];

export const LIFECYCLE: { label: string; detail: string }[] = [
  { label: 'Analyse', detail: 'Recueil et compréhension des besoins' },
  { label: 'Conception', detail: 'Modélisation UML / MERISE' },
  { label: 'Développement', detail: 'Web, mobile, API REST' },
  { label: 'Correction', detail: 'Tests et résolution des problèmes' },
  { label: 'Déploiement', detail: 'Mise en production' },
  { label: 'Formation', detail: 'Accompagnement des utilisateurs' },
];

export const TECH_GROUPS: TechGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Interfaces web',
    items: [
      { name: 'Angular', icon: 'angular.svg', note: 'Framework SPA' },
      { name: 'HTML', icon: 'html.svg', note: 'Structure sémantique' },
      { name: 'CSS', icon: 'css.svg', note: 'Mise en forme' },
      { name: 'Bootstrap', icon: 'bootstrap.svg', note: 'Grille & composants' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    summary: 'Logique métier & API REST',
    items: [
      { name: 'Java', icon: 'java.svg', note: 'Langage' },
      { name: 'Spring Boot', icon: 'spring.svg', note: 'Framework API' },
      { name: 'PHP', icon: 'php.svg', note: 'Langage serveur' },
      { name: 'Laravel', icon: 'laravel.svg', note: 'Framework MVC' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    summary: 'Android & multiplateforme',
    items: [
      { name: 'Flutter', icon: 'flutter.svg', note: 'Multiplateforme' },
      { name: 'Java Android', icon: 'android.svg', note: 'Natif Android' },
      { name: 'XML', icon: 'xml.svg', note: 'Layouts Android' },
    ],
  },
  {
    id: 'data',
    label: 'Bases de données',
    summary: 'Modélisation & administration',
    items: [
      { name: 'MySQL', icon: 'mysql.svg', note: 'SGBD relationnel' },
      { name: 'Oracle', icon: 'oracle.svg', note: 'SGBD relationnel' },
    ],
  },
  {
    id: 'other',
    label: 'Autres',
    summary: 'Langages & méthodes',
    items: [
      { name: 'Python', icon: 'python.svg', note: 'Langage' },
      { name: 'C', icon: 'c.svg', note: 'Langage' },
      { name: 'UML', icon: 'uml.svg', note: 'Modélisation objet' },
      { name: 'MERISE', icon: 'merise.svg', note: 'Méthode d’analyse' },
    ],
  },
];

/**
 * PROJETS PRINCIPAUX - grands panneaux empilés.
 * Captures : /public/images/projects/ puis champ `image`. Une liste vide n'est pas affichée.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'quincapro',
    name: 'QuincaPro',
    category: 'Application de gestion commerciale',
    description:
      'Application de gestion complète pour une quincaillerie : ventes, stock, achats et facturation, pilotés depuis un tableau de bord avec statistiques. Installable comme une application.',
    features: [
      'Ventes, encaissements et retours clients',
      'Stock : inventaires et mouvements',
      'Achats, fournisseurs et paiements',
      'Facturation et fichier clients',
      'Tableau de bord, statistiques et export de rapports',
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    scope: ['Gestion', 'Stock', 'Facturation'],
    kind: 'web',
    motif: 'stock',
    tint: '#0f5f8a',
    image: 'images/projects/quincapro.jpg',
    imageAlt: 'Écran de connexion de QuincaPro',
  },
  {
    slug: 'gestion-immobiliere',
    name: 'Gestion immobilière',
    category: 'Application de gestion d’agence',
    description:
      'Application de gestion pour une agence immobilière, avec des accès par rôle : administrateur, agent, comptable, gestionnaire et secrétaire.',
    features: [
      'Biens, clients et prospects',
      'Locations, ventes et rendez-vous',
      'Finance : loyers, impayés, dépenses, commissions',
      'Maintenance, documents et rapports',
      'Rôles, permissions et journal d’activité',
    ],
    stack: ['PHP', 'MySQL'],
    scope: ['Immobilier', 'Finance', 'Multi-rôles'],
    kind: 'web',
    motif: 'ledger',
    tint: '#0f766e',
  },
  {
    slug: 'gbingbance',
    name: 'GbinGbanCe',
    category: 'Plateforme événementielle & billetterie',
    description:
      'Plateforme pour découvrir et réserver les événements au Togo (concerts, festivals, soirées VIP, conférences), avec billetterie en ligne et administration.',
    features: [
      'Catalogue et fiches détaillées des événements',
      'Achat de tickets en ligne',
      'Galerie et partenaires',
      'Administration : événements et tickets',
    ],
    stack: ['PHP', 'MySQL'],
    scope: ['Événementiel', 'Billetterie', 'Back-office'],
    kind: 'web',
    motif: 'catalog',
    tint: '#7c3aed',
    image: 'images/projects/event.jpg',
    imageAlt: 'Page d’accueil de GbinGbanCe',
  },
  {
    slug: 'maison-nord',
    name: 'Maison Nord',
    category: 'Boutique en ligne de prêt-à-porter',
    description:
      'Boutique en ligne de vêtements (femme, homme, accessoires) avec paiement en ligne, comptes clients et back-office complet. Installable comme une application.',
    features: [
      'Catalogue, nouveautés, filtres par catégorie et prix',
      'Panier, favoris et avis clients',
      'Paiement en ligne FedaPay et suivi des commandes',
      'Connexion par email ou compte Google',
      'Back-office : produits, commandes, livraisons, utilisateurs et statistiques',
    ],
    stack: ['PHP', 'MySQL', 'FedaPay'],
    scope: ['E-commerce', 'Mode', 'Back-office'],
    kind: 'web',
    motif: 'lookbook',
    tint: '#8a5a2b',
    image: 'images/projects/maison-nord.jpg',
    imageAlt: 'Page d’accueil de la boutique Maison Nord',
  },
  {
    slug: 'dowellstore',
    name: 'DOWELLstore',
    category: 'E-commerce de matériel informatique',
    description:
      'Site vitrine et catalogue de matériel informatique, avec prise de commande via WhatsApp et espace d’administration sécurisé.',
    features: [
      'Catalogue et fiches produits détaillées',
      'Commande via WhatsApp',
      'Espace d’administration',
      'API REST Spring Boot',
    ],
    stack: ['Angular', 'Spring Boot', 'Java', 'MySQL'],
    scope: ['Web', 'E-commerce', 'Back-office'],
    kind: 'web',
    motif: 'catalog',
    tint: '#2f6fe0',
  },
  {
    slug: 'carredaas',
    name: 'Carredaas',
    category: 'Site & back-office - cabinet comptable',
    description:
      'Site d’un cabinet d’expertise comptable et de conseil financier, entièrement administrable : services, contenus, médiathèque, partenaires et newsletter.',
    features: [
      'Gestion des services et des contenus',
      'Médiathèque, partenaires et newsletter',
      'Tableau de bord administrateur',
      'Formulaire de contact avec envoi d’emails',
    ],
    stack: ['PHP', 'MySQL', 'PHPMailer'],
    scope: ['Web', 'Back-office', 'Cabinet comptable'],
    kind: 'web',
    motif: 'ledger',
    tint: '#d9461a',
    image: 'images/projects/carredaas.jpg',
    imageAlt: 'Page d’accueil de Carredaas',
  },
  {
    slug: 'caloriescan',
    name: 'CalorieScan',
    category: 'Application mobile de nutrition - IA',
    description:
      'Photographiez votre repas, CalorieScan reconnaît les aliments de l’assiette et estime calories, protéines, glucides et lipides - y compris pour les plats d’Afrique de l’Ouest.',
    features: [
      'Reconnaissance des aliments par IA à partir d’une photo',
      'Estimation des calories, protéines, glucides et lipides',
      'Plats locaux : akoumé, fufu, gari, sauce gombo…',
      'Application mobile Flutter',
      'Analyse d’image par IA en Python',
      'Backend Laravel et tableau de bord administrateur',
    ],
    stack: ['Flutter', 'Laravel', 'Python'],
    scope: ['Mobile', 'IA', 'Nutrition'],
    kind: 'mobile',
    motif: 'scan',
    tint: '#12936b',
    image: 'images/projects/caloriescan.jpg',
    imageAlt: 'Page d’accueil de CalorieScan avec l’analyse d’un repas',
    liveUrl: 'https://caloriescan-api-z6pi.onrender.com/',
  },
];

/**
 * AUTRES RÉALISATIONS - liste filtrable (sites vitrines, e-commerce, applications).
 * `group` sert aux filtres. `url` (site en ligne) et `image` (capture) sont optionnels :
 * sans `url`, la ligne n'est pas cliquable (aucun lien mort).
 */
export const OTHER_PROJECTS: OtherProject[] = [
  // Sites vitrines
  { name: 'VitrineBTP', type: 'Site vitrine', group: 'vitrine', sector: 'Bâtiment & travaux publics', stack: 'PHP · Bootstrap', image: 'images/projects/btp.jpg' },
  { name: 'Clinique Santé Plus', type: 'Site vitrine', group: 'vitrine', sector: 'Santé', stack: 'PHP', image: 'images/projects/clinique.jpg' },
  { name: 'Éclat Beauté Studio', type: 'Site vitrine', group: 'vitrine', sector: 'Coiffure & beauté', stack: 'PHP', image: 'images/projects/salon.jpg' },
  { name: 'Élégance Beauty', type: 'Site vitrine', group: 'vitrine', sector: 'Institut de beauté', stack: 'HTML · CSS · JS', url: 'https://elegance-beaute.netlify.app/', image: 'images/projects/elegance-beauty.jpg' },
  { name: 'RK EMPIRE', type: 'Site vitrine', group: 'vitrine', sector: 'Coiffure & esthétique', stack: 'HTML · CSS · JS', image: 'images/projects/rk-empire.jpg' },
  { name: 'VitrineSHOOT', type: 'Site vitrine', group: 'vitrine', sector: 'Photo, vidéo & design', stack: 'PHP', image: 'images/projects/shooting.jpg' },
  { name: 'ImmoLomé', type: 'Site vitrine', group: 'vitrine', sector: 'Immobilier', stack: 'HTML · CSS · JS', url: 'https://immolomee.netlify.app/', image: 'images/projects/immolome.jpg' },
  { name: 'Étoile du Volant', type: 'Site vitrine', group: 'vitrine', sector: 'Auto-école', stack: 'HTML · CSS · JS', image: 'images/projects/auto-ecole.jpg' },
  { name: 'Centre de formation', type: 'Modèle de site vitrine', group: 'vitrine', sector: 'Formation professionnelle', stack: 'HTML · CSS · JS', image: 'images/projects/formation.jpg' },
  { name: 'Location de voitures', type: 'Modèle de site vitrine', group: 'vitrine', sector: 'Location de véhicules', stack: 'HTML · CSS · JS', image: 'images/projects/location-voiture.jpg' },
];

export const EXPERIENCES: Experience[] = [
  {
    year: '2026',
    role: 'Full Stack Developer',
    points: ['Conception et développement d’applications web et mobiles, de l’analyse des besoins au déploiement.'],
    tags: ['Web', 'Mobile', 'API REST'],
  },
  {
    year: '2025',
    role: 'Audit and Inventory Agent',
    location: 'Lomé',
    points: ['Audit et inventaire des biens de l’UTB sur l’ensemble du territoire togolais.'],
    tags: ['Audit', 'Inventaire', 'Couverture nationale'],
  },
  {
    year: '2024',
    role: 'Web Developer',
    location: 'Lomé',
    points: ['Conception et réalisation d’une plateforme e-learning.'],
    tags: ['Conception', 'Développement web', 'E-learning'],
  },
  {
    year: '2023',
    role: 'Data Processing Agent',
    points: ['Traitement des formulaires d’enregistrement des cartes SIM pour MTN Bénin.'],
    tags: ['Traitement de données', 'Télécoms'],
  },
];

export const EDUCATION: Education[] = [
  {
    period: 'Cursus',
    title: 'Licence professionnelle en Informatique',
    speciality: 'Option Développement d’Application',
    location: 'Lomé',
    status: 'Troisième année achevée',
    inProgress: true,
  },
  {
    period: '2022',
    title: 'Baccalauréat',
    speciality: 'Série D',
    location: 'Lomé',
    status: 'Diplôme obtenu',
    inProgress: false,
  },
];
