var database = require("../database/config")

function autenticar(emailVar, senhaVar) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", emailVar, senhaVar)
    
    var instrucaoSql = `
        SELECT u.idUsuario, u.nome, u.email, u.fkPapel, p.fkEmpresa FROM usuario u
        JOIN papel p ON u.fkPapel = p.idPapel
            WHERE u.email = '${emailVar}' AND u.senha = '${senhaVar}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, cpf, telefone, senha, fkPapel) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Função cadastrar():", nome, email);
    
    
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, cpf, telefone, senha, fkPapel, status) 
        VALUES ('${nome}', '${email}', '${cpf}', '${telefone}', '${senha}', ${fkPapel}, 'Ativo');
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar() {
    
    var instrucao = `
        SELECT idUsuario, nome, email, telefone, fkPapel, status FROM usuario 
        WHERE fkPapel = 2;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function mudarStatus(idUsuario, novoStatus) {
    var instrucaoSql = `
        UPDATE usuario SET status = '${novoStatus}' WHERE idUsuario = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    listar,
    mudarStatus
};