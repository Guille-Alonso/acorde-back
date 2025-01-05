const { validationResult } = require('express-validator');
const PreInscripcion = require('../models/preInscripcion');

const guardarPreInscripcion = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

  try {
    console.log(req.body);
    
    const preInscripcion = new PreInscripcion(req.body);
    await preInscripcion.save();
    res.status(201).json({ message: 'Preinscripción guardada con éxito', preInscripcion });
  } catch (error) {
    console.error(error);
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
