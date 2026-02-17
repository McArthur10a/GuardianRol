const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Solo el rol 'admin' puede pasar de aquí
router.get('/panel-secreto', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: '¡Bienvenido Admin! Has logrado entrar a la zona protegida.' });
});

module.exports = router;