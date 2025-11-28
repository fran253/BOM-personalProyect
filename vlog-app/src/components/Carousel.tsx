import { useState, useEffect, useCallback } from 'react';
import './Carousel.css';

const Carousel = ({ entries }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const featuredEntries = entries.slice(0, 5);

  // Función para avanzar al siguiente slide (optimizada con useCallback)
  const nextSlide = useCallback(() => {
    if (isTransitioning || featuredEntries.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % featuredEntries.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, featuredEntries.length]);

  // Auto-play del carrusel - CAMBIA CADA 5 SEGUNDOS
  useEffect(() => {
    if (featuredEntries.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredEntries.length);
      }, 8000); //8 segundos de slide
      
      return () => clearInterval(interval);
    }
  }, [featuredEntries.length]); // Solo se recrea si cambia el número de entradas

  const prevSlide = () => {
    if (isTransitioning || featuredEntries.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => 
      prev === 0 ? featuredEntries.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  if (featuredEntries.length === 0) {
    return (
      <section className="carousel-hero">
        <div className="carousel-empty">
          <h2>Tu historia comienza aquí</h2>
          <p>Crea tu primera entrada y comparte tus momentos</p>
        </div>
      </section>
    );
  }

  const currentEntry = featuredEntries[currentSlide];

  return (
    <section className="carousel-hero">
      <div className="carousel-container">
        {/* Imagen de fondo con parallax */}
        <div className="carousel-background">
          {currentEntry.image && (
            <img 
              src={currentEntry.image} 
              alt={currentEntry.title}
              className="carousel-bg-image"
            />
          )}
          <div className="carousel-overlay"></div>
        </div>

        {/* Contenido */}
        <div className="carousel-content">
          <div className="carousel-text">
            <h1 className="carousel-title">{currentEntry.title}</h1>
            <p className="carousel-description">
              {currentEntry.description}
            </p>
            <div className="carousel-actions">
              <button className="btn-primary">Leer más</button>
            </div>
          </div>
        </div>

        {/* Controles de navegación */}
        <button 
          className="carousel-nav carousel-nav-prev" 
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          className="carousel-nav carousel-nav-next" 
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Indicadores */}
        <div className="carousel-indicators">
          {featuredEntries.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;