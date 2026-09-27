import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, AtSign, Mail, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { artworks, curatorialGroups } from './data/artworks';
import './styles.css';

const tags = ['Todas', ...Array.from(new Set(artworks.flatMap((work) => work.etiquetas))).sort()];

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

function Navigation() {
  return (
    <header className="site-header">
      <a href="#inicio" className="brand">Lukas Beckman</a>
      <nav aria-label="Navegación principal">
        <a href="#recorrido">Recorrido</a>
        <a href="#series">Series</a>
        <a href="#obra">Obra</a>
        <a href="#archivo">Archivo</a>
        <a href="#sobre">Sobre</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section" id="inicio">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-copy"
      >
        <p className="eyebrow">Portafolio visual / catálogo de obra 2021-2026</p>
        <h1>Lukas Beckman</h1>
        <p className="hero-subtitle">
          Artista visual joven. Óleo, gesto, figura y exploraciones materiales contemporáneas.
        </p>
        <div className="hero-actions">
          <a href="#obra" className="button primary">Ver obra</a>
          <a href="#archivo" className="button">Archivo</a>
        </div>
      </motion.div>
    </section>
  );
}

function TagFilter({ activeTag, setActiveTag }) {
  return (
    <div className="tag-filter" aria-label="Filtrar obras por etiqueta">
      {tags.map((tag) => (
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
          <p>{work.tecnica} · {work.dimensiones}</p>
          <p className="price">{work.precio}</p>
        </div>
        <div className="chips">
          {work.etiquetas.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <p className="curatorial-note">{work.descripcion}</p>
    </motion.article>
  );
}

function FeaturedWorks({ filtered, activeTag, setActiveTag, onOpen }) {
  return (
    <section className="section" id="obra">
      <div className="section-heading">
        <p className="eyebrow">Obra destacada</p>
        <h2>Una galería respirada, organizada por gesto, soporte y etapa.</h2>
      </div>
      <TagFilter activeTag={activeTag} setActiveTag={setActiveTag} />
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

function Series() {
  return (
    <section className="section muted" id="series">
      <div className="section-heading compact">
        <p className="eyebrow">Organización curatorial</p>
        <h2>Cuatro entradas para leer la obra sin encerrarla.</h2>
      </div>
      <div className="series-grid">
        {curatorialGroups.map((group) => (
          <motion.article
            key={group.title}
            className="series-card depth-card"
            whileHover={{ y: -8, rotateX: 4, rotateY: -3 }}
            transition={{ duration: 0.25 }}
          >
            <span>{group.count}</span>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function VisualWalk({ onOpen }) {
  const sequence = artworks.filter((work) => work.recorrido);
  return (
    <section className="visual-walk section" id="recorrido">
      <div className="section-heading compact">
        <p className="eyebrow">Recorrido visual</p>
        <h2>Una secuencia lenta, casi cinematográfica.</h2>
      </div>
      <div className="walk-track">
        {[...sequence, ...sequence].map((work, index) => (
          <TiltButton key={`${work.id}-${index}`} className="walk-item" onClick={() => onOpen(work)} maxTilt={7}>
            <img src={work.imagen} alt={work.titulo} loading="lazy" />
            <span>{work.titulo}</span>
            <small>{work.precio}</small>
          </TiltButton>
        ))}
      </div>
    </section>
  );
}

function Archive({ onOpen }) {
  const grouped = artworks.reduce((acc, work) => {
    acc[work.anio] = acc[work.anio] || [];
    acc[work.anio].push(work);
    return acc;
  }, {});
  return (
    <section className="section" id="archivo">
      <div className="section-heading compact">
        <p className="eyebrow">Archivo</p>
        <h2>Registro documental de producción.</h2>
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
                  <span>{work.tecnica}</span>
                  <span>{work.serie}</span>
                  <span>{work.etiquetas.slice(0, 2).join(', ')}</span>
                  <span className="archive-price">{work.precio}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section muted" id="sobre">
      <div>
        <p className="eyebrow">Sobre el artista</p>
        <h2>Lukas Beckman, 21 años.</h2>
      </div>
      <p>
        Lukas Beckman construye una obra visual en la que la forma, la sensibilidad y la exploración material dialogan con una mirada joven, precisa y en expansión. Su trabajo se presenta como un archivo vivo: una búsqueda estética que combina intuición, disciplina y deseo de construir un lenguaje propio.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact section" id="contacto">
      <p className="eyebrow">Contacto</p>
      <h2>Para consultas, colaboraciones, exposiciones o adquisición de obra.</h2>
      <div className="contact-links">
        <a href="mailto:lukas2004bb@gmail.com"><Mail size={18} /> lukas2004bb@gmail.com</a>
        <a href="tel:+525540916667"><Phone size={18} /> (55) 4091 6667</a>
        <a href="https://www.instagram.com/rayitaz" target="_blank" rel="noreferrer"><AtSign size={18} /> @rayitaz</a>
      </div>
    </section>
  );
}

function ArtworkModal({ selected, setSelected }) {
  const selectedIndex = selected ? artworks.findIndex((work) => work.id === selected.id) : -1;
  const move = (direction) => {
    const next = (selectedIndex + direction + artworks.length) % artworks.length;
    setSelected(artworks[next]);
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
          aria-label={`Ficha de ${selected.titulo}`}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
          >
            <button className="close" onClick={() => setSelected(null)} aria-label="Cerrar"><X size={20} /></button>
            <div className="modal-art">
              <img src={selected.imagen} alt={selected.titulo} />
            </div>
            <aside className="modal-info">
              <p className="eyebrow">{selected.serie}</p>
              <h2>{selected.titulo}</h2>
              <dl>
                <div><dt>Año</dt><dd>{selected.fecha}</dd></div>
                <div><dt>Técnica</dt><dd>{selected.tecnica}</dd></div>
                <div><dt>Dimensiones</dt><dd>{selected.dimensiones}</dd></div>
                <div><dt>Precio</dt><dd>{selected.precio}</dd></div>
              </dl>
              <p>{selected.descripcion}</p>
              <div className="chips">
                {selected.etiquetas.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="modal-nav">
                <button onClick={() => move(-1)}><ArrowLeft size={18} /> Anterior</button>
                <button onClick={() => move(1)}>Siguiente <ArrowRight size={18} /></button>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [activeTag, setActiveTag] = useState('Todas');
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => {
    if (activeTag === 'Todas') return artworks;
    return artworks.filter((work) => work.etiquetas.includes(activeTag));
  }, [activeTag]);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <VisualWalk onOpen={setSelected} />
        <Series />
        <FeaturedWorks filtered={filtered} activeTag={activeTag} setActiveTag={setActiveTag} onOpen={setSelected} />
        <Archive onOpen={setSelected} />
        <About />
        <Contact />
      </main>
      <ArtworkModal selected={selected} setSelected={setSelected} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
