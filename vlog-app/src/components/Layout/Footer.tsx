import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo y descripción */}
          <div className="footer-brand">
            <h3 className="footer-logo">
              BOM<span className="footer-dot">●</span>
            </h3>
            <p className="footer-description">
              Beauty of MANGA
            </p>
          </div>

          {/* Enlaces */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Explora</h4>
              <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/categories">Categorías</a></li>
                <li><a href="/about">Sobre nosotros</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Comunidad</h4>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/creators">Creadores</a></li>
                <li><a href="/events">Eventos</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacidad</a></li>
                <li><a href="/terms">Términos</a></li>
                <li><a href="/contact">Contacto</a></li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="footer-social">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#" aria-label="Instagram" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="6" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} VLOG. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;