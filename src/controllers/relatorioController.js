const relatorioModel = require("../models/relatorioModel");

async function listarRelatorios(req, res) {
    try {
        const nomeEmpresa = req.params.empresa;
        const nomeDatacenter = req.params.datacenter;

        if (!nomeEmpresa || !nomeDatacenter) {
            return res.status(400).json({
                mensagem: "Empresa e datacenter são obrigatórios."
            });
        }

        const relatorios = await relatorioModel.listarRelatorios(
            nomeEmpresa,
            nomeDatacenter
        );

        return res.status(200).json({
            empresa: nomeEmpresa,
            datacenter: nomeDatacenter,
            quantidade: relatorios.length,
            relatorios
        });

    } catch (erro) {
        console.error("Erro ao listar relatórios:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível carregar os relatórios.",
            erro: erro.message
        });
    }
}

module.exports = {
    listarRelatorios
};