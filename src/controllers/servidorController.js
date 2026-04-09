var servidorModel = require("../models/servidorModel");

function carregarDatabases(req, res) {
    const fkEmpresa = req.params.fkEmpresa;

    servidorModel.carregarDatabases(fkEmpresa)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarZonas(req, res){

    const idDataCenter = req.params.idDataCenter;

    servidorModel.listarZonas(idDataCenter)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarServidor(req, res) {

    const {nomeServ, tipoServ, estadoServ, fkZona, nomeCompo, tipoCompo, unidCompo, capCompo} = req.body;

    servidorModel.cadastrarServidor(nomeServ, tipoServ, estadoServ, fkZona, nomeCompo, tipoCompo, unidCompo, capCompo)
    .then(resultado => res.json(resultado))
    .catch(erro => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarServidores(req, res) {

    var idEmpresa = req.params.idEmpresa;

    servidorModel.listarServidores(idEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function adicionarComponente(req, res) {

    const {fkServidor, nome, tipo, unidade, capacidade} = req.body;

    servidorModel.adicionarComponente(fkServidor, nome, tipo, unidade, capacidade)
    .then(resultado => {
        res.json(resultado);
    })
    .catch(erro => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    carregarDatabases,
    listarZonas,
    cadastrarServidor,
    listarServidores,
    adicionarComponente
}