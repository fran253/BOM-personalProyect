import { Link } from 'react-router-dom';
import './CirculoRojo.css';

const KatanaCircle = () => {
  return (
    <Link to="/favoritos" className="katana-circle-link">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        className="katana-circle-svg"
      >
        <defs>
          {/* Clip path para mitad superior diagonal - con superposición */}
          <clipPath id="topHalfDiagonal">
            <polygon points="-1,-1 21,-1 21,21 -1,-1" />
          </clipPath>
          
          {/* Clip path para mitad inferior diagonal - con superposición */}
          <clipPath id="bottomHalfDiagonal">
            <polygon points="-1,-1 -1,21 21,21 -1,-1" />
          </clipPath>
        </defs>
        
        {/* Mitad superior del círculo */}
        <circle 
          cx="10" 
          cy="10" 
          r="8" 
          fill="#e74c3c" 
          clipPath="url(#topHalfDiagonal)"
          className="circle-half circle-top"
        />
        
        {/* Mitad inferior del círculo */}
        <circle 
          cx="10" 
          cy="10" 
          r="8" 
          fill="#e74c3c" 
          clipPath="url(#bottomHalfDiagonal)"
          className="circle-half circle-bottom"
        />
      </svg>
    </Link>
  );
};

export default KatanaCircle;