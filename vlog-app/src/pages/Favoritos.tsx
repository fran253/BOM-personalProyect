import { useState } from 'react';
import Footer from '../components/Layout/Footer';
import Searchbar from '../components/ListadoPaneles/Buscador';
import PanelModal from '../components/ListadoPaneles/PanelModal';
import './Favoritos.css';

const Favoritos = () => {
  // Datos hardcodeados - en producción vendrían ordenados por likes del backend
  const [panels] = useState([
    {
      id: 4,
      image: '/images/Carousel/Car6.jpg',
      title: 'One Piece - Luffy',
      manga: 'One Piece',
      aspect: 'square',
      likes: 3421
    },
    {
      id: 9,
      image: '/images/categories/Amor.jpg',
      title: 'Naruto - Valle del Fin',
      manga: 'Naruto',
      aspect: 'horizontal',
      likes: 2876
    },
    {
      id: 3,
      image: '/images/Carousel/Vagabond.png',
      title: 'Vagabond - Meditación',
      manga: 'Vagabond',
      aspect: 'vertical',
      likes: 2103
    },
    {
      id: 5,
      image: '/images/Carousel/Car5.png',
      title: 'Attack on Titan',
      manga: 'Attack on Titan',
      aspect: 'vertical',
      likes: 1892
    },
    {
      id: 10,
      image: '/images/categories/Consuelo.PNG',
      title: 'Death Note',
      manga: 'Death Note',
      aspect: 'vertical',
      likes: 1654
    },
    {
      id: 8,
      image: '/images/categories/Amistad.png',
      title: 'Tokyo Ghoul',
      manga: 'Tokyo Ghoul',
      aspect: 'vertical',
      likes: 1534
    },
    {
      id: 1,
      image: '/images/Carousel/Car6.jpg',
      title: 'Berserk - Eclipse',
      manga: 'Berserk',
      aspect: 'vertical',
      likes: 1247
    },
    {
      id: 11,
      image: '/images/categories/Miedo.jpg',
      title: 'Hunter x Hunter',
      manga: 'Hunter x Hunter',
      aspect: 'square',
      likes: 1198
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [likedPanels, setLikedPanels] = useState(new Set());

  // Panel destacado (el #1)
  const featuredPanel = panels[0];

  const filteredPanels = panels.filter(panel =>
    panel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.manga.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLike = (panelId) => {
    setLikedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

  return (
    <div className="favoritos-page">
      {/* Hero Section - Imagen izquierda, texto derecha */}
      <section className="favoritos-hero">
        <div className="favoritos-hero-container">
          {/* Izquierda - Imagen destacada */}
          <div className="hero-left-image">
            <img 
              src="/images/FavoritosHisoka.png"
              alt="Panel destacado"
              className="featured-panel-image"
            />
          </div>

          {/* Derecha - Textos */}
          <div className="hero-right-text">
            <h1 className="hero-quote">
              "Deberías disfrutar al máximo de los pequeños desvíos. Porque ahí es donde encontrarás cosas más importantes que lo que quieres"
            </h1>
            <p className="hero-author">Ging Freecss</p>
          </div>
        </div>
        {/* Línea roja separadora */}
        <div className="hero-separator"></div>
      </section>

      {/* Buscador - Sección separada */}
      <section className="search-section">
        <div className="search-wrapper">
          <Searchbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Buscar paneles favoritos..."
          />
        </div>
      </section>

      {/* Masonry Grid de Favoritos */}
      <section className="favoritos-gallery">
        <div className="masonry-grid">
          {filteredPanels.map((panel, index) => (
            <div 
              key={panel.id} 
              className={`masonry-item masonry-item-${panel.aspect}`}
              onClick={() => setSelectedPanel(panel)}
            >
              <div className="favorito-card">
                <img 
                  src={panel.image} 
                  alt={panel.title}
                  className="favorito-image"
                />
                <div className="favorito-overlay">
                  <div className="favorito-info">
                    <h3 className="favorito-title">{panel.title}</h3>
                    <p className="favorito-manga">{panel.manga}</p>
                    <div className="favorito-likes">
                      <div className="like-icon-small"></div>
                      <span>{panel.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal - Componente reutilizable */}
      {selectedPanel && (
        <PanelModal
          panel={selectedPanel}
          onClose={() => setSelectedPanel(null)}
          likedPanels={likedPanels}
          onToggleLike={toggleLike}
        />
      )}

      <Footer />
    </div>
  );
};

export default Favoritos;