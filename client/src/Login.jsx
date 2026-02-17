import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos las credenciales al backend que ya tenemos encendido
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token); // El cerebro guarda el token y el rol
      navigate('/dashboard'); // Saltamos al panel
    } catch (err) {
      alert("Error de acceso: Verifica tus credenciales.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2 style={{ color: '#333' }}>Sistema GuardianRol</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '15px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <input type="email" placeholder="Email Corporativo" onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px' }} />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px' }} />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;