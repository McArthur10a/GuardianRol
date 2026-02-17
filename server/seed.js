const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const puestosMañana =;
const puestosTardeNoche =;
const diasSemana =;

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({ role: 'usuario' });

    const passwordHashed = await bcrypt.hash('guardia123', 10);
    const guardias =;
    const nombres =;

    for (let i = 0; i < 21; i++) {
      let turno, puesto;
      // Distribución: 11 en mañana (A), 5 en tarde (B), 5 en noche (C)
      if (i < 11) {
        turno = '08-16';
        puesto = puestosMañana[i % puestosMañana.length];
      } else if (i < 16) {
        turno = '16-24';
        puesto = puestosTardeNoche[(i - 11) % 4];
      } else {
        turno = '00-08';
        puesto = puestosTardeNoche[(i - 16) % 4];
      }

      // Lógica de 2 días libres aleatorios entre semana
      const randomDays =.sort(() => 0.5 - Math.random()).slice(0, 2);

      guardias.push({
        username: `agente${i + 1}`,
        email: `guardia${i + 1}@banco.com`,
        password: passwordHashed,
        nombreCompleto: nombres[i],
        role: 'usuario',
        horario: turno,
        puesto: puesto,
        diasLibres: randomDays
      });
    }

    await User.insertMany(guardias);
    console.log("✅ 21 Guardias con horarios y días libres inyectados.");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedDB();