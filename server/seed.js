const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const puestosMañana =;
const puestosTardeNoche =;

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({ role: 'usuario' }); // Limpiamos usuarios anteriores

    const passwordHashed = await bcrypt.hash('guardia123', 10);
    let guardias =;

    // Generamos 21 guardias ficticios
    for (let i = 1; i <= 21; i++) {
      let turno, puesto;
      
      if (i <= 7) { 
        turno = '08-16'; 
        puesto = puestosMañana[i-1];
      } else if (i <= 14) { 
        turno = '16-24'; 
        puesto = puestosTardeNoche[(i-8) % 4]; // Solo 4 puestos asignados
      } else { 
        turno = '00-08'; 
        puesto = puestosTardeNoche[(i-15) % 4]; // Solo 4 puestos asignados
      }

      guardias.push({
        username: `guardia${i}`,
        email: `guardia${i}@banco.com`,
        password: passwordHashed,
        nombreCompleto: `Agente Ficticio ${i}`,
        role: 'usuario',
        horario: turno,
        puesto: puesto,
        diasLibres: // Ejemplo inicial
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