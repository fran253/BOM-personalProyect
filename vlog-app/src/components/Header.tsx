import { Link } from 'react-router-dom';
import logoImage from '../../public/images/Logo.png';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="logo-image"
          />
          <h1>BOM</h1>
          <span className="logo-dot">●</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/create" className="nav-link nav-link-cta">
            <span>Nueva Entrada</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;