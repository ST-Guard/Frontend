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

function listarZonas(idDataCenter) {
    const instrucaoSql = `
        SELECT idZona, nome FROM zona
        WHERE fkDataCenter = ?;
    `;
    return database.executar(instrucaoSql, [idDataCenter]);
}

async function cadastrarServidor(nome, tipo, estado, fkZona, nomeComp, tipoComp, unidade, capacidade) {

    const servidorResult = await database.executar(`
        INSERT INTO servidor (nome, tipo, estado, fkZona)
        VALUES (?, ?, ?, ?);
    `, [nome, tipo, estado, fkZona]);

    const idServidor = servidorResult.insertId;

    const componenteResult = await database.executar(`
        INSERT INTO componentes (nome, tipo, unidadeMedida, capacidadeMaxima)
        VALUES (?, ?, ?, ?);
    `, [nomeComp, tipoComp, unidade, capacidade]);

    const idComponente = componenteResult.insertId;

    await database.executar(`
        INSERT INTO componentes_servidor (limite, fkServidor, fkComponentes)
        VALUES (?, ?, ?);
    `, [capacidade, idServidor, idComponente]);

}

function listarServidores(idEmpresa) {

    var instrucao = `
        SELECT
            s.idServidor,
            s.nome,
            s.estado
        FROM servidor s
            JOIN zona z ON z.idZona = s.fkZona
            JOIN datacenter d ON d.idDataCenter = z.fkDataCenter
            JOIN usuario u ON u.idUsuario = d.fkUsuarioDataCenter
            JOIN papel p ON p.idPapel = u.fkPapel
        WHERE p.fkEmpresa = ?
        ORDER BY s.idServidor;
    `;

    return database.executar(instrucao, [idEmpresa]);
}

function listarComponentes(idEmpresa) {

    var instrucao = `
        SELECT
            s.idServidor,
            s.nome,
            s.estado
        FROM servidor s
            JOIN zona z ON z.idZona = s.fkZona
            JOIN datacenter d ON d.idDataCenter = z.fkDataCenter
            JOIN usuario u ON u.idUsuario = d.fkUsuarioDataCenter
            JOIN papel p ON p.idPapel = u.fkPapel
        WHERE p.fkEmpresa = ?
        ORDER BY s.idServidor;
    `;

    return database.executar(instrucao, [idEmpresa]);
}

async function adicionarComponente(fkServidor, nome, tipo, unidade, capacidade) {

    const componenteResult = await database.executar(`
        INSERT INTO componentes
        (nome, tipo, unidadeMedida, capacidadeMaxima)
        VALUES (?, ?, ?, ?);
    `, [nome, tipo, unidade, capacidade]);

    const idComponente = componenteResult.insertId;

    await database.executar(`
        INSERT INTO componentes_servidor
        (limite, fkServidor, fkComponentes)
        VALUES (?, ?, ?);
    `, [capacidade, fkServidor, idComponente]);

    return { message: "Componente adicionado com sucesso" };
}

module.exports = {
    carregarDatabases,
    listarZonas,
    listarServidores,
    listarComponentes,
    cadastrarServidor,
    adicionarComponente
};