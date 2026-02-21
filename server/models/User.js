const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

// El tercer parámetro 'users' es la CLAVE. 
// Le dice a Mongoose: "No inventes nombres, usa la colección 'users'".
module.exports = mongoose.model('User', userSchema, 'users');