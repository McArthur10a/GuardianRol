import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>🛡️ Panel de Control de Seguridad</h1>
      <p>Bienvenido de nuevo, <strong>{user?.username}</strong></p>
      <p>Nivel de acceso detectado: <span style={{ color: 'blue' }}>{user?.role?.toUpperCase()}</span></p>

      {/* LÓGICA DE ROLES: Solo se muestra si el rol es 'admin' */}
      {user?.role === 'admin' && (
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', border: '1px solid #ffeeba', borderRadius: '8px', marginTop: '20px' }}>
          <h3 style={{ color: '#856404' }}>⚠️ Modo Administrador Activado</h3>
          <p>Tienes permisos totales sobre el sistema.</p>
          <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#856404', color: 'white', border: 'none', borderRadius: '5px' }}>
            Gestionar Usuarios del Banco
          </button>
        </div>
      )}

      {/* Opción común para todos los usuarios */}
      <div style={{ marginTop: '30px' }}>
        <button style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>Mi Perfil</button>
        <button onClick={logout} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
          Cerrar Sesión Segura
        </button>
      </div>
    </div>
  );
};

export default Dashboard;