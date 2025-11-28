import { useState } from 'react';
import './PanelModal.css';

interface Panel {
  id: number;
  image: string;
  title: string;
  manga: string;
  likes: number;
}

interface PanelModalProps {
  panel: Panel;
  onClose: () => void;
  likedPanels: Set<number>;
  onToggleLike: (id: number) => void;
}

const PanelModal = ({ panel, onClose, likedPanels, onToggleLike }: PanelModalProps) => {
  const getLikes = () => {
    return likedPanels.has(panel.id) ? panel.likes + 1 : panel.likes;
  };

  return (
    <div className="panel-modal" onClick={onClose}>
      <div className="panel-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-layout">
          <div className="modal-image-container">
            <img 
              src={panel.image} 
              alt={panel.title}
              className="modal-image"
            />
          </div>

          <div className="modal-info-container">
            <div className="modal-text">
              <h2 className="modal-title">{panel.title}</h2>
              <p className="modal-manga">{panel.manga}</p>
            </div>

            <button 
              className={`like-button ${likedPanels.has(panel.id) ? 'liked' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(panel.id);
              }}
            >
              <div className="like-circle"></div>
              <span className="like-count">{getLikes().toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelModal;