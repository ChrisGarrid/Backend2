// Importamos las dependencias necesarias
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema del usuario (estructura lógica)
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name:  { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, trim: true, lowercase: true },
    age:        { type: Number, required: true, min: 0 },
    password:   { type: String, required: true },
    cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role:       { type: String, default: 'user', enum: ['user', 'admin', 'premium'] }
}, { timestamps: true });

// Middleware para cifrar contraseña antes de guardar al usuario
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next(); // Solo encripta si la contraseña ha cambiado

    const saltRounds = 10; // Nivel de seguridad recomendado
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

// Método para comparar contraseñas durante login
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

// Exportamos el modelo para su uso en otros archivos
const User = mongoose.model('User', userSchema);
module.exports = User;
