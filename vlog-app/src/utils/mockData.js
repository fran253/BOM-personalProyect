export const mockEntries = [
  {
    id: "1",
    title: "Aventura en las Montañas",
    description: "Un viaje increíble por los Alpes suizos descubriendo paisajes de ensueño y cultura local",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Gastronomía Italiana",
    description: "Explorando los sabores auténticos de Italia, desde la pasta casera hasta el mejor gelato",
    image: "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?w=1200&h=800&fit=crop",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Tecnología del Futuro",
    description: "Las últimas innovaciones en inteligencia artificial que están cambiando el mundo",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Arte Urbano",
    description: "Descubriendo murales y expresiones artísticas en las calles de grandes ciudades",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=800&fit=crop",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Vida Saludable",
    description: "Rutinas de ejercicio y nutrición para mantener un estilo de vida equilibrado",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop",
    createdAt: new Date().toISOString()
  }
];

export const initializeMockData = () => {
  const existing = localStorage.getItem('vlog_entries');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('vlog_entries', JSON.stringify(mockEntries));
  }
};