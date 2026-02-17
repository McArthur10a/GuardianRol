// En server/routes/adminRoutes.js
router.get('/usuarios', authenticate, authorize(['admin']), async (req, res) => {
  const User = require('../models/User');
  const users = await User.find({ role: 'usuario' });
  res.json(users);
});