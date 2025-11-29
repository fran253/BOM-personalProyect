import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import logoImage from '../../public/images/Logo.png';
import KatanaCircle from './CirculoRojo';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const { user, profile, isAdmin, signOut } = useAuth();

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      const categoriesSection = document.querySelector('.categories-section');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link 
            to="/" 
            className="logo"
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
          >
            <img 
              src={logoImage} 
              alt="Logo" 
              className="logo-image"
            />
            <div className="logo-text-container">
              <h1 className={`logo-text ${isHoveringLogo ? 'hidden' : 'visible'}`}>
                BOM
              </h1>
              <h1 className={`logo-text-full ${isHoveringLogo ? 'visible' : 'hidden'}`}>
                Beauty <span className="logo-dot-inline">●</span>f Manga
              </h1>
            </div>
            <span className={`logo-dot ${isHoveringLogo ? 'hidden' : 'visible'}`}>●</span>
          </Link>
          
          <nav className="nav">
            <a 
              href="#inicio" 
              className="nav-link"
              onClick={scrollToTop}
            >
              Inicio
            </a>
            
            <Link 
              to="/panels"
              className="nav-link"
              onClick={handleCategoriesClick}
            >
              Paneles
            </Link>

            {user && (
              <Link to="/favoritos" className="nav-link">
                Favoritos
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}

            {user ? (
              <div className="user-menu">
                <span className="user-info">
                  {profile?.nombre_usuario}
                  {isAdmin && <span className="admin-badge">Admin</span>}
                </span>
                <button onClick={handleLogout} className="nav-link btn-logout">
                  Salir
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)} 
                className="nav-link btn-login"
              >
                Login
              </button>
            )}

            <KatanaCircle />
          </nav>
        </div>
      </header>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Header;