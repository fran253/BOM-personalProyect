export const mockEntries = [
  {
    id: "1",
    title: '"Solo en la oscuridad puedes sentir la verdadera luz."',
    description: "Berserk",
    image: "/images/Carousel/Car1.jpeg",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: '"La promesa de una recompensa hace que suba la motivación."',
    description: "Himeno",
    image: "/images/Carousel/Car6.jpg",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: '"La verdadera victoria no es matar a todos tus enemigos, es alcanzar la paz con ellos."',
    description: "Thorfinn Karlsefni",
    image: "/images/Carousel/Car3.jpg",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: '"Los árboles y las piedras conocen tu esencia. Vive como quieras."',
    description: "Padre de Iori",
    image: "/images/Carousel/Car4.jpeg",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: '"¿Qué sentido tiene ganar fama con la espada?"',
    description: "Shosaku",
    image: "/images/Carousel/Car5.png",
    createdAt: new Date().toISOString()
  }
];

export const initializeMockData = () => {
  // FORZAR siempre para desarrollo
  localStorage.setItem('vlog_entries', JSON.stringify(mockEntries));
};