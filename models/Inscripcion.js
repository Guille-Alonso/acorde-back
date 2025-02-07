const mongoose = require('mongoose');

const InscripcionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  numCel: { type: String },
  nombrePadre: { type: String, required: true },
  telefonoPadre: { type: String, required: true },
  apellidoPadre: { type: String, required: true },
  emailPadre: { type: String, required: true },
  comentario: { type: String },
  fecha: {
    type: String,
    required: true,
  },
  disciplinas6a9: { type: [String], required: true },
  disciplinas10a15: { type: [String], required: true },
});

module.exports = mongoose.model('Inscripcion', InscripcionSchema);