const express = require("express");
const router = express.Router();

const relatorioController = require("../controllers/relatorioController");

router.get(
    "/listar/:empresa/:datacenter",
    relatorioController.listarRelatorios
);

module.exports = router;