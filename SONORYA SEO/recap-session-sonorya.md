# Récapitulatif de session — Landing page Sonorya by Technova

**Date :** 10 août 2026
**Produit concerné :** Sonorya by Technova (anciennement Mélodia — renommage suite au conflit de nom de domaine melodya.fr)

---

## Contexte

TOUDONOU a choisi **Sonorya by Technova** comme nouveau nom pour remplacer Mélodia (melodya.fr étant déjà pris par un acteur français existant du même secteur). Objectif de la session : produire une nouvelle landing page pour Sonorya, en s'inspirant de la **structure fonctionnelle** du site melodya.fr (sections, parcours utilisateur) sans reprendre ni son contenu, ni son design, ni son identité visuelle.

## Problème rencontré

- Le nom "Mélodia" était bloqué : domaine melodya.fr déjà exploité par une entreprise concurrente (chansons personnalisées pour événements, marché français).
- Besoin d'identifier les éléments de structure d'une landing page performante dans ce secteur pour ne rien oublier (parcours de conversion, sections clés).

## Solution appliquée

1. **Analyse structurelle de melodya.fr** (via web_fetch) pour identifier l'architecture de la page : Hero → Occasions → Comment ça marche → Écouter des exemples → Formules/Tarifs → Témoignages → FAQ → Formulaire de contact/footer.
2. **Reprise de cette architecture uniquement**, avec un contenu et un design 100% originaux et adaptés à Technova :
   - Palette dark glassmorphism : navy profond (#0d0a1c), plum (#241442/#3a2160), coral (#ff6f5c), gold (#e8b356) — cohérente avec l'identité visuelle déjà établie pour Mélodia/Sonorya (typographies Playfair Display + Poppins).
   - Élément signature : un disque vinyle animé (rotation CSS) avec waveform pulsante en bas, symbolisant la musique générée sur mesure.
   - Occasions adaptées au contexte ouest-africain : ajout de "Dot & fiançailles" en plus de mariage, anniversaire, naissance/baptême, réussite, hommage, retraite, entreprise.
   - Tarifs convertis en FCFA (Essentielle 10 000 FCFA / Signature 18 000 FCFA / Prestige 30 000 FCFA), avec mention explicite du paiement Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave), cohérent avec l'infrastructure Technova Pay / FedaPay déjà utilisée sur les autres produits du portefeuille.
   - Témoignages fictifs localisés (Cotonou, Abidjan, Dakar).
   - FAQ adaptée (langues locales proposées : fon, yoruba, dioula, wolof, français, anglais).
   - Formulaire de contact fonctionnel (front-end, sans back-end connecté à ce stade).
3. Fichier livré en HTML/CSS/JS pur (un seul fichier), responsive, animations respectant `prefers-reduced-motion`, focus clavier visible.

## Problèmes résolus

- ✅ Nouveau nom "Sonorya by Technova" intégré dans le branding (logo, footer, textes).
- ✅ Structure de conversion complète reprise et adaptée (8 sections).
- ✅ Design entièrement original, aucun contenu ni visuel copié de melodya.fr (conformité droits d'auteur).
- ✅ Tarification et moyens de paiement alignés sur le marché cible (FCFA + Mobile Money).

## Points ouverts / restants

- [ ] **Domaine à réserver** pour Sonorya (ex. sonorya.com, sonorya.tech, sonorya.africa — à vérifier disponibilité).
- [ ] Le formulaire de contact est actuellement un mock (`alert()` au submit) — à connecter à un backend (email, WhatsApp Business API, ou base de données) lors de l'intégration finale.
- [ ] Les pistes audio de la section "Écouter" sont des placeholders (bouton play sans lecteur audio réel) — à connecter à de vrais fichiers générés via MiniMax Music API une fois disponibles.
- [ ] Décision à prendre : conserver le disque vinyle animé comme élément signature définitif, ou tester une variante alternative.
- [ ] Vérifier cohérence finale de la charte graphique Sonorya avec les autres produits Technova (notamment si le nom "Mélodia" doit être remplacé partout où il apparaît déjà dans le code existant).
- [ ] Intégration paiement réel (FedaPay) sur les boutons "Commander" des formules.

## Fichiers livrés (v1)

- `sonorya-landing.html` — landing page complète, prête à être hébergée ou intégrée dans un projet Next.js existant.

---

## Itération 2 — nouveau thème premium + motion design + tarifs révisés

### Demandes de TOUDONOU
1. Animation de couleur à l'intérieur de la police sur "Votre histoire mérite sa propre chanson".
2. Un thème visuel totalement différent, pour ne ressembler ni à melodya.fr, ni au premier jet (dark navy/plum/coral/gold).
3. Nouveaux tarifs : Essentielle 2 500 FCFA, Signature 3 500 FCFA, Prestige 7 500 FCFA.
4. Livraison de musique instantanée et téléchargeable (au lieu de 24h/48h).

### Solution appliquée
- **Nouveau thème "Obsidienne & Or liquide"** : fond noir obsidienne (#08080a), or liquide animé (#d9a544 → #f7e7b4), touche émeraude (#3f6f5e) en contrepoint — palette totalement différente du premier jet et de melodya.fr.
- **Nouvelle typographie** : Fraunces (display, plus éditoriale/luxe) + Inter (corps de texte) + Space Mono (labels, prix, eyebrows) pour une signature "studio d'enregistrement premium", différente de Playfair+Poppins utilisée en v1.
- **Animation de couleur dans le texte** : le mot-clé du titre ("sa propre chanson") utilise un dégradé animé en boucle (or → émeraude → or) via `background-clip: text` + keyframes, un effet de "shimmer" líquide directement dans les lettres.
- **Nouvel élément signature** : un ruban sonore SVG animé en arrière-plan du hero (dégradé de couleur animé en SMIL), remplaçant le disque vinyle du premier jet — plus abstrait et premium, sans ressemblance avec melodya.fr.
- **Mise en page plus éditoriale** : grilles à bordures fines façon "grille de studio" (occasions, process, tarifs, témoignages) au lieu de cartes arrondies glassmorphism.
- **Tarifs mis à jour** : 2 500 / 3 500 / 7 500 FCFA, toutes les mentions de délai (24h/48h) remplacées par "livraison instantanée" et "téléchargement immédiat" dans les sections Hero, Formules, Process et FAQ.

### Problèmes résolus
- ✅ Thème visuel distinct à la fois de melodya.fr et de la première proposition Sonorya.
- ✅ Animation de couleur intégrée directement dans la typographie du titre principal.
- ✅ Grille tarifaire alignée sur les nouveaux montants (2 500 / 3 500 / 7 500 FCFA).
- ✅ Toutes les mentions de délai de livraison mises à jour vers "instantané / téléchargeable".

### Points ouverts / restants
- [ ] Choisir entre le thème v1 (navy/plum/coral/gold) et le thème v2 (obsidienne/or liquide) comme identité définitive de Sonorya — ou tester un 3e thème.
- [ ] Domaine à réserver pour Sonorya.
- [ ] Formulaire de contact toujours en mock (`alert()`) — à connecter à un vrai backend.
- [ ] Pistes audio "Écouter" toujours en placeholder — à connecter aux vrais fichiers MiniMax Music API.
- [ ] Intégration paiement réel (FedaPay) sur les boutons "Commander", avec déblocage du téléchargement instantané après confirmation de paiement.

## Fichiers livrés (v2)

- `sonorya-landing-v2.html` — nouvelle version premium avec motion design typographique et tarifs à jour.

---

## Itération 3 — 3e thème premium avec illustration couple casque

### Demande de TOUDONOU
Une troisième proposition de landing page, thème premium différent, avec une image d'un homme et d'une femme, en grand, écoutant de la musique au casque, à côté du titre.

### Décision prise
Recherche d'images stock effectuée (couples avec casques), mais les visuels stock génériques posent un problème de droits d'auteur et de cohérence de marque pour un livrable Technova. Décision : remplacer la photo par une **illustration vectorielle sur-mesure** (SVG) d'un homme et d'une femme de profil, casques aux oreilles, dans les couleurs du nouveau thème — évite tout risque de droits d'image et garantit un rendu 100% aligné à l'identité Sonorya.

### Solution appliquée
- **Nouveau thème "Pin & Rose poudré"** : fond vert pin profond (#0f2019), rose poudré (#e8a89c) et jaune beurre (#e9c46a) en accents, texte crème — 3e palette distincte des deux précédentes (dark navy/plum/coral/gold et obsidienne/or liquide).
- **Nouvelle typographie** : Instrument Serif (display italique, très éditorial/élégant) + Work Sans (corps de texte) — encore différente des deux paires précédentes.
- **Layout hero en split-screen** : titre + texte à gauche, grand panneau illustration à droite (ratio 4:5) avec l'illustration du couple casque, cercles de soundwave en arrière-plan, notes de musique flottantes, et un bandeau flottant "Chaque histoire, sa mélodie" en bas du panneau.
- Reste de la structure (occasions, process, écouter, formules, avis, FAQ, contact) conservée avec la nouvelle palette et les tarifs 2 500 / 3 500 / 7 500 FCFA + livraison instantanée déjà en place depuis l'itération 2.

### Problèmes résolus
- ✅ Troisième thème premium livré, visuellement distinct des deux précédents et de melodya.fr.
- ✅ Visuel homme + femme casque aux oreilles intégré à côté du titre, sans risque de droits d'image (illustration originale au lieu d'une photo stock).

### Points ouverts / restants
- [ ] TOUDONOU doit choisir la direction artistique définitive parmi les 3 thèmes (v1 navy/corail/or, v2 obsidienne/or liquide, v3 pin/rose poudré) ou demander une 4e itération.
- [ ] Si une vraie photographie est souhaitée à la place de l'illustration, prévoir soit une séance photo/shooting propre à Technova, soit une banque d'images avec licence commerciale claire (à éviter : hotlink direct d'images de résultats de recherche, non garanti en droits).
- [ ] Domaine à réserver pour Sonorya.
- [ ] Formulaire de contact toujours en mock (`alert()`) — à connecter à un vrai backend.
- [ ] Pistes audio "Écouter" toujours en placeholder — à connecter aux vrais fichiers MiniMax Music API.
- [ ] Intégration paiement réel (FedaPay) sur les boutons "Commander", avec déblocage du téléchargement instantané après confirmation de paiement.

## Fichiers livrés (v3)

- `sonorya-landing-v3.html` — 3e thème premium avec illustration originale du couple casque en hero.

---

## Itération 4 — motion design du disque, FAQ IziMelo, scintillement, éléments InsMelo

### Demandes de TOUDONOU
1. Remplacer les personnages illustrés du hero (v3) par le motion design du disque vinyle animé (image jointe, issue de la v1).
2. Animation de couleur à l'intérieur de la police sur "Votre histoire mérite sa propre chanson".
3. Reprendre la FAQ de IziMelo (concurrent identifié : izimelo.com, chansons IA personnalisées).
4. Un effet de scintillement en arrière-plan sur tout le site, comme observé sur melodya.fr.
5. Reprendre des éléments d'affichage de insmelo.com (générateur de musique IA).

### Recherches effectuées
- Consultation d'izimelo.com/fr : structure de FAQ identifiée (4 questions clés sur les prénoms dans la chanson, les occasions possibles, le choix du style, et la réception du fichier).
- Consultation d'insmelo.com/fr : éléments identifiés — bandeau de statistiques chiffrées, grille de personas ("pour qui" est l'outil), process en 3 étapes illustré, badges d'application mobile.

### Solution appliquée
- **Hero** : les silhouettes illustrées remplacées par le disque vinyle animé (rotation continue, waveform pulsante, 3 badges flottants "Paroles sur mesure", "Voix & langue au choix", "Afrobeat · Zouk"), recoloré dans la palette pin/rose poudré/beurre de la v3 pour rester cohérent avec le thème choisi.
- **Titre animé** : "sa propre chanson" utilise désormais un dégradé de couleur animé en boucle (rose poudré ↔ jaune beurre) directement dans les lettres, via `background-clip: text`.
- **FAQ** : reformulée avec des mots propres à Sonorya en reprenant la structure d'IziMelo — prénoms/anecdotes dans la chanson, occasions possibles, choix du style musical, réception de la chanson — complétée par les deux questions propres à Sonorya (paiement Mobile Money, choix de la langue/voix).
- **Scintillement global** : calque fixe de particules scintillantes (points de couleur crème/rose/jaune) en arrière-plan de toute la page, avec deux animations décalées pour un effet de scintillement naturel, visible derrière l'ensemble du site (pas seulement le hero).
- **Éléments InsMelo** :
  - Bandeau de statistiques chiffrées sous le hero (chansons générées, taux de satisfaction, délai, styles disponibles).
  - Nouvelle section « Pour qui est Sonorya » : grille de 8 profils cibles (familles, couples, entreprises, créateurs de contenu, enseignants, organisateurs d'événements, hommages, envie spontanée), avant la section tarifs.

### Problèmes résolus
- ✅ Visuel hero remplacé par le motion design du disque, dans la palette du thème retenu (v3).
- ✅ Animation de couleur intégrée dans le titre principal.
- ✅ FAQ alignée sur la structure d'un concurrent de référence, reformulée avec un contenu propre à Sonorya (aucune reprise verbatim, conformité droits d'auteur).
- ✅ Scintillement de fond appliqué à l'ensemble du site.
- ✅ Deux nouveaux blocs d'affichage inspirés d'InsMelo intégrés (stats + personas).

### Points ouverts / restants
- [ ] Choix définitif de la direction artistique parmi les 4 itérations produites.
- [ ] Les chiffres du bandeau de statistiques (1 200+ chansons, 98% satisfaction) sont des exemples placeholder — à remplacer par les vraies données une fois le produit lancé.
- [ ] Domaine à réserver pour Sonorya.
- [ ] Formulaire de contact toujours en mock (`alert()`) — à connecter à un vrai backend.
- [ ] Pistes audio "Écouter" toujours en placeholder — à connecter aux vrais fichiers MiniMax Music API.
- [ ] Intégration paiement réel (FedaPay) sur les boutons "Commander".

## Fichiers livrés (v4)

- `sonorya-landing-v4.html` — version finale intégrant motion design du disque, titre animé, FAQ IziMelo-inspirée, scintillement global et éléments InsMelo.

---

## Itération 5 — bascule vers un thème bleu pur

### Demande de TOUDONOU
Remplacer la palette pin/rose poudré par un thème "bleu pur".

### Solution appliquée
- Nouvelle palette : fond bleu nuit très profond (#050b1e), panneaux bleu marine (#0a1630), accent bleu électrique pur (#2e6bff / #1741c9) et bleu ciel clair (#5ab4ff) en second accent — remplace le duo rose poudré/beurre par une gamme 100% bleue, cohérente avec la demande.
- Tous les dégradés et ombres portées (hero, bouton principal, disque animé, carte tarif "Signature") recalculés dans les mêmes tons bleus pour rester cohérents (plus aucune trace de rose/beurre dans le fichier).
- Structure, typographie (Instrument Serif + Work Sans), motion design du disque, titre animé, FAQ, scintillement et sections InsMelo (stats + personas) conservés à l'identique — seule la colorimétrie change.

### Problèmes résolus
- ✅ Thème entièrement basculé en bleu pur, sans résidu de couleur de l'itération précédente.

### Points ouverts / restants
- [ ] Choix définitif de la direction artistique parmi les versions produites (v1 navy/corail/or, v2 obsidienne/or liquide, v3 pin/rose poudré, v4 = v3 enrichie, v5 = v4 en bleu pur).
- [ ] Les chiffres du bandeau de statistiques restent des exemples placeholder.
- [ ] Domaine à réserver pour Sonorya.
- [ ] Formulaire de contact toujours en mock (`alert()`) — à connecter à un vrai backend.
- [ ] Pistes audio "Écouter" toujours en placeholder — à connecter aux vrais fichiers MiniMax Music API.
- [ ] Intégration paiement réel (FedaPay) sur les boutons "Commander".

## Fichiers livrés (v5)

- `sonorya-landing-v5-bleu.html` — version finale en thème bleu pur.

---

## Itération 6 — Stratégie SEO complète

### Demande de TOUDONOU
Produire un SEO "parfait" pour Sonorya.

### Recherches effectuées
- Analyse concurrentielle élargie : identification de **mymuisic.com** comme concurrent direct le plus proche (chanson IA, Afrobeat/Amapiano, paiement Wave & Mobile Money, marché ouest-africain) en plus d'izimelo.com, insmelo.com et melodya.fr déjà identifiés.
- Recherche de mots-clés français liés au secteur (chanson personnalisée IA, cadeau musical, etc.).

### Solution appliquée
1. **SEO technique intégré directement dans la landing page** (`sonorya-landing-v5-bleu.html`) :
   - Title et meta description optimisés avec mots-clés commerciaux prioritaires.
   - Meta keywords, robots, canonical.
   - Balises hreflang pour les marchés Bénin, Côte d'Ivoire, Sénégal, France.
   - Open Graph complet + Twitter Card pour le partage social.
   - Données structurées JSON-LD : `Organization`, `Service` (avec les 3 offres et prix en XOF), `FAQPage` (reprenant la FAQ affichée).
2. **Fichiers techniques** : `robots.txt` et `sitemap.xml` (structure de pages recommandée : accueil + pages occasion + blog + FAQ).
3. **Document de stratégie SEO complet** (`seo-strategy-sonorya.docx`), incluant :
   - Analyse concurrentielle (4 acteurs, dont le nouveau concurrent identifié mymuisic.com).
   - Recherche de mots-clés (principaux, longue traîne par occasion, locaux par pays/ville, mots-clés de marque).
   - Architecture de site recommandée (pages occasion dédiées à créer : /mariage, /dot-fiancailles, /anniversaire, etc.).
   - Plan de contenu blog sur 3 mois (9 articles avec mot-clé ciblé).
   - Checklist SEO technique restante (domaine, Core Web Vitals, Search Console, SSL...).
   - Plan SEO local (Google Business Profile Cotonou, avis géolocalisés, partenariats wedding planners).
   - Plan de netlinking (annuaires, articles invités, cross-linking Technova).
   - KPIs de suivi à 3 et 6 mois.

### Problèmes résolus
- ✅ SEO on-page complet appliqué à la landing page (meta tags, Open Graph, Twitter Card, JSON-LD).
- ✅ Fichiers techniques robots.txt et sitemap.xml livrés.
- ✅ Stratégie SEO complète documentée : mots-clés, contenu, technique, local, netlinking, KPIs.

### Points ouverts / restants
- [ ] Réserver le nom de domaine définitif (actuellement placeholder `sonorya.technova.africa` utilisé dans les balises — à remplacer par le vrai domaine une fois choisi).
- [ ] Créer les pages occasion dédiées (/mariage, /dot-fiancailles, etc.) — actuellement une seule landing page one-page.
- [ ] Produire le visuel Open Graph 1200x630 référencé dans les meta tags.
- [ ] Créer le blog et rédiger les 9 premiers articles du plan de contenu.
- [ ] Configurer Google Search Console, Bing Webmaster Tools et Google Business Profile une fois le site en ligne.
- [ ] Domaine, formulaire de contact, pistes audio réelles et paiement FedaPay : toujours en attente (cf. itérations précédentes).

## Fichiers livrés (v6 — SEO)

- `sonorya-landing-v5-bleu.html` — landing page mise à jour avec SEO technique intégré.
- `robots.txt` — fichier robots pour l'indexation.
- `sitemap.xml` — plan de site avec les pages recommandées.
- `seo-strategy-sonorya.docx` — stratégie SEO complète (mots-clés, contenu, technique, local, netlinking, KPIs).

---

## Itération 7 — SEO recentré sur une audience mondiale (suppression du ciblage Afrique)

### Demande de TOUDONOU
Reprendre le SEO en supprimant tout ciblage géographique Afrique : Sonorya est un site pour tout le monde, populations francophones et anglophones.

### Solution appliquée
- **Meta tags de la landing page** : suppression de toute mention de pays/villes africains ("Afrique", "Bénin", "Côte d'Ivoire", "Sénégal", "Mali", noms de villes) dans le title, la meta description et les mots-clés. Suppression des moyens de paiement africains nommément cités (Orange Money, MTN MoMo, Moov Money, Wave) au profit d'un message générique "paiement en ligne sécurisé, carte bancaire ou Mobile Money selon votre pays".
- **Hreflang** : remplacement du ciblage par pays (fr-bj, fr-ci, fr-sn, fr-fr) par une structure bilingue mondiale simple : `fr` / `en` / `x-default`, avec une URL `/en/` prévue pour la version anglaise à venir.
- **Open Graph** : ajout de `og:locale:alternate` (en_US) en plus de `og:locale` (fr_FR) pour signaler le bilinguisme aux réseaux sociaux.
- **JSON-LD** : `areaServed` remplacé par `"Worldwide"` sur les schémas Organization et Service, ajout de `availableLanguage: ["French", "English"]`. FAQPage nettoyée des références à la dot et aux langues locales africaines (fon, yoruba, dioula, wolof).
- **Sitemap.xml** : entièrement reconstruit en version bilingue, avec une URL FR et une URL EN pour chaque page (accueil, mariage/wedding, anniversaire/birthday, naissance/new-baby, entreprise/business, blog, FAQ), reliées par du balisage hreflang réciproque.
- **robots.txt** : mis à jour avec le nouveau domaine générique `sonorya.technova.com` (au lieu du placeholder `.africa`).
- **Document de stratégie SEO refait entièrement** (`seo-strategy-sonorya.docx`) :
  - Nouvelle analyse concurrentielle centrée sur des acteurs internationaux bilingues (Songly.gift, MemoTune, SongGenerator.io, en plus de Mymuisic/IziMelo/InsMelo).
  - Recherche de mots-clés dédoublée FR/EN (mots-clés principaux et longue traîne dans les deux langues).
  - Architecture de site bilingue proposée (chaque page FR a son équivalent /en/).
  - Plan de contenu blog sur 3 mois, en version FR et EN pour chaque article.
  - Suppression complète de la section SEO local (Google Business Profile Cotonou, avis géolocalisés, partenariats wedding planners locaux) et du netlinking à ancrage africain, remplacés par un netlinking international (répertoires d'outils IA, presse tech bilingue).
  - KPIs mis à jour avec un objectif de position séparé pour le mot-clé français et le mot-clé anglais.

### Problèmes résolus
- ✅ Toute référence géographique à l'Afrique supprimée des balises techniques, du contenu SEO et du document de stratégie.
- ✅ Positionnement recentré sur une audience mondiale francophone et anglophone, avec structure technique bilingue prête (hreflang, sitemap, schémas).

### Points ouverts / restants
- [ ] **Créer la version anglaise du site** (`/en/`) — actuellement seule la version française existe ; les URLs /en/ sont préparées dans le sitemap mais pas encore développées.
- [ ] Réserver le nom de domaine définitif (placeholder `sonorya.technova.com` utilisé).
- [ ] Décider si les moyens de paiement Mobile Money (Orange Money, MTN, Moov, Wave) doivent rester visibles sur la page pour les visiteurs ouest-africains, ou être remplacés par un module de paiement plus générique (carte bancaire, PayPal, etc.) pour une audience mondiale — actuellement seuls les meta tags ont été généralisés, le contenu visible de la page n'a pas été modifié sur ce point précis.
- [ ] Produire le visuel Open Graph 1200x630 en versions FR et EN.
- [ ] Créer le blog et rédiger les 9 premiers articles du plan de contenu, en français et en anglais.
- [ ] Configurer Google Search Console, Bing Webmaster Tools une fois le site en ligne.
- [ ] Formulaire de contact, pistes audio réelles et intégration paiement : toujours en attente (cf. itérations précédentes).

## Fichiers livrés (v7 — SEO mondial)

- `sonorya-landing-v5-bleu.html` — landing page avec SEO technique mondial (sans ciblage Afrique).
- `robots.txt` — mis à jour avec le domaine générique.
- `sitemap.xml` — structure bilingue FR/EN.
- `seo-strategy-sonorya.docx` — stratégie SEO mondiale complète, refaite sans ciblage Afrique.
- `recap-session-sonorya.md` — ce récapitulatif (mis à jour).
