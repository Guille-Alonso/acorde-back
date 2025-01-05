const mongoose = require('mongoose');

const PreInscripcionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  numCel: { type: String },
  nombrePadre: { type: String, required: true },
  telefonoPadre: { type: String, required: true },
  apellidoPadre: { type: String, required: true },
  emailPadre: { type: String, required: true },
  nivel: { type: String, required: true },
  clases: { type: [String], required: true },
  dias: { type: [String], required: true },
  participaMuestra: { type: Boolean, required: true },
  estiloMusica: { type: String },
  comentario: { type: String },
  otroInstrumento: { type: String },
});

module.exports = mongoose.model('PreInscripcion', PreInscripcionSchema);
