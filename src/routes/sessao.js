var express = require("express");
var router = express.Router();
const upload = require('../config/configUpload');
const sessaoController = require('../controller/sessaoController');

router.put('/imagemPerfil', upload.single('fotoPerfil'), (req, res) => {
    sessaoController.salvarImagemPerfil(req, res);
});

router.get('/imagemPerfil/:idUsuario', sessaoController.buscarImagemPerfil);

module.exports = router;