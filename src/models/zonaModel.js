var database = require("../database/config");

function listar() {
    var instrucao = `SELECT * FROM zona;`;
    return database.executar(instrucao);
}

module.exports = {
    listar
};