var database = require("../database/config");

function listarRegioes(fkEmpresa) {
    var instrucaoSql = `
        SELECT estado
        FROM regiao
        WHERE fkRegiaoEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarRegioes
};