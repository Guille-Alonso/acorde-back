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
      to: "guilloalonsot@gmail.com",
      subject: "Pre-Inscripción Acorde 2025",
      text: `Alumno: ${req.body.nombre} ${req.body.apellido}.
Padre / Madre: ${req.body.nombrePadre} ${req.body.apellidoPadre}.
Teléfono: ${req.body.telefonoPadre}.
Clases: ${clases}.
Días: ${dias}.`,
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
   
      const users = await PreInscripcion.find();
      res.status(200).json({ users });
    
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
};

module.exports = { guardarPreInscripcion, listarPreInscriptos };
