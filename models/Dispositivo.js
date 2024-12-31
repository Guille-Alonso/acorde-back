const { Schema, model } = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const DispositivoSchema = new Schema(
    {
        nombre: {
            type: String,
            unique: true,
            trim: true,
            uppercase:true,
            minLength: [6, "Debe tener al menos 6 caracteres"],
            maxLength: [7, "Debe tener como máximo 7 caracteres"],
            required: [true, "El nombre es requerido"],
        },
        ubicacion: {
            type: String,
            trim: true,
            lowercase: true,
            minLength: [8, "Debe tener al menos 8 caracteres"],
            maxLength: [50, "Debe tener como máximo 50 caracteres"],
            required: [true, "La ubicación es requerida"],
        },
        tipo: {
            type: String,
            enum: ["camara", "domo"],
            trim: true,
            required: [true, "El tipo de cámara es requerido"],
        },
        estado:{//borrado logico
            type: Boolean,
            default: true
        },
    },
    {
        versionKey: false,
        timestamps: false,
    }
);

DispositivoSchema.plugin(mongooseUniqueValidator,{
    message: '{PATH} debe ser único'
    })  

module.exports = model('Dispositivo', DispositivoSchema);