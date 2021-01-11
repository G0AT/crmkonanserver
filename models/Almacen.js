const mongoose = require('mongoose');

const AlmacenSchema = mongoose.Schema({
    nombreMaterial: {
        type: String,
        required: true,
        trim: true
    },
    principal: {
        type: Number,
        require:true,
        trim: true
    },
    subAlmacen: {
        type: Number,
        require: true,
        trim: true
    },
    codigoAlmacen: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

AlmacenSchema.index({
    nombreMaterial: 'text'
})

module.exports = mongoose.model('Almacen', AlmacenSchema);