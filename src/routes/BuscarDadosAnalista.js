var express = require("express");
var router = express.Router();
var path = require("path");
const AnalistaController = require('../controllers/AnalistaController');



router.post("/buscarDadosAnalista_Gerais", function (req, res) {
    AnalistaController.BuscarDadosAnalista(req, res);
});



module.exports = router;