import { useEffect, useState } from 'react';
import axios from 'axios';

const RosterTable = () => {
  // ✅ CORRECCIÓN: Inicializamos con para evitar errores de carga
  const [guardias, setGuardias] = useState([]);
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const cargarGuardias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGuardias(res.data);
      } catch (error) {
        console.error("Error al cargar el cuadrante:", error);
      }
    };
    cargarGuardias();
  },); // ✅ CORRECCIÓN: Añadidos corchetes para evitar bucles infinitos

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      <h2 style={{ textAlign: 'center' }}>📅 Gestión de Roles: 21 Guardias (Banco Central)</h2>
      <div style={{ overflowX: 'auto' }}>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: 'white' }}>
          <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <tr>
              <th>Nombre (Puesto)</th>
              <th>Turno</th>
              {dias.map(dia => <th key={dia}>{dia}</th>)}
            </tr>
          </thead>
          <tbody>
            {guardias.map(g => (
              <tr key={g._id}>
                <td style={{ fontWeight: 'bold', padding: '10px' }}>
                  {g.nombreCompleto} <br/> <small style={{ color: '#666' }}>({g.puesto})</small>
                </td>
                <td>{g.horario}</td>
                {dias.map(dia => (
                  <td key={dia} style={{ 
                    backgroundColor: g.diasLibres?.includes(dia)? '#ffb3b3' : '#b3ffb3',
                    fontSize: '11px', fontWeight: 'bold' 
                  }}>
                    {g.diasLibres?.includes(dia)? 'LIBRE' : 'TURNO'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RosterTable;