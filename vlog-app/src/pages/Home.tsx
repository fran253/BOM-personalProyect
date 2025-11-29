import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Categoria } from '../lib/supabase';
import { getEntries } from '../utils/storage';
import { initializeMockData } from '../utils/mockData';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar datos mock para el carousel
    initializeMockData();
    const mockEntries = getEntries();
    setEntries(mockEntries);

    // Cargar categorías desde Supabase
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('orden_visualizacion', { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
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
    <div className="home">
      {/* Carrusel Hero - CON DATOS MOCK */}
      <Carousel entries={entries} />

      {/* Sección de Categorías - DESDE SUPABASE */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">
            "Es muy fácil herir a los demás sin darse cuenta, sobre todo cuando eres joven."
          </h2>
          <p className="section-subtitle">Genma Saotome</p>
        </div>

        <div className="categories-grid">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/panels?categoria=${categoria.slug}`}
              className="category-card"
              style={{ '--accent-color': categoria.color } as React.CSSProperties}
            >
              <div className="category-image">
                <img src={categoria.imagen_url} alt={categoria.nombre} />
                <div className="category-image-overlay"></div>
              </div>
              <h3 className="category-name">{categoria.nombre}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;