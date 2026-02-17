const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Definimos los puestos exactos según tu requerimiento
const puestosMañana =;
const puestosTardeNoche =;

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // Limpiamos solo los guardias anteriores, no al administrador
    await User.deleteMany({ role: 'usuario' }); 

    const passwordHashed = await bcrypt.hash('guardia123', 10);
    let guardias =; // ✅ Inicializado correctamente

    // Generamos los 21 guardias ficticios
    for (let i = 1; i <= 21; i++) {
      let turno, puesto;
      
      if (i <= 7) { 
        // Turno Mañana (7 guardias)
        turno = '08-16'; 
        puesto = puestosMañana[i-1];
      } else if (i <= 14) { 
        // Turno Tarde (7 guardias, rotando en 4 puestos)
        turno = '16-24'; 
        puesto = puestosTardeNoche[(i-8) % 4];
      } else { 
        // Turno Noche (7 guardias, rotando en 4 puestos)
        turno = '00-08'; 
        puesto = puestosTardeNoche[(i-15) % 4];
      }

      guardias.push({
        username: `guardia${i}`,
        email: `guardia${i}@banco.com`,
        password: passwordHashed,
        nombreCompleto: `Agente Ficticio ${i}`,
        role: 'usuario',
        horario: turno,
        puesto: puesto,
        diasLibres: // ✅ Valor inicial asignado
      });
    }

    await User.insertMany(guardias);
    console.log("✅ ¡21 Guardias inyectados con éxito en la base de datos!");
    process.exit();
  } catch (error) {
    console.error("❌ Error al sembrar datos:", error);
    process.exit(1);
  }
};

seedDB();