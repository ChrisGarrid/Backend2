// 📜 src/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔧 Middlewares
app.use(express.json());
app.use(cookieParser());

// 🔌 Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err);
  });

// 🔐 Inicializar Passport y cargar estrategias
require('./config/passport.config');
app.use(passport.initialize());

// 📦 Rutas
const sessionsRouter = require('./routes/sessions.router');
app.use('/api/sessions', sessionsRouter);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
