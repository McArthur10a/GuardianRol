import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const { user, loading } = useContext(AuthContext);

  // Esperamos a que el sistema de seguridad verifique el token
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando protocolos de seguridad...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Si NO hay usuario, mostramos Login. Si YA está logueado, lo mandamos al Dashboard */}
        <Route path="/login" element={!user? <Login /> : <Navigate to="/dashboard" />} />
        
        {/* Si HAY usuario, mostramos Dashboard. Si NO, lo obligamos a loguearse */}
        <Route path="/dashboard" element={user? <Dashboard /> : <Navigate to="/login" />} />
        
        {/* Ruta por defecto: redirige al dashboard si hay sesión, sino al login */}
        <Route path="*" element={<Navigate to={user? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;