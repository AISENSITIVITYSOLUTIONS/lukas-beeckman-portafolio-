import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, AtSign, Mail, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { artworks, curatorialGroups } from './data/artworks';
import './styles.css';

const USD_RATE = 18.5;

const languages = [
  { code: 'es', label: 'Spanish', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'French', short: 'FR' },
];

const ui = {
  es: {
    nav: ['Recorrido', 'Series', 'Obra', 'Archivo', 'Sobre', 'Contacto'],
    ariaNav: 'Navegación principal',
    all: 'Todas',
    heroEyebrow: 'Portafolio visual / catálogo de obra 2021-2026',
    heroSubtitle: 'Artista visual joven. Óleo, gesto, figura y exploraciones materiales contemporáneas.',
    viewWork: 'Ver obra',
    archive: 'Archivo',
    visualEyebrow: 'Recorrido visual',
    visualTitle: 'Una secuencia lenta, casi cinematográfica.',
    seriesEyebrow: 'Organización curatorial',
    seriesTitle: 'Cuatro entradas para leer la obra sin encerrarla.',
    featuredEyebrow: 'Obra destacada',
    featuredTitle: 'Una galería respirada, organizada por gesto, soporte y etapa.',
    archiveEyebrow: 'Archivo',
    archiveTitle: 'Registro documental de producción.',
    aboutEyebrow: 'Sobre el artista',
    aboutTitle: 'Lukas Beeckman.',
    aboutText: 'Lukas Beeckman construye una obra visual en la que la forma, la sensibilidad y la exploración material dialogan con una mirada joven, precisa y en expansión. Su trabajo se presenta como un archivo vivo: una búsqueda estética que combina intuición, disciplina y deseo de construir un lenguaje propio.',
    contactEyebrow: 'Contacto',
    contactTitle: 'Para consultas, colaboraciones, exposiciones o adquisición de obra.',
    filterAria: 'Filtrar obras por etiqueta',
    modalAria: 'Ficha de',
    close: 'Cerrar',
    year: 'Año',
    technique: 'Técnica',
    dimensions: 'Dimensiones',
    price: 'Precio',
    previous: 'Anterior',
    next: 'Siguiente',
  },
  en: {
    nav: ['Walkthrough', 'Series', 'Works', 'Archive', 'About', 'Contact'],
    ariaNav: 'Primary navigation',
    all: 'All',
    heroEyebrow: 'Visual portfolio / catalogue of works 2021-2026',
    heroSubtitle: 'Young visual artist. Oil, gesture, figure and contemporary material explorations.',
    viewWork: 'View works',
    archive: 'Archive',
    visualEyebrow: 'Visual walkthrough',
    visualTitle: 'A slow, almost cinematic sequence.',
    seriesEyebrow: 'Curatorial organization',
    seriesTitle: 'Four entries for reading the work without enclosing it.',
    featuredEyebrow: 'Featured works',
    featuredTitle: 'A breathing gallery, organized by gesture, support and period.',
    archiveEyebrow: 'Archive',
    archiveTitle: 'Documentary record of production.',
    aboutEyebrow: 'About the artist',
    aboutTitle: 'Lukas Beeckman.',
    aboutText: 'Lukas Beeckman builds a visual body of work in which form, sensitivity and material exploration enter into dialogue with a young, precise and expanding gaze. His work appears as a living archive: an aesthetic search that combines intuition, discipline and the desire to build a language of his own.',
    contactEyebrow: 'Contact',
    contactTitle: 'For inquiries, collaborations, exhibitions or acquisition of works.',
    filterAria: 'Filter works by tag',
    modalAria: 'Artwork file for',
    close: 'Close',
    year: 'Year',
    technique: 'Technique',
    dimensions: 'Dimensions',
    price: 'Price',
    previous: 'Previous',
    next: 'Next',
  },
  fr: {
    nav: ['Parcours', 'Séries', 'Œuvres', 'Archive', 'À propos', 'Contact'],
    ariaNav: 'Navigation principale',
    all: 'Toutes',
    heroEyebrow: 'Portfolio visuel / catalogue des œuvres 2021-2026',
    heroSubtitle: 'Jeune artiste visuel. Huile, geste, figure et explorations matérielles contemporaines.',
    viewWork: 'Voir les œuvres',
    archive: 'Archive',
    visualEyebrow: 'Parcours visuel',
    visualTitle: 'Une séquence lente, presque cinématographique.',
    seriesEyebrow: 'Organisation curatoriale',
    seriesTitle: 'Quatre entrées pour lire l’œuvre sans l’enfermer.',
    featuredEyebrow: 'Œuvre en vedette',
    featuredTitle: 'Une galerie respirée, organisée par geste, support et période.',
    archiveEyebrow: 'Archive',
    archiveTitle: 'Registre documentaire de production.',
    aboutEyebrow: 'À propos de l’artiste',
    aboutTitle: 'Lukas Beeckman.',
    aboutText: 'Lukas Beeckman construit une œuvre visuelle où la forme, la sensibilité et l’exploration matérielle dialoguent avec un regard jeune, précis et en expansion. Son travail se présente comme une archive vivante : une recherche esthétique qui associe intuition, discipline et désir de construire un langage propre.',
    contactEyebrow: 'Contact',
    contactTitle: 'Pour demandes, collaborations, expositions ou acquisition d’œuvres.',
    filterAria: 'Filtrer les œuvres par étiquette',
    modalAria: 'Fiche de',
    close: 'Fermer',
    year: 'Année',
    technique: 'Technique',
    dimensions: 'Dimensions',
    price: 'Prix',
    previous: 'Précédent',
    next: 'Suivant',
  },
};

const tagTranslations = {
  en: {
    Materia: 'Materiality',
    Memoria: 'Memory',
    'Obra reciente': 'Recent work',
    Experimental: 'Experimental',
    Retrato: 'Portrait',
    'Figura humana': 'Human figure',
    Mirada: 'Gaze',
    Juventud: 'Youth',
    Gesto: 'Gesture',
    Boceto: 'Study',
    'Paisaje interior': 'Interior landscape',
    Color: 'Color',
    Intensidad: 'Intensity',
    Movimiento: 'Movement',
    'Serie inicial': 'Early series',
    Autorretrato: 'Self-portrait',
  },
  fr: {
    Materia: 'Matière',
    Memoria: 'Mémoire',
    'Obra reciente': 'Œuvre récente',
    Experimental: 'Expérimental',
    Retrato: 'Portrait',
    'Figura humana': 'Figure humaine',
    Mirada: 'Regard',
    Juventud: 'Jeunesse',
    Gesto: 'Geste',
    Boceto: 'Étude',
    'Paisaje interior': 'Paysage intérieur',
    Color: 'Couleur',
    Intensidad: 'Intensité',
    Movimiento: 'Mouvement',
    'Serie inicial': 'Première série',
    Autorretrato: 'Autoportrait',
  },
};

const seriesTranslations = {
  en: {
    'Colección Miradas': 'Gaze Collection',
    'Soportes íntimos': 'Intimate Supports',
    'Escenas afectivas': 'Affective Scenes',
    'Escenas interiores': 'Interior Scenes',
    Estudios: 'Studies',
    'Cuerpo nocturno': 'Nocturnal Body',
    Retratos: 'Portraits',
    'Retratos deformados': 'Deformed Portraits',
    'Cuerpo colectivo': 'Collective Body',
    'Serie inicial': 'Early Series',
  },
  fr: {
    'Colección Miradas': 'Collection Regards',
    'Soportes íntimos': 'Supports intimes',
    'Escenas afectivas': 'Scènes affectives',
    'Escenas interiores': 'Scènes intérieures',
    Estudios: 'Études',
    'Cuerpo nocturno': 'Corps nocturne',
    Retratos: 'Portraits',
    'Retratos deformados': 'Portraits déformés',
    'Cuerpo colectivo': 'Corps collectif',
    'Serie inicial': 'Première série',
  },
};

const techniqueTranslations = {
  en: {
    'Óleo sobre vidrio': 'Oil on glass',
    'Óleo sobre bastidor de tela': 'Oil on stretched canvas',
    'Óleo sobre cartón forrado': 'Oil on lined cardboard',
    'Óleo sobre Fabriano': 'Oil on Fabriano paper',
    'Óleo sobre madera, en tres piezas': 'Oil on wood, in three parts',
    'Óleo sobre tela': 'Oil on canvas',
  },
  fr: {
    'Óleo sobre vidrio': 'Huile sur verre',
    'Óleo sobre bastidor de tela': 'Huile sur toile montée sur châssis',
    'Óleo sobre cartón forrado': 'Huile sur carton doublé',
    'Óleo sobre Fabriano': 'Huile sur papier Fabriano',
    'Óleo sobre madera, en tres piezas': 'Huile sur bois, en trois pièces',
    'Óleo sobre tela': 'Huile sur toile',
  },
};

const curatorialTranslations = {
  en: {
    'Colección Miradas': ['Gaze Collection', '7 works', 'Portraits, studies and self-representations where the face operates as the core of visual tension.'],
    'Escenas afectivas': ['Affective Scenes', '5 works', 'Bodies, rooms and intimate situations that introduce memory, desire and contained narration.'],
    'Soportes íntimos': ['Intimate Supports', '2 works', 'Works on glass that move painting toward everyday objects charged with presence.'],
    'Retratos deformados': ['Deformed Portraits', '4 works', 'Faces crossed by gesture, speed and pictorial matter, between study and disfiguration.'],
  },
  fr: {
    'Colección Miradas': ['Collection Regards', '7 œuvres', 'Portraits, études et autoreprésentations où le visage devient le noyau de la tension visuelle.'],
    'Escenas afectivas': ['Scènes affectives', '5 œuvres', 'Corps, chambres et situations intimes qui introduisent mémoire, désir et narration contenue.'],
    'Soportes íntimos': ['Supports intimes', '2 œuvres', 'Pièces sur verre qui déplacent la peinture vers des objets quotidiens chargés de présence.'],
    'Retratos deformados': ['Portraits déformés', '4 œuvres', 'Visages traversés par le geste, la vitesse et la matière picturale, entre étude et défiguration.'],
  },
};

const descriptionTranslations = {
  en: {
    victoria: 'A small piece that turns an everyday support into a devotional and pictorial object.',
    estirada: 'The narrow format intensifies the frontality of the face and makes the gaze a vertical axis.',
    'apoco-si': 'A study of expression where irony and vulnerability coexist in the gesture.',
    'estudio-1': 'The economy of the study concentrates attention on the face as a territory of apparition.',
    nenukos: 'An affective scene that works with closeness, body and memory through a contained register.',
    'la-cantina': 'The scene displaces portraiture toward atmosphere: table, shadow and ambience as presence.',
    camcorder: 'A gaze mediated by image, screen and memory: painting as a recording device.',
    'estudio-2': 'The study holds a minimal, almost silent corporeality, sustained by gesture.',
    'estudio-3': 'A dark and contained figure where matter operates as partial apparition.',
    'mary-y-chuy': 'Painting on glass that brings together religious, popular and affective imagery.',
    confesion: 'A major work that articulates body, devotion and intimate tension in a large format.',
    motel: 'The scene builds intimacy without closing it down: the body appears as a suspended narrative.',
    'la-batalla': 'A narrative composition where movement introduces tension and scene.',
    douceur: 'The fragmented composition multiplies the body and opens a rhythm between softness and unease.',
    sollozo: 'An image withdrawn into itself, sustained by an emotional chiaroscuro.',
    'bonne-nuit': 'An early piece where the gaze appears covered, fractured and still insistent.',
    autorretrato: 'A frontal entry into the self as mask, tension and construction of presence.',
    ushanka: 'The face is organized from a strange serenity: cold, texture and presence.',
    'el-beso': 'An early work that already shows an interest in the face, color and affective image.',
    fisheye: 'The figure distorts as if the pictorial eye were also lens and body.',
    blush: 'Stain and skin become confused in an image of affection and alteration.',
    rire: 'A dissolving face where laughter appears as a vibration of matter.',
    'rire-2': 'An expressive variation where the face opens between brightness, speed and disfiguration.',
    'histeria-colectiva': 'A choral composition where hands and faces condense a shared psychological energy.',
    carmina: 'Two presences in red hold a scene of closeness, duplication and friction.',
    ophelia: 'The floral figure and pale face articulate fragility, theater and contemplation.',
  },
  fr: {
    victoria: 'Une petite pièce qui transforme un support quotidien en objet dévotionnel et pictural.',
    estirada: 'Le format étroit intensifie la frontalité du visage et fait du regard un axe vertical.',
    'apoco-si': 'Une étude d’expression où l’ironie et la vulnérabilité coexistent dans le geste.',
    'estudio-1': 'L’économie de l’étude concentre l’attention sur le visage comme territoire d’apparition.',
    nenukos: 'Une scène affective qui travaille la proximité, le corps et la mémoire dans un registre contenu.',
    'la-cantina': 'La scène déplace le portrait vers l’ambiance : table, ombre et atmosphère comme présence.',
    camcorder: 'Un regard médiatisé par l’image, l’écran et le souvenir : la peinture comme dispositif d’enregistrement.',
    'estudio-2': 'L’étude retient une corporéité minimale, presque silencieuse, soutenue par le geste.',
    'estudio-3': 'Une figure sombre et contenue où la matière opère comme apparition partielle.',
    'mary-y-chuy': 'Peinture sur verre qui rapproche l’image religieuse, populaire et affective.',
    confesion: 'Une œuvre majeure qui articule corps, dévotion et tension intime en grand format.',
    motel: 'La scène construit l’intimité sans la clore : le corps apparaît comme récit suspendu.',
    'la-batalla': 'Une composition narrative où le mouvement introduit tension et scène.',
    douceur: 'La composition fragmentée multiplie le corps et ouvre un rythme entre douceur et inquiétude.',
    sollozo: 'Une image repliée sur elle-même, soutenue par un clair-obscur émotionnel.',
    'bonne-nuit': 'Une pièce précoce où le regard apparaît couvert, fracturé et pourtant insistant.',
    autorretrato: 'Une entrée frontale dans le moi comme masque, tension et construction de présence.',
    ushanka: 'Le visage s’organise depuis une étrange sérénité : froid, texture et présence.',
    'el-beso': 'Une œuvre précoce qui manifeste déjà un intérêt pour le visage, la couleur et l’image affective.',
    fisheye: 'La figure se distord comme si l’œil pictural était aussi lentille et corps.',
    blush: 'La tache et la peau se confondent dans une image d’affection et d’altération.',
    rire: 'Un visage en dissolution où le rire apparaît comme vibration de la matière.',
    'rire-2': 'Variation expressive où le visage s’ouvre entre éclat, vitesse et défiguration.',
    'histeria-colectiva': 'Une composition chorale où mains et visages condensent une énergie psychologique partagée.',
    carmina: 'Deux présences en rouge soutiennent une scène de proximité, de duplication et de friction.',
    ophelia: 'La figure florale et le visage pâle articulent fragilité, théâtre et contemplation.',
  },
};

const monthTranslations = {
  en: { Enero: 'January', Febrero: 'February', Marzo: 'March', Mayo: 'May', Junio: 'June', Julio: 'July', Agosto: 'August', Septiembre: 'September', Octubre: 'October', Noviembre: 'November', Diciembre: 'December' },
  fr: { Enero: 'Janvier', Febrero: 'Février', Marzo: 'Mars', Mayo: 'Mai', Junio: 'Juin', Julio: 'Juillet', Agosto: 'Août', Septiembre: 'Septembre', Octubre: 'Octobre', Noviembre: 'Novembre', Diciembre: 'Décembre' },
};

const tags = Array.from(new Set(artworks.flatMap((work) => work.etiquetas))).sort();

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function useTilt(maxTilt = 9) {
  const ref = useRef(null);

  const handlePointerMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty('--rx', `${(-y * maxTilt).toFixed(2)}deg`);
    node.style.setProperty('--ry', `${(x * maxTilt).toFixed(2)}deg`);
    node.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const resetTilt = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
    node.style.setProperty('--mx', '50%');
    node.style.setProperty('--my', '50%');
  };

  return {
    ref,
    onPointerMove: handlePointerMove,
    onPointerLeave: resetTilt,
    onPointerCancel: resetTilt,
  };
}

function TiltButton({ className, children, maxTilt = 9, ...props }) {
  const tilt = useTilt(maxTilt);
  return (
    <button className={className} {...tilt} {...props}>
      {children}
    </button>
  );
}

function tr(map, lang, value) {
  return lang === 'es' ? value : map[lang]?.[value] || value;
}

function translateDate(value, lang) {
  if (lang === 'es') return value;
  return value.replace(/^[A-Za-zÁÉÍÓÚáéíóúñ]+/, (month) => monthTranslations[lang]?.[month] || month);
}

function formatPrice(price, lang) {
  const amount = Number(price.replace(/[^\d]/g, ''));
  if (lang === 'es') return `$${amount.toLocaleString('es-MX')} MXN`;
  const usd = Math.round(amount / USD_RATE / 5) * 5;
  return `USD $${usd.toLocaleString('en-US')}`;
}

function localizeWork(work, lang) {
  return {
    ...work,
    fechaText: translateDate(work.fecha, lang),
    tecnicaText: tr(techniqueTranslations, lang, work.tecnica),
    serieText: tr(seriesTranslations, lang, work.serie),
    precioText: formatPrice(work.precio, lang),
    etiquetasText: work.etiquetas.map((tag) => tr(tagTranslations, lang, tag)),
    descripcionText: descriptionTranslations[lang]?.[work.id] || work.descripcion,
  };
}

function Navigation({ lang, setLang }) {
  const t = ui[lang];
  return (
    <header className="site-header">
      <a href="#inicio" className="brand">Lukas Beeckman</a>
      <div className="header-actions">
        <nav aria-label={t.ariaNav}>
          <a href="#recorrido">{t.nav[0]}</a>
          <a href="#series">{t.nav[1]}</a>
          <a href="#obra">{t.nav[2]}</a>
          <a href="#archivo">{t.nav[3]}</a>
          <a href="#sobre">{t.nav[4]}</a>
          <a href="#contacto">{t.nav[5]}</a>
        </nav>
        <div className="language-switcher" aria-label="Language selector">
          {languages.map((language) => (
            <button
              key={language.code}
              className={lang === language.code ? 'active' : ''}
              onClick={() => setLang(language.code)}
              aria-label={language.label}
            >
              {language.short}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Hero({ lang }) {
  const t = ui[lang];
  return (
    <section className="hero section" id="inicio">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-copy"
      >
        <p className="eyebrow">{t.heroEyebrow}</p>
        <h1>Lukas Beeckman</h1>
        <p className="hero-subtitle">{t.heroSubtitle}</p>
        <div className="hero-actions">
          <a href="#obra" className="button primary">{t.viewWork}</a>
          <a href="#archivo" className="button">{t.archive}</a>
        </div>
      </motion.div>
    </section>
  );
}

function TagFilter({ activeTag, setActiveTag, lang }) {
  const t = ui[lang];
  return (
    <div className="tag-filter" aria-label={t.filterAria}>
      {[t.all, ...tags.map((tag) => tr(tagTranslations, lang, tag))].map((tag) => (
        <button
          key={tag}
          className={activeTag === tag ? 'active' : ''}
          onClick={() => setActiveTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

function ArtworkCard({ work, index, onOpen }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.24) }}
      className={cx('work-card', work.featureSize === 'large' && 'large', work.featureSize === 'wide' && 'wide')}
    >
      <TiltButton className="work-image tilt" onClick={() => onOpen(work)} maxTilt={8}>
        <img src={work.imagen} alt={work.titulo} loading="lazy" />
      </TiltButton>
      <div className="work-meta">
        <div>
          <p className="year">{work.anio}</p>
          <h3>{work.titulo}</h3>
          <p>{work.tecnicaText} · {work.dimensiones}</p>
          <p className="price">{work.precioText}</p>
        </div>
        <div className="chips">
          {work.etiquetasText.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <p className="curatorial-note">{work.descripcionText}</p>
    </motion.article>
  );
}

function FeaturedWorks({ filtered, activeTag, setActiveTag, onOpen, lang }) {
  const t = ui[lang];
  return (
    <section className="section" id="obra">
      <div className="section-heading">
        <p className="eyebrow">{t.featuredEyebrow}</p>
        <h2>{t.featuredTitle}</h2>
      </div>
      <TagFilter activeTag={activeTag} setActiveTag={setActiveTag} lang={lang} />
      <motion.div layout className="gallery-grid">
        <AnimatePresence>
          {filtered.map((work, index) => (
            <ArtworkCard key={work.id} work={work} index={index} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Series({ lang }) {
  const t = ui[lang];
  return (
    <section className="section muted" id="series">
      <div className="section-heading compact">
        <p className="eyebrow">{t.seriesEyebrow}</p>
        <h2>{t.seriesTitle}</h2>
      </div>
      <div className="series-grid">
        {curatorialGroups.map((group) => {
          const translated = curatorialTranslations[lang]?.[group.title];
          return (
          <motion.article
            key={group.title}
            className="series-card depth-card"
            whileHover={{ y: -8, rotateX: 4, rotateY: -3 }}
            transition={{ duration: 0.25 }}
          >
            <span>{translated?.[1] || group.count}</span>
            <h3>{translated?.[0] || group.title}</h3>
            <p>{translated?.[2] || group.description}</p>
          </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function VisualWalk({ onOpen, lang, works }) {
  const t = ui[lang];
  const sequence = artworks.filter((work) => work.recorrido);
  const localizedSequence = sequence.map((work) => works.find((item) => item.id === work.id));
  return (
    <section className="visual-walk section" id="recorrido">
      <div className="section-heading compact">
        <p className="eyebrow">{t.visualEyebrow}</p>
        <h2>{t.visualTitle}</h2>
      </div>
      <div className="walk-track">
        {[...localizedSequence, ...localizedSequence].map((work, index) => (
          <TiltButton key={`${work.id}-${index}`} className="walk-item" onClick={() => onOpen(work)} maxTilt={7}>
            <img src={work.imagen} alt={work.titulo} loading="lazy" />
            <span>{work.titulo}</span>
            <small>{work.precioText}</small>
          </TiltButton>
        ))}
      </div>
    </section>
  );
}

function Archive({ onOpen, lang, works }) {
  const t = ui[lang];
  const grouped = works.reduce((acc, work) => {
    acc[work.anio] = acc[work.anio] || [];
    acc[work.anio].push(work);
    return acc;
  }, {});
  return (
    <section className="section" id="archivo">
      <div className="section-heading compact">
        <p className="eyebrow">{t.archiveEyebrow}</p>
        <h2>{t.archiveTitle}</h2>
      </div>
      <div className="archive">
        {Object.keys(grouped).sort((a, b) => b - a).map((year) => (
          <div className="archive-year" key={year}>
            <h3>{year}</h3>
            <div className="archive-list">
              {grouped[year].map((work) => (
                <button className="archive-row" key={work.id} onClick={() => onOpen(work)}>
                  <img src={work.imagen} alt="" loading="lazy" />
                  <strong>{work.titulo}</strong>
                  <span>{work.tecnicaText}</span>
                  <span>{work.serieText}</span>
                  <span>{work.etiquetasText.slice(0, 2).join(', ')}</span>
                  <span className="archive-price">{work.precioText}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ lang }) {
  const t = ui[lang];
  return (
    <section className="about section muted" id="sobre">
      <div>
        <p className="eyebrow">{t.aboutEyebrow}</p>
        <h2>{t.aboutTitle}</h2>
      </div>
      <p>{t.aboutText}</p>
    </section>
  );
}

function Contact({ lang }) {
  const t = ui[lang];
  return (
    <section className="contact section" id="contacto">
      <p className="eyebrow">{t.contactEyebrow}</p>
      <h2>{t.contactTitle}</h2>
      <div className="contact-links">
        <a href="mailto:lukas2004bb@gmail.com"><Mail size={18} /> lukas2004bb@gmail.com</a>
        <a href="tel:+525540916667"><Phone size={18} /> (55) 4091 6667</a>
        <a href="https://www.instagram.com/rayitaz" target="_blank" rel="noreferrer"><AtSign size={18} /> @rayitaz</a>
      </div>
    </section>
  );
}

function ArtworkModal({ selected, setSelected, works, lang }) {
  const t = ui[lang];
  const selectedIndex = selected ? works.findIndex((work) => work.id === selected.id) : -1;
  const move = (direction) => {
    const next = (selectedIndex + direction + works.length) % works.length;
    setSelected(works[next]);
  };

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${t.modalAria} ${selected.titulo}`}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
          >
            <button className="close" onClick={() => setSelected(null)} aria-label={t.close}><X size={20} /></button>
            <div className="modal-art">
              <img src={selected.imagen} alt={selected.titulo} />
            </div>
            <aside className="modal-info">
              <p className="eyebrow">{selected.serieText}</p>
              <h2>{selected.titulo}</h2>
              <dl>
                <div><dt>{t.year}</dt><dd>{selected.fechaText}</dd></div>
                <div><dt>{t.technique}</dt><dd>{selected.tecnicaText}</dd></div>
                <div><dt>{t.dimensions}</dt><dd>{selected.dimensiones}</dd></div>
                <div><dt>{t.price}</dt><dd>{selected.precioText}</dd></div>
              </dl>
              <p>{selected.descripcionText}</p>
              <div className="chips">
                {selected.etiquetasText.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="modal-nav">
                <button onClick={() => move(-1)}><ArrowLeft size={18} /> {t.previous}</button>
                <button onClick={() => move(1)}>{t.next} <ArrowRight size={18} /></button>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [lang, setLang] = useState('es');
  const [activeTag, setActiveTag] = useState(ui.es.all);
  const [selected, setSelected] = useState(null);
  const localizedWorks = useMemo(() => artworks.map((work) => localizeWork(work, lang)), [lang]);

  const handleSetLang = (nextLang) => {
    setLang(nextLang);
    setActiveTag(ui[nextLang].all);
    setSelected((current) => current ? localizeWork(artworks.find((work) => work.id === current.id), nextLang) : null);
  };

  const filtered = useMemo(() => {
    if (activeTag === ui[lang].all) return localizedWorks;
    return localizedWorks.filter((work) => work.etiquetasText.includes(activeTag));
  }, [activeTag, lang, localizedWorks]);

  return (
    <>
      <Navigation lang={lang} setLang={handleSetLang} />
      <main>
        <Hero lang={lang} />
        <VisualWalk onOpen={setSelected} lang={lang} works={localizedWorks} />
        <Series lang={lang} />
        <FeaturedWorks filtered={filtered} activeTag={activeTag} setActiveTag={setActiveTag} onOpen={setSelected} lang={lang} />
        <Archive onOpen={setSelected} lang={lang} works={localizedWorks} />
        <About lang={lang} />
        <Contact lang={lang} />
      </main>
      <ArtworkModal selected={selected} setSelected={setSelected} works={localizedWorks} lang={lang} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
