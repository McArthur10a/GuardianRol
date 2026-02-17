const jwt = require('jsonwebtoken');

// Verifica si el token es válido
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Acceso denegado. No hay token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos el rol y el ID aquí
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};

// El "Guardián" de roles: bloquea si no tienes el rol permitido
exports.authorize = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta zona.' });
    }
    next();
  };
};