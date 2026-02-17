const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const puestosTodos = ['Entrada', 'Control', 'Patrulla'];
const puestosCriticos = ['Bóveda', 'Vigilancia', 'Acceso'];
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({ role: 'usuario' }); 

    const passwordHashed = await bcrypt.hash('guardia123', 10);
    let guardias = [];

    for (let i = 1; i <= 21; i++) {
      let turno, puesto;
      if (i <= 13) {
        turno = '08-16';
        puesto = puestosTodos;
      } else if (i <= 17) {
        turno = '16-24';
        puesto = puestosCriticos[i % 4];
      } else {
        turno = '00-08';
        puesto = puestosCriticos[i % 4];
      }

      const randomDays = diasSemana.sort(() => 0.5 - Math.random()).slice(0, 2);

      guardias.push({
        username: `guardia${i}`,
        email: `guardia${i}@banco.com`,
        password: passwordHashed,
        nombreCompleto: `Agente Ficticio ${i}`,
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