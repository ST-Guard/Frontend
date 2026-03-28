var database = require("../database/config")

function enviar(nomeVar, emailVar, mensagemVar){
    

    var instrucaoSql = `
    INSERT INTO contato_inicial(nome_usuario, email_usuario, mensagem_usuario) VALUES
	('${nomeVar}', '${emailVar}', '${mensagemVar}');
    
    `

    console.log(instrucaoSql)

    return database.executar(instrucaoSql)
}

module.exports = {
    enviar
}