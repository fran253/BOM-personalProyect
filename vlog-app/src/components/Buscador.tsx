import './Buscador.css';

interface SearchbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

const Searchbar = ({ searchTerm, setSearchTerm, placeholder = "Buscar..." }: SearchbarProps) => {
  return (
    <div className="search-container">
      <svg 
        className="search-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default Searchbar;