import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UploadPanelModal from './UploadPanelModal';
import './FloatingUploadButton.css';

const FloatingUploadButton = () => {
  const { isAdmin, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // No mostrar mientras carga o si no es admin
  if (loading || !isAdmin) return null;

  return (
    <>
      <button 
        className="floating-upload-btn"
        onClick={() => setIsModalOpen(true)}
        aria-label="Añadir panel"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 5v14M5 12h14" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </svg>
        <span className="floating-upload-text">Añadir Panel</span>
      </button>

      <UploadPanelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Aquí puedes añadir lógica para recargar la galería
          console.log('Panel subido correctamente!');
        }}
      />
    </>
  );
};

export default FloatingUploadButton;