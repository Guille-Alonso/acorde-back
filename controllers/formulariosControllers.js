const Horario = require('../models/Horario');
const Inscripcion = require('../models/Inscripcion');
const PreInscripcion = require('../models/PreInscripcion');
const { transporter } = require('../utils/sendEmail');

// const guardarPreInscripcion = async (req, res) => {

//   try {
//     console.log(req.body);
    
//     const preInscripcion = new PreInscripcion(req.body);
//     await preInscripcion.save();
//     let mail = {
//       from:"",
//       to:"guilloalonsot@gmail.com",
//       subject:"Pre-Inscripción Acorde 2025",
//       text: `Alumno: ${req.body.nombre} ${req.body.apellido}. Padre/Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}. Telefono: ${req.body.telefonoPadre}`
//     }

//     transporter.sendMail(mail,(error,info) => {
//       if(error){
//         console.log(error)
//       }else{
//         console.log("email enviado")
//       }
//     })

//     res.status(201).json({ message: 'Preinscripción guardada con éxito', preInscripcion });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al guardar la preinscripción', error });
//   }
// };

const guardarPreInscripcion = async (req, res) => {
  try {
    console.log(req.body);

    // Guardar pre-inscripción
    const preInscripcion = new PreInscripcion(req.body);
    await preInscripcion.save();

    // Crear el texto del correo
    let clases = req.body.clases ? req.body.clases.join(', ') : 'No se especificaron clases';
    let dias = req.body.dias ? req.body.dias.join(', ') : 'No se especificaron días';

    let mail = {
      from: "", // Agrega tu dirección de correo
      to: "josefinaalonsotorino@gmail.com",
      subject: "Pre-Inscripción Acorde 2025",
      text: `Alumno: ${req.body.nombre} ${req.body.apellido}.
Padre / Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}.
Teléfono: ${req.body.telefonoPadre}.
Clases: ${clases}.
Otro Instrumento: ${req.body.otroInstrumento}.
Días: ${dias}.
Participa en muestra: ${req.body.participaMuestra ? "si" : "no"}.
Estilo de música preferido: ${req.body.estiloMusica}.
Comentarios: ${req.body.comentario}.
`,
    };

    // Enviar el correo de forma asíncrona
    try {
      await transporter.sendMail(mail);
      console.log("Correo enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    // Responder al cliente
    res.status(201).json({ message: 'Preinscripción guardada con éxito', preInscripcion });

  } catch (error) {
    console.error("Error al guardar la preinscripción:", error);
    res.status(500).json({ message: 'Error al guardar la preinscripción', error });
  }
};

const listarPreInscriptos = async (req, res) => {
  try {
   
      const preInscriptos = await PreInscripcion.find();
      res.status(200).json({ preInscriptos });
    
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
};

const obtenerHorarios = async (req, res) => {
  try {
    const horarios = await Horario.aggregate([
      {
        $addFields: {
          dias: {
            $map: {
              input: "$dias", // Iteramos sobre el array `dias`
              as: "dia",
              in: {
                // Filtramos las disciplinas de cada dia
                $mergeObjects: [
                  "$$dia",
                  {
                    disciplinas: {
                      $filter: {
                        input: "$$dia.disciplinas", // Filtramos `disciplinas` dentro de cada `dia`
                        as: "disciplina",
                        cond: { $gt: ["$$disciplina.cupo", 0] } // Solo dejamos las disciplinas con cupo > 0
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $match: { "dias.disciplinas.0": { $exists: true } } // Solo incluir días que tienen disciplinas con cupo > 0
      }
    ]);
    res.status(200).json({ horarios });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message || "Algo explotó :|" });
  }
};


const guardarInscripcion = async (req, res) => {
  try {
    console.log(req.body);

    // Guardar pre-inscripción
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();

    // Crear el texto del correo
    let clases = req.body.clases ? req.body.clases.join(', ') : 'No se especificaron clases';

    let mail = {
      from: "", // Agrega tu dirección de correo
      to: "josefinaalonsotorino@gmail.com",
      subject: "Inscripción Acorde 2025",
      text: `Alumno: ${req.body.nombre} ${req.body.apellido}.
      Teléfono: ${req.body.numCel}.
Clases: ${clases}.
`,
    };

    // Enviar el correo de forma asíncrona
    try {
      await transporter.sendMail(mail);
      console.log("Correo enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    // Responder al cliente
    res.status(201).json({ message: 'inscripción guardada con éxito', inscripcion });

  } catch (error) {
    console.error("Error al guardar la preinscripción:", error);
    res.status(500).json({ message: 'Error al guardar la preinscripción', error });
  }
};

const mongoose = require('mongoose');

const horarios = [
  {
    rangoEdad: [6, 9],
    titulo: "6 a 9 años",
    dias: [
      { dia: "Lunes", horario: "18.30hs a 19.30hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Ukelele"}, {disciplina:"Piano"}, {disciplina:"Canto"}] },
      { dia: "Martes", horario: "18.30hs a 19.30hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Ukelele"}, {disciplina:"Piano"}, {disciplina:"Canto"}] },
      { dia: "Miércoles", horario: "18.30hs a 19.30hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Ukelele"}, {disciplina:"Canto"}, {disciplina:"Violín"}] },
      { dia: "Jueves", horario: "18.30hs a 19.30hs", disciplinas: [{disciplina:"Piano"}, {disciplina:"Canto"}] },
      { dia: "Viernes", horario: "18.30hs a 19.30hs", disciplinas: [{disciplina:"Canto"}, {disciplina:"Guitarra"}, {disciplina:"Percusión"}] },
    ],
  },
  {
    rangoEdad: [10, 15],
    titulo: "10 a 15 años",
    dias: [
      { dia: "Lunes", horario: "20hs a 21hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Ukelele"}, {disciplina:"Piano"}, {disciplina:"Canto"}] },
      { dia: "Martes", horario: "20hs a 21hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Ukelele"}, {disciplina:"Piano"}, {disciplina:"Canto"}] },
      { dia: "Miércoles", horario: "20hs a 21hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Ukelele"}, {disciplina:"Violín"}] },
      { dia: "Jueves", horario: "20hs a 21hs", disciplinas: [{disciplina:"Guitarra"}, {disciplina:"Piano"}, {disciplina:"Canto"}] },
      { dia: "Viernes", horario: "20hs a 21hs", disciplinas: [{disciplina:"Canto"}, {disciplina:"Guitarra"}, {disciplina:"Percusión"}] },
    ],
  },
];

const datos = async (req, res) => {
  try {
    // await mongoose.connect('mongodb://localhost:27017/acordedb', { useNewUrlParser: true, useUnifiedTopology: true });
    await Horario.deleteMany({}); // Limpia los datos existentes
    await Horario.insertMany(horarios);
    console.log('Datos insertados correctamente.');
    // mongoose.disconnect();
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  }
}


module.exports = { guardarPreInscripcion, listarPreInscriptos, guardarInscripcion, datos , obtenerHorarios};
