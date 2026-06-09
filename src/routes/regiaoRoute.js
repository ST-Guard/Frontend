var express = require("express");
var router = express.Router();

var regiaoController = require("../controllers/regiaoController.js");

router.get("/listar/:fkEmpresa", function (req, res) {
    regiaoController.listarRegioes(req, res);
});

module.exports = router;