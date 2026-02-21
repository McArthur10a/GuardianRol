import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RosterTable from './RosterTable'; 

function App() {
  // Simulamos un usuario admin para entrar directo
  const user = { role: 'admin' }; 

  return (
    <Router>
      <Routes>
        <Route 
          path="/gestion" 
          element={user?.role === 'admin' ? <RosterTable /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/gestion" />} />
      </Routes>
    </Router>
  );
}

export default App;