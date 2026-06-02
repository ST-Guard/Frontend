fetch("../dados/dashboard_supervisora_regional.json")
    .then(response => response.json())
    .then(dados => {

        console.log("JSON carregado");
        console.log(dados);

         dadosDashboardGlobal = dados;
         
        carregarKpis(dados);
        carregarCards(dados);
        carregarGraficoAlertas(dados);
        carregarGraficoTopProblemas(dados);
        carregarGraficoTrafego(dados);

    })
    .catch(error => {
        console.error(error);
    });

    
function aplicarStatusKpi(idCard, status) {
    const card = document.getElementById(idCard);

    card.classList.remove("kpi-normal", "kpi-atencao", "kpi-critico");

    if (status === "CRITICO") {
        card.classList.add("kpi-critico");
    } else if (status === "ATENCAO") {
        card.classList.add("kpi-atencao");
    } else {
        card.classList.add("kpi-normal");
    }
}

function carregarKpis(dados) {

    // Região com maior risco

    document.getElementById("kpi_risco_regiao").innerText =
        dados.kpis.risco_operacional.maior_risco.regiao;

    aplicarStatusKpi(
        "kpi_maior_risco_borda",
        dados.kpis.risco_operacional.maior_risco.status
    );


    // Regiões instáveis

    document.getElementById("kpi_regioes_instaveis_valor").innerText =
        dados.kpis.regioes_instaveis.quantidade;

    aplicarStatusKpi(
        "kpi_operando_borda",
        dados.kpis.regioes_instaveis.quantidade >= 2 ? "CRITICO" :
        dados.kpis.regioes_instaveis.quantidade == 1 ? "ATENCAO" :
        "NORMAL"
    );


    // Menor capacidade disponível

    const capacidade = dados.kpis.capacidade_disponivel;

    document.getElementById("kpi_capacidade_valor").innerText =
        `${capacidade.capacidade_disponivel}%`;

    document.getElementById("kpi_capacidade_regiao").innerText =
        capacidade.regiao;

    aplicarStatusKpi(
        "kpi_uptime_borda",
        capacidade.capacidade_disponivel <= 10 ? "CRITICO" :
        capacidade.capacidade_disponivel <= 25 ? "ATENCAO" :
        "NORMAL"
    );


    // Região próxima de saturação

    const saturacao = dados.kpis.previsao_saturacao;

    document.getElementById("kpi_saturacao_valor").innerText =
        saturacao.regiao;

    document.getElementById("kpi_saturacao_tempo").innerText =
    `: ${saturacao.tempo_formatado}`;

    aplicarStatusKpi(
        "kpi_saturacao_borda",
        saturacao.dias_para_saturar <= 7 ? "CRITICO" :
        saturacao.dias_para_saturar <= 20 ? "ATENCAO" :
        "NORMAL"
    );
}
//CARD REGIOES ---------------------------------------------------------------------------------------------------------
function carregarCards(dados) {

    const grade = document.getElementById("gradeRegioes");

    grade.innerHTML = "";

    dados.cards.situacao_regioes.forEach(regiao => {

        const dc = regiao.datacenters[0];

        let classeStatus = "";

        if (regiao.status === "CRITICO") {
            classeStatus = "critico";
        }
        else if (regiao.status === "ATENCAO") {
            classeStatus = "atencao";
        }
        else {
            classeStatus = "normal";
        }

        grade.innerHTML += `
            <div class="card-regiao"
         onclick="abrirModalRegiao('${regiao.regiao}')">

                <div class="topo-card-regiao">
                    <span class="nome-regiao">${regiao.regiao}</span>
                    <span class="etiqueta ${classeStatus}">
                        ${regiao.status}
                    </span>
                </div>

                <div class="bloco-datacenter borda-${classeStatus}">
                    <div class="titulo-datacenter">${dc.nome}</div>

                    <div class="linha-metrica texto-critico">
                        ⚠️ ${dc.servidores_criticos} servidores críticos
                    </div>

                    <div class="linha-metrica texto-atencao">
                        ⚠️ ${dc.servidores_atencao} servidores em atenção
                    </div>

                    <div class="linha-metrica texto-normal">
                        ✅ ${dc.servidores_saudaveis} servidores saudáveis
                    </div>

                </div>

            </div>
        `;
    });
    
}

let dadosDashboardGlobal = null;

function abrirModalRegiao(nomeRegiao) {
    const dadosModal = dadosDashboardGlobal.modal.previsao_saturacao_regioes;

    const regiao = dadosModal.find(item => item.regiao === nomeRegiao);

    document.getElementById("modalTituloRegiao").innerText =
        `REGIÃO: ${regiao.regiao}`;

    document.getElementById("modalSaturacaoAtual").innerText =
        `${regiao.saturacao_atual}%`;

    document.getElementById("modalPrevisao").innerText =
        regiao.previsao;

    document.getElementById("modalComponenteCritico").innerText =
        `${regiao.componente_critico} (${regiao.valor_componente}%)`;

    document.getElementById("modalCapacidade").innerText =
        `${regiao.capacidade_disponivel}%`;

    document.getElementById("modalRegiao").style.display = "flex";
}

function fecharModalRegiao() {
    document.getElementById("modalRegiao").style.display = "none";
}

//Grafico ALertas ----------------------------------------------------------------------------------------------------------------
function carregarGraficoAlertas(dados) {
    const dadosGrafico = dados.graficos.volume_alertas_regiao;

    const labels = dadosGrafico.map(item => item.dia);

    const saoPaulo = dadosGrafico.map(item => item["São Paulo"]);
    const rio = dadosGrafico.map(item => item["Rio de Janeiro"]);
    const portoAlegre = dadosGrafico.map(item => item["Porto Alegre"]);

    const ctx = document.getElementById("graficoAlertas");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "São Paulo",
                    data: saoPaulo,
                    tension: 0.4
                },
                {
                    label: "Rio de Janeiro",
                    data: rio,
                    tension: 0.4
                },
                {
                    label: "Porto Alegre",
                    data: portoAlegre,
                    tension: 0.4
                }
            ]
        },

        options: {
    responsive: true,
    maintainAspectRatio: false,

    elements: {
        point: {
            radius: 4,
            hoverRadius: 6
        }
    },

    interaction: {
        mode: "index",
        intersect: false
    },

    plugins: {
        legend: {
            position: "bottom"
        }}}
    });
}



//Grafico top problemas por região---------------------------------------------------------------
function carregarGraficoTopProblemas(dados) {
    const ctxProblemas = document.getElementById("graficoTopProblemas").getContext("2d");

    const dadosJson = dados.graficos.top_problemas;

    const labels = dadosJson.map(item => item.regiao);

    const dadosProblemas = {
        labels: labels,
        datasets: [
            {
                label: "CPU alta",
                data: dadosJson.map(item => item.CPU),
                backgroundColor: "#ef4444"
            },
            {
                label: "Disco cheio",
                data: dadosJson.map(item => item.DISCO),
                backgroundColor: "#f59e0b"
            },
            {
                label: "RAM crítica",
                data: dadosJson.map(item => item.RAM),
                backgroundColor: "#a855f7"
            },
            {
                label: "Latência alta",
                data: dadosJson.map(item => item.LATENCIA),
                backgroundColor: "#3b82f6"
            },
            {
                label: "Perda pct.",
                data: dadosJson.map(item => item.PERDA_PACOTES),
                backgroundColor: "#94a3b8"
            }
        ]
    };

    new Chart(ctxProblemas, {
        type: "bar",
        data: dadosProblemas,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: "index",
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: {
                        color: "#64748b",
                        font: { family: "'Segoe UI', sans-serif" }
                    }
                },
                y: {
                    stacked: true,
                    min: 0,
                    ticks: {
                        stepSize: 100,
                        color: "#64748b"
                    },
                    grid: { color: "#f1f5f9" },
                    title: {
                        display: true,
                        text: "ocorr.",
                        color: "#94a3b8",
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}


//Grafico Trafego ----------------------------------------------------------------------------------------------------------------------
function carregarGraficoTrafego(dados) {

    const dadosGrafico =
        dados.graficos.distribuicao_trafego;

    const labels =
        dadosGrafico.map(item => item.regiao);

    const valores =
        dadosGrafico.map(item => item.percentual);

    const ctx =
        document.getElementById("graficoTrafego").getContext("2d");

    new Chart(ctx, {
        type: "pie",

        data: {
            labels: labels,

            datasets: [{
                data: valores,
                backgroundColor: [
                    "#3b82f6",
                    "#a855f7",
                    "#ffdf3e"
                ]
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,


            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return (
                                context.label +
                                ": " +
                                context.raw +
                                "%"
                            );
                        }
                    }
                }
            }
        }
    });
}