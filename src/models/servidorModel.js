var database = require("../database/config");

function cadastrarServidor(nomeServidor, tipoServidor, estadoServidor) {

    var instrucaoSql = `
        INSERT INTO servidor (nome, tipo, estado)
        VALUES (?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nomeServidor, tipoServidor, estadoServidor]);
}

function cadastrarComponente(nome, tipo, unidade, capacidade) {

    var instrucaoSql = `
        INSERT INTO componente (nome, tipo, unidade, capacidade)
        VALUES (?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nome, tipo, unidade, capacidade]);
}

module.exports = {
    cadastrarServidor,
    cadastrarComponente
};