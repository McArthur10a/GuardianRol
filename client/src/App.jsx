import RosterTable from './RosterTable'; // Importa el archivo de la tabla

//... dentro de <Routes> añade esta línea:
<Route path="/gestion" element={user?.role === 'admin'? <RosterTable /> : <Navigate to="/dashboard" />} />