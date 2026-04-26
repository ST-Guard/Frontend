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

// 📊 chartServer
const chartServer = document.getElementById("chartServer");

if (chartServer) {

    chartServer.addEventListener("click", function () {

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

}



// 📊 chartAlerta
const chartAlerta = document.getElementById("chartAlerta");

if (chartAlerta) {

    chartAlerta.addEventListener("click", function () {

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

}



// 📊 chartRamxCpu
const chartRamxCpu = document.getElementById("chartRamxCpu");

if (chartRamxCpu) {

    chartRamxCpu.addEventListener("click", function () {

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

}



// 📊 chartDiskxLat
const chartDiskxLat = document.getElementById("chartDiskxLat");

if (chartDiskxLat) {

    chartDiskxLat.addEventListener("click", function () {

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

}
/* ----- GRÁFICOS DA DASH DE ANALISTA ----- */

document.addEventListener("DOMContentLoaded", function () {

    const graficoUso =
        document.getElementById("graficoUso");

    if (graficoUso) {

        graficoUso.addEventListener("click", function () {

            abrirModal(
                "Servidores Estressados X Sobrecarregados",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a quantidade de servidores
                estressados e sobrecarregados.
                </p>

                <p>
                Servidores estressados estão próximos do limite,
                enquanto sobrecarregados já ultrapassaram o limite crítico.
                </p>
                `
            );

        });

    }



    const graficoTopRAM =
        document.getElementById("graficoTopProcRAM");

    if (graficoTopRAM) {

        graficoTopRAM.addEventListener("click", function () {

            abrirModal(
                "Top 3 Processos - Uso de RAM",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra os três processos
                que mais consomem memória RAM.
                </p>
                `
            );

        });

    }



    const graficoTopCPU =
        document.getElementById("graficoTopProcCPU");

    if (graficoTopCPU) {

        graficoTopCPU.addEventListener("click", function () {

            abrirModal(
                "Top 3 Processos - Uso de CPU",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra os três processos
                que mais utilizam CPU.
                </p>
                `
            );

        });

    }

});