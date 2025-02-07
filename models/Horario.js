const mongoose = require('mongoose');

const DisciplinaSchema = new mongoose.Schema({
  disciplina: { type: String, required: true },
  cupo: { type: Number, default: 10 }, // Cupo inicializado en 8 por disciplina
});

const DiaSchema = new mongoose.Schema({
  dia: { type: String, required: true },
  horario: { type: String, required: true },
  disciplinas: [DisciplinaSchema], // Ahora disciplinas es un array de objetos
});

const HorarioSchema = new mongoose.Schema({
  rangoEdad: {
    type: [Number],
    validate: {
      validator: function (v) {
        return v.length === 2; // Asegura que el rango tenga exactamente dos números
      },
    },
    required: true,
  },
  titulo: { type: String, required: true },
  dias: [DiaSchema],
});

const Horario = mongoose.model('Horario', HorarioSchema);

module.exports = Horario;

