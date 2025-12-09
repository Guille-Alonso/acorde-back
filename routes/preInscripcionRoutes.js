const express = require('express');
const { check } = require('express-validator');
const { guardarPreInscripcion, guardarPreInscripcion2026, listarPreInscriptos, guardarInscripcion, datos, obtenerHorarios, listarInscriptos, editarInscripcionAlumno, guardarInscripcionKids, listarInscriptosKids } = require('../controllers/formulariosControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post(
  '/preInscripcion',
//   [
//     check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
//     check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
//     check('edad').isInt({ min: 1 }).withMessage('La edad debe ser un número positivo'),
//     check('numCel').notEmpty().withMessage('El número de celular es obligatorio'),
//     check('nombrePadre').notEmpty().withMessage('El nombre del padre es obligatorio'),
//     check('telefonoPadre').notEmpty().withMessage('El teléfono del padre es obligatorio'),
//     check('apellidoPadre').notEmpty().withMessage('El apellido del padre es obligatorio'),
//     check('emailPadre').isEmail().withMessage('El email del padre debe ser válido'),
//     check('nivel').notEmpty().withMessage('El nivel es obligatorio'),
//     check('clases').isArray({ min: 1 }).withMessage('Debes seleccionar al menos una clase'),
//     check('dias').isArray({ min: 1 }).withMessage('Debes seleccionar al menos un día'),
//     check('participaMuestra').isBoolean().withMessage('Debe ser verdadero o falso'),
//     check('estiloMusica').notEmpty().withMessage('El estilo de música es obligatorio'),
//   ],
  guardarPreInscripcion
);

router.post(
  '/inscripcion',
  guardarInscripcion
);

router.post(
  '/preInscripcion2026',
  guardarPreInscripcion2026
);

router.post(
  '/inscripcionKids',
  guardarInscripcionKids
);

router.post(
  '/datos',
  datos
);

router.get("/horarios", obtenerHorarios)

router.get("/listarPreInscriptos",auth, listarPreInscriptos)
router.get("/listarInscriptos",auth, listarInscriptos)
router.get("/listarInscriptosKids",auth, listarInscriptosKids)
router.patch("/editarInscripcionAlumno/:id",auth, editarInscripcionAlumno)
module.exports = router;
