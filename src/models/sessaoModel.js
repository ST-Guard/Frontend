var database = require("../database/config")

function buscarUsuario(idUsuario) {
    console.log(
        "ACESSEI A SESSAO MODEL \n \n\t\t > Se aqui der erro, e alguma credencial do banco"
    )
    var instrucaoSql = `
        select * from vwBuscarDados
	        where idUsuario = ?
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

function alterarUsuario(idUsuario, nome, telefone) {
    console.log("ACESSEI O SESSAO MODEL - alterarUsuario");
    var instrucaoSql = `
        UPDATE usuario SET nome = ?, telefone = ?
          WHERE idUsuario = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, telefone, idUsuario]);
}

function salvarImagemPerfil(idUsuario, imagem) {
  const instrucao = `
    update Usuario set imagem = '${imagem}'
      where idUsuario = ${idUsuario};
  `;
  console.log("Executando a instrução SQL: \n" + instrucao);
  return database.executar(instrucao);
}

function buscarImagemPerfil(idUsuario) {
  const sql = `
    select imagem from Usuario 
      where idUsuario = ${idUsuario};
  `;
  return database.executar(sql);
}

module.exports = {
    buscarUsuario,
    alterarUsuario,
    salvarImagemPerfil,
    buscarImagemPerfil
}