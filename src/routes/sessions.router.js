// 📜 src/routes/sessions.router.js

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 🧪 Ruta de prueba (ping)
router.get('/ping', (req, res) => {
  res.send('pong');
});

// 🔐 Ruta de login con log de prueba
router.post('/login',
  (req, res, next) => {
    console.log("📥 Ruta /login recibida"); // Confirmación visual en consola
    next();
  },
  passport.authenticate('login', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Guardamos el token en una cookie segura y solo accesible por HTTP
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.json({ message: '✅ Login exitoso', token });
  }
);

// 🔒 Ruta protegida que devuelve los datos del usuario si está autenticado
router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
    });
  }
);

module.exports = router;
