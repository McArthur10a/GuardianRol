const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 
require('dotenv').config();

const app = express();

// 1. Middlewares - CONFIGURACIÓN DE CORS ABIERTA
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. Conexión a la DB
mongoose.connect('mongodb://localhost:27017/rosterDB', {
  serverSelectionTimeoutMS: 5000 
})
  .then(() => console.log("🚀 Servidor conectado a MongoDB (vía localhost)"))
  .catch(err => console.error("❌ Error de conexión a MongoDB:", err));

// 3. RUTA PARA OBTENER USUARIOS
app.get('/api/users', async (req, res) => {
  try {
    console.log("🔍 Buscando directamente en la colección 'users'...");
    
    if (mongoose.connection.readyState !== 1) {
       return res.status(503).json({ error: "La base de datos no está lista todavía" });
    }

    const usuarios = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log("✅ Usuarios detectados físicamente:", usuarios.length);
    res.json(usuarios);
  } catch (error) {
    console.error("❌ ERROR EN EL SERVIDOR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. Encendido del puerto
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`|-----------------------------------------|`);
  console.log(`|   🔥 SERVIDOR CORRIENDO EN PUERTO ${PORT}   |`);
  console.log(`|-----------------------------------------|`);
});