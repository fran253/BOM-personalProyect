import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { PanelManga, Categoria } from '../lib/supabase';
import Footer from '../components/Footer';
import Searchbar from '../components/Buscador';
import HeroSection from '../components/HeroSection';
import PanelModal from '../components/PanelModal';
import './PanelesManga.css';

const Panels = () => {
  const [searchParams] = useSearchParams();
  const categoriaSlug = searchParams.get('categoria');
  
  const { user, isAdmin } = useAuth();
  const [panels, setPanels] = useState<PanelManga[]>([]);
  const [categoriaActual, setCategoriaActual] = useState<Categoria | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPanel, setSelectedPanel] = useState<PanelManga | null>(null);
  const [likedPanels, setLikedPanels] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        if (categoriaSlug) {
          await cargarCategoriaActual();
        }
        
        await cargarPaneles();
        
        if (user) {
          await cargarLikes();
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [categoriaSlug, user]);

  const cargarCategoriaActual = async () => {
    if (!categoriaSlug) {
      setCategoriaActual(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('slug', categoriaSlug)
        .single();

      if (error) throw error;
      setCategoriaActual(data);
    } catch (error) {
      console.error('Error cargando categoría:', error);
      setCategoriaActual(null);
    }
  };

  const cargarPaneles = async () => {
    try {
      let query = supabase
        .from('paneles_manga')
        .select('*')
        .eq('estado', 'aprobado')
        .order('creado_en', { ascending: false });

      if (categoriaSlug) {
        const { data: categoria } = await supabase
          .from('categorias')
          .select('id')
          .eq('slug', categoriaSlug)
          .single();

        if (categoria) {
          query = query.eq('categoria_id', categoria.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setPanels(data || []);
    } catch (error) {
      console.error('Error cargando paneles:', error);
      setPanels([]);
    }
  };

  const cargarLikes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('panel_id')
        .eq('usuario_id', user.id);

      if (error) throw error;
      
      const likedIds = new Set(data?.map(f => f.panel_id) || []);
      setLikedPanels(likedIds);
    } catch (error) {
      console.error('Error cargando likes:', error);
    }
  };

  const toggleLike = async (panelId: string) => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const isLiked = likedPanels.has(panelId);

      if (isLiked) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_id', user.id)
          .eq('panel_id', panelId);

        if (error) throw error;

        setLikedPanels(prev => {
          const newSet = new Set(prev);
          newSet.delete(panelId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({
            usuario_id: user.id,
            panel_id: panelId
          });

        if (error) throw error;

        setLikedPanels(prev => new Set([...prev, panelId]));
      }

      cargarPaneles();
    } catch (error) {
      console.error('Error al dar like:', error);
      alert('Error al dar like');
    }
  };

  const handleAddPanel = () => {
    // TODO: Abrir modal de subida (lo haremos mañana)
    console.log('Abrir modal de subida de panel');
  };

  const filteredPanels = panels.filter(panel =>
    panel.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="panels-page">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

    return (
    <div className="panels-page">
      <HeroSection
        imagen={categoriaActual?.imagen_hero || "/images/hero/panels-hero.png"}
        titulo={categoriaActual?.frase || '"Deberías disfrutar al máximo de los pequeños desvíos. Porque ahí es donde encontrarás cosas más importantes que lo que quieres"'}
        subtitulo={categoriaActual?.autor_frase || 'Ging Freecss'}
        altText={categoriaActual ? `Hero de ${categoriaActual.nombre}` : "Manga illustration"}
      />

      {/* Buscador */}
      <section className="search-section">
        <div className="search-wrapper">
          <Searchbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Buscar paneles..."
          />
        </div>
      </section>

      {/* Botón flotante fijo - Solo admins */}
      {isAdmin && (
        <button 
          className="btn-add-panel-fixed"
          onClick={handleAddPanel}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Añadir Panel</span>
        </button>
      )}

      {/* Masonry Grid */}
      <section className="panels-gallery">
        {filteredPanels.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron paneles</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPanels.map((panel) => (
              <div 
                key={panel.id} 
                className="masonry-item"
                onClick={() => setSelectedPanel(panel)}
              >
                <div className="panel-card">
                  <img 
                    src={panel.imagen_url} 
                    alt={panel.titulo}
                    className="panel-image"
                  />
                  <div className="panel-overlay">
                    <div className="panel-info">
                      <h3 className="panel-title">{panel.titulo}</h3>
                      <div className="panel-stats">
                        <span className="panel-likes">
                          ❤️ {panel.cantidad_likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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