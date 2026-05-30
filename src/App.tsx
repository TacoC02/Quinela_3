import { useState, useEffect } from 'react';
import './App.css'; // Mantenemos tus estilos base si los tienes

// La interfaz de los datos (usando TypeScript)
interface Partido {
  id: string | number;
  equipoLocal: string;
  equipoVisitante: string;
  estatus: string;
}

export default function App() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const obtenerPartidos = async () => {
      try {
        // Hacemos la petición a tu API local
        const respuesta = await fetch('http://localhost:4000/matches/bracket');
        
        if (!respuesta.ok) {
          throw new Error('Error al conectar: Revisa si el backend está encendido y tiene CORS configurado.');
        }
        
        const datos = await respuesta.json();
        setPartidos(datos);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerPartidos();
  }, []);

  if (cargando) return <h2>Cargando la quiniela...</h2>;
  
  if (error) return (
    <div style={{ color: 'red', padding: '20px' }}>
      <h1>🏆 Quiniela del Mundial 🏆</h1>
      <h2>TEAM-ROCKET</h2>
      <button>Añadir usario</button>
    </div>
  );

  return (
    <div className="contenedor-principal">
    
      <ul>
        {partidos.map((partido, index) => (
          <li key={partido.id || index}>
            {partido.equipoLocal} vs {partido.equipoVisitante} 
          </li>
        ))}
      </ul>
    </div>
  );
}