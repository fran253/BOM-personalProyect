import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntries, deleteEntry } from '../utils/storage';
import { initializeMockData } from '../utils/mockData';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    initializeMockData();
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = getEntries();
    setEntries(allEntries);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta entrada?')) {
      deleteEntry(id);
      loadEntries();
    }
  };

  // Categorías genéricas
  const categories = [
    { name: 'Amistad', image: '../public/images/categories/Amistad.png', color: '#3498db' },
    { name: 'Amor', image: '../public/images/categories/Amor.jpg', color: '#e74c3c' },
    { name: 'Miedo', image: '../public/images/categories/Miedo.jpg', color: '#9b59b6' },
    { name: 'Paz', image: '../public/images/categories/Paz.png', color: '#f39c12' },
    { name: 'Consuelo', image: '../public/images/categories/Consuelo.PNG', color: '#2ecc71' },
    { name: 'Enfado', image: '../public/images/categories/Enfado.png', color: '#e67e22' },
  ];

  return (
    <div className="home">
      {/* Carrusel Hero */}
      <Carousel entries={entries} />

      {/* Sección de Categorías */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">"Es muy fácil herir a los demás sin darse cuenta, sobre todo cuando eres joven."</h2>
          <p className="section-subtitle">Genma Saotome</p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              style={{ '--accent-color': category.color }}
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-image-overlay"></div>
              </div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;