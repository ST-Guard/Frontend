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

function cadastrarZona(req, res) {

    const nomeZona = req.body.nomeZona;

    if (nomeZona == undefined) {
        res.status(400).send("Nome da zona inválido!");
    } else {

        servidorModel.cadastrarZona(nomeZona)
            .then(function(resultado){
                res.json(resultado);
            })
            .catch(function(erro){
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listarZonas(req, res){

    servidorModel.listarZonas()
        .then(function(resultado){
            res.json(resultado);
        })
        .catch(function(erro){
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarServidor(req, res) {

    const { nomeServ, tipoServ, estadoServ } = req.body;

    servidorModel.cadastrarServidorCompleto(
        nomeServ,
        tipoServ,
        estadoServ
    )
    .then(resultado => res.json(resultado))
    .catch(erro => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function cadastrarComponente(req, res) {

    const nomeComponente = req.body.nomeCompo
    const tipoComponente = req.body.tipoCompo
    const unidComponente = req.body.unidCompo
    const capComponente = req.body.capCompo

    if (nomeComponente == undefined) {
        res.status(400).send("Nome do componente está inválido!");
    } 
    else if (tipoComponente == undefined) {
        res.status(400).send("Tipo do componente está inválido!");
    } 
    else if (unidComponente == undefined) {
        res.status(400).send("Unidade do componente inválida!");
    } 
    else if (capComponente == undefined) {
        res.status(400).send("Capacidade do componente inválida!");
    } else {
        servidorModel.cadastrarComponente(nomeComponente, tipoComponente, unidComponente, capComponente)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ) .catch(
                function(erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

module.exports = {
    carregarDatabases,
    cadastrarZona,
    listarZonas,
    cadastrarServidor,
    cadastrarComponente
}