import { useState } from 'react';
import Footer from '../components/Footer';
import Searchbar from '../components/Buscador';
import PanelModal from '../components/PanelModal';
import './PanelesManga.css';

const Panels = () => {
  // Datos hardcodeados de paneles con diferentes aspectos
  const [panels] = useState([
    {
      id: 1,
      image: '/images/Carousel/Car6.jpg',
      title: 'Berserk - Eclipse',
      manga: 'Berserk',
      aspect: 'vertical',
      likes: 1247
    },
    {
      id: 2,
      image: '/images/Carousel/Car3.jpg',
      title: 'Vinland Saga - Batalla',
      manga: 'Vinland Saga',
      aspect: 'horizontal',
      likes: 856
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
      id: 4,
      image: '/images/Carousel/Car6.jpg',
      title: 'One Piece - Luffy',
      manga: 'One Piece',
      aspect: 'square',
      likes: 3421
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
      id: 6,
      image: '/images/Carousel/Car4.jpeg',
      title: 'Chainsaw Man',
      manga: 'Chainsaw Man',
      aspect: 'horizontal',
      likes: 967
    },
    {
      id: 7,
      image: '/images/Carousel/Car1.jpeg',
      title: 'Slam Dunk',
      manga: 'Slam Dunk',
      aspect: 'square',
      likes: 742
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
      id: 9,
      image: '/images/categories/Amor.jpg',
      title: 'Naruto - Valle del Fin',
      manga: 'Naruto',
      aspect: 'horizontal',
      likes: 2876
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
      id: 11,
      image: '/images/categories/Miedo.jpg',
      title: 'Hunter x Hunter',
      manga: 'Hunter x Hunter',
      aspect: 'square',
      likes: 1198
    },
    {
      id: 12,
      image: '/images/categories/Paz.png',
      title: 'Bleach',
      manga: 'Bleach',
      aspect: 'horizontal',
      likes: 923
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [likedPanels, setLikedPanels] = useState(new Set());

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
    <div className="panels-page">
      {/* Hero Section */}
      <section className="panels-hero">
        <div className="panels-hero-content">
          <h1 className="panels-hero-title">Galería de Paneles</h1>
          <p className="panels-hero-subtitle">
            Explora los momentos más icónicos del manga
          </p>
          
          {/* Buscador - Componente reutilizable */}
          <Searchbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Buscar por título o manga..."
          />
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="panels-gallery">
        <div className="masonry-grid">
          {filteredPanels.map((panel) => (
            <div 
              key={panel.id} 
              className={`masonry-item masonry-item-${panel.aspect}`}
              onClick={() => setSelectedPanel(panel)}
            >
              <div className="panel-card">
                <img 
                  src={panel.image} 
                  alt={panel.title}
                  className="panel-image"
                />
                <div className="panel-overlay">
                  <div className="panel-info">
                    <h3 className="panel-title">{panel.title}</h3>
                    <p className="panel-manga">{panel.manga}</p>
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

export default Panels;