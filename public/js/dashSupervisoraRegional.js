
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("A")
    fetch("/dashSupervisora/obter-dashboard-supervisora")
        .then(response => response.json())
        .then(dados => {

            console.log("JSON carregado do S3");
            console.log(dados);

            dadosDashboardGlobal = dados;

            carregarKpis(dados);
            carregarCards(dados);
            carregarGraficoAlertas(dados);
            carregarGraficoTopProblemas(dados);
            carregarGraficoTrafego(dados);
        })
        .catch(error => {
            console.error("Erro ao carregar JSON do S3:", error);
        });

});

function nomeRegiao(sigla) {
    if (sigla === "SP") return "São Paulo";
    if (sigla === "RJ") return "Rio de Janeiro";
    if (sigla === "RS") return "Rio Grande do Sul";
    return sigla;
}

function aplicarStatusKpi(idCard, idIcone, idValor, status) {
    const card = document.getElementById(idCard);
    const icone = document.getElementById(idIcone);
    const valor = document.getElementById(idValor);

    card.classList.remove("kpi-normal", "kpi-atencao", "kpi-critico");

    if (status === "CRITICO") {
        card.classList.add("kpi-critico");
        icone.src = "/assets/dashboard-icons/icon_alerta.svg";

    } else if (status === "ATENCAO") {
        card.classList.add("kpi-atencao");
        icone.src = "/assets/dashboard-icons/icon_atencao.svg";

    } else {
        card.classList.add("kpi-normal");
        icone.src = "/assets/dashboard-icons/icon_check.svg";

    }
}
function carregarKpis(dados) {

   const risco = dados.kpis.risco_operacional.maior_risco;

document.getElementById("kpi_risco_regiao").innerText = nomeRegiao(risco.regiao);

document.getElementById("kpi_risco_score").innerText = `Score: ${risco.score}`;

    aplicarStatusKpi(
        "kpi_maior_risco_borda",
        "icone_risco",
        "kpi_risco_regiao",
        risco?.status || "NORMAL"
    );



    const instaveis = dados?.kpis?.regioes_instaveis;
    const qtdInstaveis = instaveis?.quantidade || 0;

    document.getElementById("kpi_regioes_instaveis_valor").innerText = qtdInstaveis;

    aplicarStatusKpi(
        "kpi_operando_borda",
        "icone_instaveis",
        "kpi_regioes_instaveis_valor",
        qtdInstaveis >= 2 ? "CRITICO" :
            qtdInstaveis === 1 ? "ATENCAO" :
                "NORMAL"
    );



    const recurso = dados?.kpis?.recurso_mais_pressionado;

    document.getElementById("kpi_capacidade_valor").innerText = recurso?.regiao ? recurso.componente : "Estável";
    document.getElementById("kpi_capacidade_regiao").innerText = recurso?.componente ? `${nomeRegiao(recurso.regiao)} - ${recurso.componente} em ${recurso.valor}%` : "Dentro do limite";

    const valorRecurso = recurso?.valor || 0;
    aplicarStatusKpi(
        "kpi_uptime_borda",
        "icone_recurso",
        "kpi_capacidade_valor",
        valorRecurso >= 90 ? "CRITICO" :
            valorRecurso >= 75 ? "ATENCAO" :
                "NORMAL"
    );

    const saturacao = dados?.kpis?.previsao_saturacao;
    document.getElementById("kpi_saturacao_valor").innerText = saturacao?.regiao ? nomeRegiao(saturacao.regiao) : "Seguro";
    document.getElementById("kpi_saturacao_tempo").innerText = saturacao?.tempo_formatado ? ` ${saturacao.tempo_formatado}` : "";

    const diasSaturar = saturacao?.dias_para_saturar ?? 999;

    aplicarStatusKpi(
        "kpi_saturacao_borda",
        "icone_saturacao",
        "kpi_saturacao_valor",
        diasSaturar <= 7 ? "CRITICO" :
            diasSaturar <= 20 ? "ATENCAO" :
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
         ">

                <div class="topo-card-regiao">
                    <span class="nome-regiao">${nomeRegiao(regiao.regiao)}</span>
                    <span class="etiqueta ${classeStatus}">
                        ${regiao.status}
                    </span>
                </div>

                <div class="bloco-datacenter borda-${classeStatus}">
                    <div class="titulo-datacenter">${dc.nome}</div>

                    <div class="linha-metrica texto-critico">
                         <img src="../assets/dashboard-icons/icon_alerta.svg" class="icone-status">
                         ${dc.servidores_criticos} servidores críticos
                    </div>

                    <div class="linha-metrica texto-atencao">
                        <img src="/assets/dashboard-icons/icon_atencao.svg" class="icone-status">
                         ${dc.servidores_atencao} servidores em atenção
                    </div>

                    <div class="linha-metrica texto-normal">
                        <img src="../assets/dashboard-icons/icon_check.svg" class="icone-status">
                        ${dc.servidores_saudaveis} servidores saudáveis
                    </div>

                </div>

            </div>
        `;
    });

}

let dadosDashboardGlobal = null;

function calcularLimiteCriticoAlertas(dadosGrafico) {

    const todosValores = [];

    dadosGrafico.forEach(item => {
        todosValores.push(item.SP || 0);
        todosValores.push(item.RJ || 0);
        todosValores.push(item.RS || 0);
    });

    const maiorValor = Math.max(...todosValores);

    return Math.round(maiorValor * 0.30);
}

//Grafico ALertas ----------------------------------------------------------------------------------------------------------------
function carregarGraficoAlertas(dados) {
    const dadosGrafico = dados.graficos.volume_alertas_regiao;

    const labels = dadosGrafico.map(item => item.dia);

    const saoPaulo = dadosGrafico.map(item => item["SP"]);
    const rio = dadosGrafico.map(item => item["RJ"]);
    const portoAlegre = dadosGrafico.map(item => item["RS"]);

    const limiteCritico = calcularLimiteCriticoAlertas(dadosGrafico);

    const ctx = document.getElementById("graficoAlertas");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "São Paulo",
                    data: saoPaulo,
                    tension: 0.4,
                    borderColor: "#66C0F4",
                    backgroundColor: "#66C0F4",
                    pointBackgroundColor: "#66C0F4"
                },
                {
                    label: "Rio de Janeiro",
                    data: rio,
                    tension: 0.4,
                    borderColor: "#2C5D86",
                    backgroundColor: "#2C5D86",
                    pointBackgroundColor: "#2C5D86"
                },
                {
                    label: "Rio Grande do Sul",
                    data: portoAlegre,
                    tension: 0.4,
                    borderColor: "#5316a2",
                    backgroundColor: "#5316a2",
                    pointBackgroundColor: "#5316a2"
                },
                {
                    label: "Limite crítico",
                    data: labels.map(() => limiteCritico),
                    borderColor: "#ef4444",
                    borderWidth: 2,
                    borderDash: [8, 5],
                    pointRadius: 0,
                    fill: false,
                    tension: 0,
                    order: 0
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
                },

                annotation: {
                    annotations: {
                        linhaCritica: {
                            type: "line",
                            yMin: limiteCritico,
                            yMax: limiteCritico,

                            borderColor: "#ef4444",
                            borderWidth: 2,
                            borderDash: [8, 5],

                            
                        }
                    }
                }
                ,
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}



//Grafico top problemas por região---------------------------------------------------------------
function carregarGraficoTopProblemas(dados) {
    const ctxProblemas = document.getElementById("graficoTopProblemas").getContext("2d");

    const dadosJson = dados.graficos.top_problemas;

    const labels = dadosJson.map(item => nomeRegiao(item.regiao));


    const dadosProblemas = {
        labels: labels,
        datasets: [
            {
                label: "CPU alta",
                data: dadosJson.map(item => item.CPU_PER),
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
                        text: "ocorrências",
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
        dadosGrafico.map(item => nomeRegiao(item.regiao));

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
                    "#66C0F4",
                    "#5316a2",
                    "#2C5D86"
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
                        label: function (context) {
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

const infoKpis = {
    risco: {
        titulo: "Região com Maior Risco",
        descricao: "Indica qual região apresenta o maior índice de risco operacional no período analisado.",
        normal: "Score abaixo de 40 indica operação estável.",
        atencao: "Score entre 40 e 69 indica necessidade de acompanhamento.",
        critico: "Score igual ou acima de 70 indica risco operacional elevado."
    },

    instaveis: {
        titulo: "Regiões Instáveis",
        descricao: "Mostra quantas regiões possuem concentração relevante de servidores em risco.",
        normal: "Nenhuma região instável.",
        atencao: "1 região instável.",
        critico: "2 ou mais regiões instáveis."
    },

    recurso: {
        titulo: "Recurso Mais Pressionado",
        descricao: "Identifica o recurso com maior utilização na última coleta dos servidores.",
        normal: "Uso abaixo de 75%.",
        atencao: "Uso entre 75% e 89%.",
        critico: "Uso igual ou acima de 90%."
    },

    saturacao: {
        titulo: "Região Próxima de Saturação",
        descricao: "Estima em quanto tempo uma região pode atingir o limite operacional.",
        normal: "Mais de 20 dias para saturar.",
        atencao: "Entre 8 e 20 dias para saturar.",
        critico: "7 dias ou menos para saturar."
    }
};

function abrirInfoKpi(tipo) {
    const info = infoKpis[tipo];

    document.getElementById("infoKpiTitulo").innerText = info.titulo;
    document.getElementById("infoKpiDescricao").innerText = info.descricao;
    document.getElementById("infoKpiNormal").innerText = info.normal;
    document.getElementById("infoKpiAtencao").innerText = info.atencao;
    document.getElementById("infoKpiCritico").innerText = info.critico;

    document.getElementById("modalInfoKpi").style.display = "flex";
}

function fecharInfoKpi() {
    document.getElementById("modalInfoKpi").style.display = "none";
}