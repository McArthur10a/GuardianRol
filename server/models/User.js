const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'auditor', 'usuario'], 
    default: 'usuario' 
  },
  nombreCompleto: { type: String, required: true },
  horario: { 
    type: String, 
    enum: ['08-16', '16-24', '00-08'], 
    default: '08-16' 
  },
  puesto: { 
    type: String, 
    enum:,
    default: 'Registro'
  },
  diasLibres: { 
    type:, 
    default: 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);