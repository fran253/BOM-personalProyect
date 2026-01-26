import './HeroSection.css';

interface HeroSectionProps {
  imagen: string;
  titulo: string;
  subtitulo: string;
  altText?: string;
}

const HeroSection = ({ imagen, titulo, subtitulo, altText = "Hero image" }: HeroSectionProps) => {
  return (
    <section className="hero-section">
      <div className="hero-section-container">
        {/* Izquierda - Imagen */}
        <div className="hero-left-image">
          <img 
            src={imagen}
            alt={altText}
            className="hero-image"
          />
        </div>

        {/* Derecha - Textos */}
        <div className="hero-right-text">
          <h1 className="hero-quote">{titulo}</h1>
          <p className="hero-author">{subtitulo}</p>
        </div>
      </div>
      {/* Línea roja separadora */}
      <div className="hero-separator"></div>
    </section>
  );
};

export default HeroSection;