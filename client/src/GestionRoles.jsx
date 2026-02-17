import { useEffect, useState } from 'react';
import axios from 'axios';

const GestionRoles = () => {
  const [usuarios, setUsuarios] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:5000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsuarios(res.data);
    };
    fetchUsers();
  },);

  return (
    <div className="gestion-container">
      <h2>Gestión de Personal - Banco Central</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Horario</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u._id}>
              <td>{u.nombreCompleto}</td>
              <td>{u.puesto}</td>
              <td>{u.horario}</td>
              <td><button>Cambiar Turno</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};