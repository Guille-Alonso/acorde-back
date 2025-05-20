const mongoose = require('mongoose');

// const DiaSchema = new Schema({
//   dia: { type: String, required: true },
//   cupo: { type: Number, default: 10 },
//   estado: { type: Boolean, default: true }
// });

// const Dia = mongoose.model('Dia', DiaSchema);

const InscripcionKidsSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  numCel: { type: String },
  nombrePadre: { type: String, required: true },
  telefonoPadre: { type: String, required: true },
  apellidoPadre: { type: String, required: true },
  emailPadre: { type: String, required: true },
  dia: { type: String, required: true },
  comentario: { type: String },
  // dia: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Dia",
  //   required: [true, "El dia es requerido"],
  // },
  fecha: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('InscripcionKids', InscripcionKidsSchema);
