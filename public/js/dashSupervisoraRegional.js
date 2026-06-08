fetch("/dashSupervisora/obter-dashboard-supervisora")
    .then(response => response.json())
    .then(dado => fetch(dado.url))
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

    // Região com maior risco
    const risco = dados.kpis.risco_operacional.maior_risco;

    document.getElementById("kpi_risco_regiao").innerText =
        nomeRegiao(risco.regiao);

    aplicarStatusKpi(
        "kpi_maior_risco_borda",
        "icone_risco",
        "kpi_risco_regiao",
        risco.status
    );


    // Regiões instáveis
    const instaveis = dados.kpis.regioes_instaveis;

    document.getElementById("kpi_regioes_instaveis_valor").innerText =
        instaveis.quantidade;

    aplicarStatusKpi(
        "kpi_operando_borda",
        "icone_instaveis",
        "kpi_regioes_instaveis_valor",
        instaveis.quantidade >= 2 ? "CRITICO" :
        instaveis.quantidade == 1 ? "ATENCAO" :
        "NORMAL"
    );


    // Recurso mais pressionado
    const recurso = dados.kpis.recurso_mais_pressionado;

    document.getElementById("kpi_capacidade_valor").innerText =
        nomeRegiao(recurso.regiao);

    document.getElementById("kpi_capacidade_regiao").innerText =
        `${recurso.componente} em ${recurso.valor}%`;

    aplicarStatusKpi(
        "kpi_uptime_borda",
        "icone_recurso",
        "kpi_capacidade_valor",
        recurso.valor >= 90 ? "CRITICO" :
        recurso.valor >= 75 ? "ATENCAO" :
        "NORMAL"
    );


    // Região próxima de saturação
    const saturacao = dados.kpis.previsao_saturacao;

    document.getElementById("kpi_saturacao_valor").innerText =
        nomeRegiao(saturacao.regiao);;

    document.getElementById("kpi_saturacao_tempo").innerText =
        `: ${saturacao.tempo_formatado}`;

    aplicarStatusKpi(
        "kpi_saturacao_borda",
        "icone_saturacao",
        "kpi_saturacao_valor",
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


//Grafico ALertas ----------------------------------------------------------------------------------------------------------------
function carregarGraficoAlertas(dados) {
    const dadosGrafico = dados.graficos.volume_alertas_regiao;

    const labels = dadosGrafico.map(item => item.dia);

    const saoPaulo = dadosGrafico.map(item => item["SP"]);
    const rio = dadosGrafico.map(item => item["RJ"]);
    const portoAlegre = dadosGrafico.map(item => item["RS"]);

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
                        font: { family: "'Segoe UI', sans-serif"}
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