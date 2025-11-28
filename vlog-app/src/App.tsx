import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Panels from './pages/PanelesManga';
import Favoritos from './pages/Favoritos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/panels" element={<Panels />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;