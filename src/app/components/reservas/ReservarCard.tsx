"use client"
import { useState} from 'react';

interface Reserva {
  id: string;
  horario: string;
  mesasDisponibles: number;
}

export default function ReservasCard() {
  // Estado inicial con horarios predefinidos (ejemplo)
  const [reservasDisponibles, setReservasDisponibles] = useState<Reserva[]>([
    { id: '1', horario: '18:00 - 19:00', mesasDisponibles: 2 },
    { id: '2', horario: '19:00 - 20:00', mesasDisponibles: 1 },
    { id: '3', horario: '20:00 - 21:00', mesasDisponibles: 0 }, // Ejemplo de horario lleno
  ]);

  const handleReservar = (id: string) => {
    setReservasDisponibles(prev => 
      prev.map(reserva => 
        reserva.id === id ? { ...reserva, mesasDisponibles: reserva.mesasDisponibles - 1 } : reserva
      ).filter(r => r.mesasDisponibles > 0) // Elimina el horario si se agotan las mesas
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Horarios Disponibles - 22/5/2025
      </h2>
      
      {/* Contenedor de horarios con espaciado reducido */}
      <div className="space-y-4">
        {reservasDisponibles.map((reserva) => (
          <div 
            key={reserva.id}
            className="p-3 border rounded-md" // Padding reducido
          >
            <div className="flex justify-between items-center gap-2"> {/* Espaciado entre elementos */}
              <div className="flex-1">
                <h3 className="font-medium text-lg">{reserva.horario}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {reserva.mesasDisponibles} {reserva.mesasDisponibles === 1 ? 'mesa' : 'mesas'} disponible(s)
                </p>
              </div>
              
              <button onClick={() => handleReservar(reserva.id)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  reserva.mesasDisponibles > 0 
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {reserva.mesasDisponibles > 0 ? 'Reservar' : 'Agotado'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}