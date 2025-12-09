const mongoose = require('mongoose');

const PreInscripcion2026Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  numCel: { type: String },
  nombrePadre: { type: String, required: true },
  telefonoPadre: { type: String, required: true },
  apellidoPadre: { type: String, required: true },
  emailPadre: { type: String, required: true },
  clases: { type: [String], required: true },
  comentario: { type: String },
});

module.exports = mongoose.model('PreInscripcion2026', PreInscripcion2026Schema);
