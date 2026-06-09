window.onload = function () {
    listarRegioes();
};

function listarRegioes() {

    var fkEmpresa = sessionStorage.FK_EMPRESA;

    fetch(`/regioes/listar/${fkEmpresa}`)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (regioes) {

            console.log("REGIÕES:", regioes);

            div_regioes.innerHTML = "";

            for (var i = 0; i < regioes.length; i++) {

                div_regioes.innerHTML += `
    <div class="card_regiao">
        <div class="regiao">

            <div class="regiao_esquerda">
                <div class="regiao_avatar">
                    <img src="./../assets/dashboard-icons/iconDashSup/iconLOC.png">
                </div>

                <div class="regiao_info">
                    <h2 class="regiao_nome">${regioes[i].estado}</h2>
                    <span class="regiao_descricao">Região ativa</span>
                </div>
            </div>

            <div class="regiao_acoes">
                <button class="regiao_desativar">
                    Desativar Região
                </button>

                <button class="regiao_deletar">
                    Excluir Região
                </button>
            </div>

        </div>
    </div>
`;
            }
        })
        .catch(function (erro) {
            console.log("Erro ao listar regiões:", erro);
        });
}