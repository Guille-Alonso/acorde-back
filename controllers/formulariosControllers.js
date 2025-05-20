const { default: mongoose } = require('mongoose');
const Horario = require('../models/Horario');
const Inscripcion = require('../models/Inscripcion');
const PreInscripcion = require('../models/PreInscripcion');
const { transporter } = require('../utils/sendEmail');
const { obtenerFechaHoraArgentina } = require('../utils/obtenerFechaYHora');
const InscripcionKids = require('../models/InscripcionKids');

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

const listarInscriptos = async (req, res) => {
  try {
   
      const inscriptos = await Inscripcion.find();
      res.status(200).json({ inscriptos });
    
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
};

const listarInscriptosKids = async (req, res) => {
  try {
   
      const inscriptos = await InscripcionKids.find()
      res.status(200).json({ inscriptos });
    
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
  const { idDisciplina } = req.body; // Array de IDs de disciplinas desde el request

  try {
    // Validar que idDisciplina sea un array y no esté vacío
    if (!Array.isArray(idDisciplina) || idDisciplina.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar un array de IDs de disciplinas." });
    }

    // Búsqueda previa: verificar si alguna disciplina tiene cupo igual a 0
    const disciplinasSinCupo = await Horario.aggregate([
      {
        $unwind: "$dias", // Desanidar el array "dias"
      },
      {
        $unwind: "$dias.disciplinas", // Desanidar el array "disciplinas"
      },
      {
        $match: {
          "dias.disciplinas._id": { $in: idDisciplina.map((id) => new mongoose.Types.ObjectId(id)) }, // Filtrar por ID de disciplinas
          "dias.disciplinas.cupo": 0, // Filtrar disciplinas con cupo igual a 0
        },
      },
      {
        $project: {
          _id: 0, // Excluir el ID del documento principal
          disciplinaId: "$dias.disciplinas._id",
          disciplinaNombre: "$dias.disciplinas.disciplina", // Obtener el nombre de la disciplina
          dia: "$dias.dia",
          horario: "$dias.horario"
        },
      },
    ]);

    if (disciplinasSinCupo.length > 0) {
      // Crear un mensaje detallado para cada disciplina sin cupo
      const detalles = disciplinasSinCupo.map((disciplina) => {
        const { disciplinaNombre, dia, horario } = disciplina;
        return `Disciplina: ${disciplinaNombre}, Día: ${dia}, Horario: ${horario}`;
      });
    
      // Concatenar los detalles en un único mensaje
      const mensajeCompleto = `Algunas disciplinas no tienen cupo disponible. ${detalles.join("; ")}`;
    
      return res.status(400).json({
        message: mensajeCompleto,
      });
    }

    // Si todas las disciplinas tienen cupo disponible, proceder con la actualización
    const actualizaciones = [];

    for (const disciplinaId of idDisciplina) {
      const horario = await Horario.findOneAndUpdate(
        {
          "dias.disciplinas._id": disciplinaId, // Buscar por ID de disciplina
          "dias.disciplinas.cupo": { $gt: 0 }, // Validar que el cupo sea mayor a 0
        },
        {
          $inc: { "dias.$[].disciplinas.$[disc].cupo": -1 }, // Reducir el cupo
        },
        {
          arrayFilters: [{ "disc._id": disciplinaId, "disc.cupo": { $gt: 0 } }], // Filtrar la disciplina específica con cupo > 0
          new: true, // Retornar el documento actualizado
        }
      );

      // Si no se encuentra o no hay cupo disponible, agregar un mensaje de error
      if (!horario) {
        actualizaciones.push({ disciplinaId, message: "Cupo no disponible" });
      } else {
        actualizaciones.push({ disciplinaId, message: "Cupo reducido con éxito" });
      }
    }

    // Verificar si todas las disciplinas tienen cupo actualizado correctamente
    const errores = actualizaciones.filter((act) => act.message === "Cupo no disponible");
    if (errores.length > 0) {
      return res.status(400).json({
        message: "Algunas disciplinas no tienen cupo disponible.",
        detalles: errores,
      });
    }

    const inscripcion = new Inscripcion({
      ...req.body,
      // fecha: `${day}/${month}/${year}`, // Fecha en formato DD/MM/YYYY
      fecha: obtenerFechaHoraArgentina()
    });
    await inscripcion.save();

    let mail = {
      from: "", // Agrega tu dirección de correo
      to: "josefinaalonsotorino@gmail.com",
      subject: "Inscripción Acorde 2025",
      text: `Alumno: ${req.body.nombre} ${req.body.apellido}.
Padre / Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}.
Teléfono: ${req.body.telefonoPadre}.
Clases: ${req.body.disciplinas6a9.length > 0 ? `(Edad 6 a 9 años):  ${req.body.disciplinas6a9}` : `(Edad 10 a 15 años):  ${req.body.disciplinas10a15}`}.
Comentarios: ${req.body.comentario}.
`,
    };

    let mailPadre = {
      from: "", // Agrega tu dirección de correo
      to: `${req.body.emailPadre}`,
      subject: "Inscripción Acorde 2025",
      text: `Recuerde pagar la inscripción de Alumno: ${req.body.nombre} ${req.body.apellido}.
Padre / Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}.
Teléfono: ${req.body.telefonoPadre}.
Clases: ${req.body.disciplinas6a9.length > 0 ? `(Edad 6 a 9 años):  ${req.body.disciplinas6a9}` : `(Edad 10 a 15 años):  ${req.body.disciplinas10a15}`}.
Monto a Pagar: $ ${req.body.disciplinas6a9.length == 1 || req.body.disciplinas10a15.length == 1? "35.000" : "55.000"}.
Alias: Acorde2025.mp
Enviar comprobante a: acorde.yb@gmail.com
`,
    };

    // Enviar el correo de forma asíncrona
    try {
      await transporter.sendMail(mail);
      await transporter.sendMail(mailPadre);
      console.log("Correo enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    res.status(200).json({
      message: "Inscripción exitosa para todas las disciplinas.",
      detalles: actualizaciones,
      inscripcion,
    });
  } catch (error) {
    console.error("Error al inscribir:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const guardarInscripcionKids = async (req, res) => {

  try {

    const inscripcion = new InscripcionKids({
      ...req.body,
      // fecha: `${day}/${month}/${year}`, // Fecha en formato DD/MM/YYYY
      fecha: obtenerFechaHoraArgentina()
    });
    await inscripcion.save();

    let mail = {
      from: "", // Agrega tu dirección de correo
      to: "josefinaalonsotorino@gmail.com",
      subject: "Inscripción Acorde 2025",
      text: `Alumno: ${req.body.nombre} ${req.body.apellido}.
Padre / Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}.
Teléfono: ${req.body.telefonoPadre}.
Clases para edad 4-5 años Día: ${req.body.dia}.
Comentarios: ${req.body.comentario}.
`,
    };

    let mailPadre = {
      from: "", // Agrega tu dirección de correo
      to: `${req.body.emailPadre}`,
      subject: "Inscripción Acorde 2025",
      text: `Recuerde pagar la inscripción de Alumno: ${req.body.nombre} ${req.body.apellido}.
Padre / Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}.
Teléfono: ${req.body.telefonoPadre}.
Clases para edad 4-5 años Día: ${req.body.dia}.
Monto a Pagar: $ 40.000
Alias: Acorde2025.mp
Enviar comprobante a: acorde.yb@gmail.com
`,
    };

    // Enviar el correo de forma asíncrona
    try {
      await transporter.sendMail(mail);
      await transporter.sendMail(mailPadre);
      console.log("Correo enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    res.status(200).json({
      message: "Inscripción exitosa",
      inscripcion,
    });
  } catch (error) {
    console.error("Error al inscribir:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const editarInscripcionAlumno = async (req, res) => {
  try {
    const { disciplinas6a9, disciplinas10a15 } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID de inscripción es requerido." });
    }

    const updatedData = {};
    if (disciplinas6a9) updatedData.disciplinas6a9 = disciplinas6a9;
    if (disciplinas10a15) updatedData.disciplinas10a15 = disciplinas10a15;

    const resultado = await Inscripcion.findByIdAndUpdate(id, updatedData, { new: true });

    if (!resultado) {
      return res.status(404).json({ message: "Inscripción no encontrada." });
    }

    res.status(200).json({ message: "Inscripción actualizada correctamente.", data: resultado });
  } catch (error) {
    console.error("Error al editar inscripción:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};


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


module.exports = { guardarPreInscripcion, listarPreInscriptos, guardarInscripcion, datos , obtenerHorarios, listarInscriptos, editarInscripcionAlumno, guardarInscripcionKids, listarInscriptosKids};
