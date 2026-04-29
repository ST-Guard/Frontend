/* =========================================== */
/* ----- ABRI MODAIS DOS GRÁFICOS E KPIs ----- */

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

/* =============================== */
/* ---- INFOS GRÁFICOS GESTOR ---- */

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

/* ============================================== */
/* ----- GRÁFICOS DA DASH DE ANALISTA GERAL ----- */

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

/* =================================================== */
/* ----- GRÁFICOS DA DASH DE ANALISTA ESPECIFICA ----- */

document.addEventListener("DOMContentLoaded", function () {

    const graficoRam =
        document.getElementById("graficoRam");

    if (graficoRam) {

        graficoRam.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso da RAM",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a utilização de RAM do servidor selecionado.
                </p>

                <p>
                Útil para saber como esta o componente no presente momento.
                </p>
                `
            );

        });

    }



    const graficoCpu =
        document.getElementById("graficoCpu");

    if (graficoCpu) {

        graficoCpu.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso da CPU",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a utilização de CPU do servidor selecionado.
                </p>

                <p>
                Útil para saber como esta o componente no presente momento.
                </p>
                `
            );

        });

    }



    const graficoDisco =
        document.getElementById("graficoDisco");

    if (graficoDisco) {

        graficoDisco.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso do Disco",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a utilização de Disco do servidor selecionado.
                </p>

                <p>
                Útil para saber como esta o componente no presente momento.
                </p>
                `
            );

        });

    }


    const chartRamxCpu =
        document.getElementById("chartRamxCpu");

    if (chartRamxCpu) {

        chartRamxCpu.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso da RAM x CPU em horários do dia",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico traz a comparação do uso da RAM e CPU no dia atual
                </p>

                <p>
                Não pensei(ajuste)
                </p>
                `
            );

        });

    }

    const chartDiskxLat =
        document.getElementById("chartDiskxLat");

    if (chartDiskxLat) {

        chartDiskxLat.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso do Disco x Latência de rede",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico traz a comparação do uso da Disco e com a latência em diferentes horários do dia
                </p>

                <p>
                Não pensei(ajuste)
                </p>
                `
            );

        });

    }

    const graficoComponentes =
        document.getElementById("graficoComponentes");

    if (graficoComponentes) {

        graficoComponentes.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso de todos os componetes",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico traz o uso de todos os 4 componentes do servidor
                </p>

                <p>
                Não pensei(ajuste)
                </p>
                `
            );

        });

    }

});

/* ============================= */
/* ---- KPIs DA DASH GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const alertServer =
        document.getElementById("alertServer");

    if (alertServer) {

        alertServer.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const procConsumo =
        document.getElementById("procConsumo");

    if (procConsumo) {

        procConsumo.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const jogAtivos =
        document.getElementById("jogAtivos");

    if (jogAtivos) {

        jogAtivos.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const serveAtivos =
        document.getElementById("serveAtivos");

    if (serveAtivos) {

        serveAtivos.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
});

/* ============================================== */
/* ---- KPIs NA DASH DE SERVIDORES DO GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const p99cpu =
        document.getElementById("p99cpu");

    if (p99cpu) {

        p99cpu.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const p99ram =
        document.getElementById("p99ram");

    if (p99ram) {

        p99ram.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const p99latencia =
        document.getElementById("p99latencia");

    if (p99latencia) {

        p99latencia.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const p99disco =
        document.getElementById("p99disco");

    if (p99disco) {

        p99disco.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }

    const totalServer =
        document.getElementById("totalServer");

    if (totalServer) {

        totalServer.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
});

/* =========================================== */
/* ---- KPIs NA DASH DE ALERTAS DO GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const severa =
        document.getElementById("severa");

    if (severa) {

        severa.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const media =
        document.getElementById("media");

    if (media) {

        media.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const baixa =
        document.getElementById("baixa");

    if (baixa) {

        baixa.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
    const resolvidos =
        document.getElementById("resolvidos");

    if (resolvidos) {

        resolvidos.addEventListener("click", function () {

            abrirModal(
                "KPI x",

                `
                <p><b>Descrição:</b></p>

                <p>
                descrição X
                </p>

                <p>
                utilidade x
                </p>
                `
            );

        });

    }
});
