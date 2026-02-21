const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User');

// 1. CONEXIÓN (Sin esto, el código no sabe dónde guardar los datos)
mongoose.connect('mongodb://127.0.0.1:27017/rosterDB')
  .then(() => console.log("🌱 Conectado a MongoDB..."))
  .catch(err => console.error("❌ Error de conexión:", err));

const seedDB = async () => {
  try {
    await User.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const hashedSnapshot = await bcrypt.hash('password123', salt);

    // 2. LA LISTA (Aquí es donde cerramos el "cable pelado")
    const puestosMañana = ['Sótano', 'Caja', 'Pasillo', 'Reposición', 'Admin'];
    
    const usuarios = puestosMañana.map((puesto) => ({
      username: `empleado_${puesto.toLowerCase()}`,
      password: hashedSnapshot, 
      role: puesto
    }));

    await User.insertMany(usuarios);
    console.log("✅ Base de datos sembrada con contraseñas encriptadas");
    
    // Cerramos la conexión al terminar para que la terminal no se quede trabada
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al sembrar:", error);
    mongoose.connection.close();
  }
};

// 3. ¡EL DISPARADOR! (Esta línea hace que todo lo de arriba se ejecute)
seedDB();