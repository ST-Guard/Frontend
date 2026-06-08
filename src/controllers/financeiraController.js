var financeiroModel = require("../models/pegarDadosFinanceiroModal");

function dadosFinanceira(req, res) {
    

    const bucket = req.body.bucket;

    //Dados para a dashFInanceira
    financeiroModel.pegarDadosFinanceiro(bucket)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
    
}

function listarRelatorios(req, res) {
    financeiroModel.listarRelatoriosFinanceiros()
        .then(relatorios => res.json(relatorios))
        .catch(erro => {
            console.log(erro);
            res.status(500).json({ mensagem: "Não foi possível buscar os relatórios financeiros." });
        });
}

function obterUrlRelatorio(req, res) {
    const chave = req.query.chave;

    financeiroModel.gerarUrlRelatorioFinanceiro(chave)
        .then(url => res.json({ url }))
        .catch(erro => {
            console.log(erro);
            const status = erro.message === "Relatório inválido." ? 400 : 500;
            res.status(status).json({ mensagem: erro.message });
        });
}


module.exports = {
    dadosFinanceira,
    listarRelatorios,
    obterUrlRelatorio
}
