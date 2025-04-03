// 📜 crearUsuario.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); // Usa el modelo con el pre('save')

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = "chris@correo.com";

    // Borrar usuario si ya existe
    await User.deleteOne({ email });

    const newUser = new User({
      first_name: "Chris",
      last_name: "Coder",
      email,
      age: 28,
      password: "supersegura123", // <- TEXTO PLANO
      role: "user"
    });

    await newUser.save();
    console.log("✅ Usuario creado correctamente con hash aplicado por el modelo.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error al crear el usuario:", err);
  });
// .finally(() => {
//     mongoose.disconnect(); // Desconectar de la base de datos al finalizar
// });  