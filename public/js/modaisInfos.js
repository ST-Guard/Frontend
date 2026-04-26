/* ----- MODAIS DOS GRÁFICOS ----- */

function abrirModal(titulo, conteudo) {
    document.getElementById("tituloModal").innerHTML = titulo;
    document.getElementById("conteudoModal").innerHTML = conteudo;
    document.getElementById("modalGrafico")
        .classList.add("ativo");
}

function fecharModal() {
    document.getElementById("modalGrafico")
        .classList.remove("ativo");
}


/* ---- INFOS MODAIS GESTOR ---- */

document
.getElementById("chartServer")
.addEventListener("click", function () {

    abrirModal(
        "Servidores com Alertas",

        `
        <p><b>Descrição:</b></p>

        <p>
        Este gráfico apresenta a quantidade de servidores
        que registraram alertas recentemente.
        </p>

        <p>
        Ele permite identificar quais servidores
        estão apresentando maior número de ocorrências
        e precisam de atenção.
        </p>
        `
    );
});

document
.getElementById("chartAlerta")
.addEventListener("click", function () {

    abrirModal(
        "Distribuição de Alertas",

        `
        <p><b>Descrição:</b></p>

        <p>
        Este gráfico mostra os diferentes tipos
        de alertas registrados no sistema.
        </p>

        <p>
        Ele ajuda a identificar os principais
        problemas que estão ocorrendo na infraestrutura.
        </p>
        `
    );
});


document
.getElementById("chartRamxCpu")
.addEventListener("click", function () {

    abrirModal(
        "Uso de RAM x CPU",

        `
        <p><b>Descrição:</b></p>

        <p>
        Este gráfico compara o uso de memória RAM
        com o uso de CPU dos servidores.
        </p>

        <p>
        Ele permite identificar correlação entre
        processamento e consumo de memória.
        </p>
        `
    );
});

document
.getElementById("chartDiskxLat")
.addEventListener("click", function () {

    abrirModal(
        "Uso de Disco x Latência",

        `
        <p><b>Descrição:</b></p>

        <p>
        Este gráfico mostra a relação entre
        uso de disco e latência do sistema.
        </p>

        <p>
        Ele ajuda a identificar possíveis
        gargalos relacionados ao armazenamento.
        </p>
        `
    );
});