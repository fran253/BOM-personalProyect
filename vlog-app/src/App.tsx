import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Panels from './pages/PanelesManga';
import Favoritos from './pages/Favoritos';
import FloatingUploadButton from './components/SubirImagen/FloatingUploadButton';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/panels" element={<Panels />} />
            <Route path="/favoritos" element={<Favoritos />} />
          </Routes>
          
          {/* Botón flotante - Solo visible para admins */}
          <FloatingUploadButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;