# Portfolio - Emmanuel TCHEDIE

Portfolio Full Stack Web & Mobile - Angular 21 (standalone, signals, zoneless), SCSS, GSAP.

## Lancer le projet

```bash
npm install
npm start              # http://localhost:4200
npm run build          # build de production → dist/portfolio/browser
```

Le dossier `dist/portfolio/browser` est un site statique : il se déploie tel quel sur Netlify, Vercel,
GitHub Pages, un hébergement mutualisé ou WAMP (copier le contenu dans `www/`).

## Personnaliser le contenu

**Tout le contenu est dans un seul fichier :** [`src/app/core/data/portfolio.data.ts`](src/app/core/data/portfolio.data.ts)

| Élément | Où | Remarque |
| --- | --- | --- |
| Photo | `PROFILE.photo` | Déposer l'image dans `public/images/` puis indiquer `'images/portrait.webp'`. Vide = emplacement graphique. Format conseillé : WebP, 1200×1500 px. |
| GitHub / LinkedIn | `CONTACT.socials[].url` | Un lien vide est masqué (aucun lien mort). |
| Téléphones / WhatsApp | `CONTACT.phones` | `whatsapp: true` désigne le numéro utilisé par le bouton WhatsApp. |
| Formulaire | `CONTACT.formEndpoint` | Voir ci-dessous. |
| Projets | `PROJECTS` | `stack` (technologies), `image` (capture réelle), `liveUrl`, `repoUrl` : n'apparaissent que s'ils sont renseignés. |
| Compétences | `TECH_GROUPS` | Icônes dans `public/icons/` (Devicon, licence MIT). |
| Expérience / Formation | `EXPERIENCES`, `EDUCATION` | - |

### Captures des projets
1. Déposez vos images dans **`public/images/projects/`** (format `.webp` ou `.jpg`, environ 1600 × 1000 px).
2. Dans `portfolio.data.ts`, renseignez le champ `image` du projet :
   - projet principal (`PROJECTS`) : `image: 'images/projects/quincapro.webp'`, `imageAlt: 'Tableau de bord Quincapro'`
   - autre réalisation (`OTHER_PROJECTS`) : `image: 'images/projects/restaurant.webp'` (affichée au survol)

Sans capture, une illustration abstraite s'affiche avec la mention « Visuel illustratif ».

### Ajouter un projet
- **Application importante** : ajoutez un objet dans `PROJECTS` (grand panneau).
- **Site vitrine, e-commerce, petite application** : ajoutez une ligne dans `OTHER_PROJECTS` (`group` : `'vitrine'`, `'ecommerce'` ou `'app'` pour les filtres). Si `url` est renseigné,
  la ligne devient un lien vers le site.

### Formulaire de contact
- **Sans configuration** : à l'envoi, la messagerie du visiteur s'ouvre avec le message pré-rempli.
- **Envoi direct** : créez un formulaire gratuit sur [Formspree](https://formspree.io) puis renseignez
  `formEndpoint: 'https://formspree.io/f/xxxxxxx'`. Tout service acceptant un `POST` JSON convient.
  Un champ « pot de miel » filtre les robots.

## Architecture

```
src/
├─ styles/            tokens (couleurs, typo), base, composants partagés (boutons, tags, reveal)
└─ app/
   ├─ core/           données, modèles, services (MotionService, ContactIntentService)
   ├─ shared/         Button, Icon, Portrait, LocalTime, directives Reveal & Magnetic
   ├─ layout/         Preloader, Header (+ menu mobile, progression), Footer
   └─ sections/       hero, about, stack, projects, experience, education, contact
```

- Les apparitions simples utilisent `IntersectionObserver` + CSS (sans coût JS au défilement).
- GSAP (ScrollTrigger, SplitText) est réservé aux effets liés au défilement : intro, mots qui s'allument,
  empilement des projets, rails de progression.
- `prefers-reduced-motion` est respecté partout : animations désactivées, contenu immédiatement visible.
