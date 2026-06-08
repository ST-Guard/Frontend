var database = require("../database/config");

function BuscarZona(idUsuario) {
    var instrucao = `SELECT z.idZona, z.nome, z.fkDataCenter FROM analista_zona JOIN usuario ON idUsuario = usuario_id JOIN zona  as z ON  zona_id = z.idZona WHERE idUsuario = ${idUsuario};`;
    return database.executar(instrucao);
}


function BuscarDados_Empresa(idUsuario){
    var instrucao = `            SELECT razaoSocial, dc.nome as datacenter, z.nome as zona, s.nome FROM usuario 
            JOIN papel ON fkPapel = idPapel 
            JOIN empresa ON fkEmpresa = idEmpresa 
            JOIN regiao ON fkRegiaoEmpresa = idEmpresa 
            JOIN datacenter dc ON fkRegiaoDataCenter = dc.idDatacenter
            JOIN zona z ON z.fkDatacenter = idDatacenter
            JOIN analista_zona ON usuario_id = idUsuario
            JOIN servidor s ON s.fkZona = z.idZona
            WHERE usuario_id = ${idUsuario};            
    `
            return database.executar(instrucao)

}

module.exports = {
    BuscarZona,
    BuscarDados_Empresa
};