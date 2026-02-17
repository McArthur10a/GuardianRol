const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTACIÓN DE RUTAS
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // <-- AQUÍ PEGA LA IMPORTACIÓN

const app = express();

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. USO DE LAS RUTAS (Van después de los middlewares)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // <-- AQUÍ PEGA LA ACTIVACIÓN

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conexión exitosa a la base de datos de GuardianRol'))
.catch(err => console.error('Error de conexión a la base de datos:', err));

// Rutas base
app.get('/', (req, res) => res.send('El sistema GuardianRol está activo.'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor de seguridad en puerto ${PORT}`));
