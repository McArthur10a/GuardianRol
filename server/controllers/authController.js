const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registro de nuevos usuarios
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role // Aquí asignamos 'admin', 'auditor' o 'usuario'
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login y generación de Token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar el Token con el ID y el ROL
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
