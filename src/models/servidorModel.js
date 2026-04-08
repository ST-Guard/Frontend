var database = require("../database/config");

function carregarDatabases(fkEmpresa) {

    const instrucaoSql = `
        SELECT dc.idDataCenter, dc.nome
        FROM datacenter dc
        JOIN usuario u ON dc.fkUsuarioDataCenter = u.idUsuario
        JOIN papel p ON u.fkPapel = p.idPapel
        WHERE p.fkEmpresa = ${fkEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function cadastrarZona(nomeZona, fkUsuario) {

    var instrucaoSql = `
        INSERT INTO zona (nomeZona, fkEmpresa)
        SELECT 
            '${nomeZona}',
            p.fkEmpresa
        FROM usuario u
        JOIN papel p ON u.fkPapel = p.idPapel
        WHERE u.idUsuario = ${fkUsuario};
    `;

    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarZonas(){

    var instrucaoSql = `
        SELECT id, nome FROM zona;
    `;

    return database.executar(instrucaoSql);
}

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
    carregarDatabases,
    cadastrarZona,
    listarZonas,
    cadastrarServidor,
    cadastrarComponente
};