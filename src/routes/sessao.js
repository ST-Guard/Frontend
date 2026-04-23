var express = require("express");
var router = express.Router();
const upload = require('../config/configUpload');
const sessaoController = require('../controllers/sessaoController');

router.get("/buscarUsuario/:idUsuario", function (req, res) {
    sessaoController.buscarUsuario(req, res);
});

router.put("/alterarUsuario", function (req, res) {
    sessaoController.alterarUsuario(req, res);
});

router.put('/imagemPerfil', upload.single('fotoPerfil'), (req, res) => {
    console.log("ENTREI NA ROTA PUT /sessao/imagemPerfil");
    sessaoController.salvarImagemPerfil(req, res);
});

router.get('/imagemPerfil/:idUsuario', sessaoController.buscarImagemPerfil);

module.exports = router;