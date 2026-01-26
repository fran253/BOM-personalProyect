import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { PanelManga, Categoria } from '../lib/supabase';
import Footer from '../components/Layout/Footer';
import Searchbar from '../components/ListadoPaneles/Buscador';
import HeroSection from '../components/ListadoPaneles/HeroSection';
import PanelModal from '../components/ListadoPaneles/PanelModal';
import './PanelesManga.css';

const Panels = () => {
  const [searchParams] = useSearchParams();
  const categoriaSlug = searchParams.get('categoria');
  
  const { user } = useAuth();
  const [panels, setPanels] = useState<PanelManga[]>([]);
  const [categoriaActual, setCategoriaActual] = useState<Categoria | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPanel, setSelectedPanel] = useState<any>(null);
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

  const toggleLike = async (panelId: string | number) => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    const id = typeof panelId === 'number' ? panelId.toString() : panelId;

    try {
      const isLiked = likedPanels.has(id);

      if (isLiked) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_id', user.id)
          .eq('panel_id', id);

        if (error) throw error;

        setLikedPanels(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({
            usuario_id: user.id,
            panel_id: id
          });

        if (error) throw error;

        setLikedPanels(prev => new Set([...prev, id]));
      }

      cargarPaneles();
    } catch (error) {
      console.error('Error al dar like:', error);
      alert('Error al dar like');
    }
  };

  const filteredPanels = panels.filter(panel =>
    panel.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convertir panel de Supabase a formato del modal
  const convertToModalPanel = (panel: PanelManga) => ({
    id: parseInt(panel.id) || 0,
    image: panel.imagen_url,
    title: panel.titulo,
    manga: panel.descripcion || 'Manga',
    likes: panel.cantidad_likes
  });

  if (loading) {
    return (
      <div className="panels-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando paneles...</p>
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

      {/* Masonry Grid */}
      <section className="panels-gallery">
        {filteredPanels.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No se encontraron paneles</h3>
            <p>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Aún no hay paneles en esta categoría'}
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPanels.map((panel) => (
              <div 
                key={panel.id} 
                className="masonry-item"
                onClick={() => setSelectedPanel(convertToModalPanel(panel))}
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
                      {panel.descripcion && (
                        <p className="panel-manga">{panel.descripcion}</p>
                      )}
                      <div className="panel-likes">
                        <div className="like-icon-small"></div>
                        <span>{panel.cantidad_likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedPanel && (
        <PanelModal
          panel={selectedPanel}
          onClose={() => setSelectedPanel(null)}
          likedPanels={new Set(Array.from(likedPanels).map(id => parseInt(id)))}
          onToggleLike={(id) => toggleLike(id.toString())}
        />
      )}

      <Footer />
    </div>
  );
};

export default Panels;