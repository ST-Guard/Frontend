var regiaoModel = require("../models/regiaoModel.js");

function listarRegioes(req, res) {
    var fkEmpresa = req.params.fkEmpresa;

    regiaoModel.listarRegioes(fkEmpresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarRegioes
};