const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyApiKey = require('../auth/verifyApiKey');

router.get('/users', verifyApiKey, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/users', verifyApiKey, async (req, res) => {

    const user = new User({
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        telefono: req.body.telefono,
        tipoIdentificacion: req.body.tipoIdentificacion,
        numeroIdentificacion: req.body.numeroIdentificacion,
        departamento: req.body.departamento,
        municipio: req.body.municipio,
        direccion: req.body.direccion,
        ingresosMensuales: req.body.ingresosMensuales,
        documentoFotoFrontal: req.body.documentoFotoFrontal,
        documentoFotoTrasera: req.body.documentoFotoTrasera,
        selfieFoto: req.body.selfieFoto
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
