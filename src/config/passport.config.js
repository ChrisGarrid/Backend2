// 📜 passport.config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

// Estrategia Local (Email & Password)
passport.use('login', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      console.log("📩 Intento de login con email:", email);
      const user = await User.findOne({ email });

      if (!user) {
        console.log("❌ Usuario no encontrado");
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const isMatch = user.comparePassword(password);
      console.log("🔑 Contraseña válida:", isMatch);

      if (!isMatch) {
        console.log("❌ Contraseña incorrecta");
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      console.log("✅ Login exitoso");
      return done(null, user);
    } catch (err) {
      console.log("💥 Error inesperado:", err);
      return done(err);
    }
  }
));

// Estrategia JWT
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.jwt
  ]),
  secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));
