function fnNavegar(caminho) {
    window.location.href = caminho
}

window.onload = () => {
    carregarDadosDashAlerta();
    carregarDadosDashAlerta2();
}

// if (!sessionStorage.ID_USUARIO) {
//     alert("Você precisa estar logado!");
//     window.location = "login.html";
// }

function buscarDados() {
    const idUsuario = sessionStorage.ID_USUARIO

    fetch(`/sessao/buscarUsuario/${idUsuario}`, {
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {
            dados = dados[0]

            username.innerHTML = dados.nomePessoa
            cargoname.innerHTML = dados.cargo
            dataCenterTitulo.innerHTML = dados.nomeDataCenter
            if (dados.imagem) {
                imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
            } else {
                imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
            }
        })
}

document.addEventListener("DOMContentLoaded", () => {
    const alerta = document.getElementById("Alerta");
    const distribuicao = document.getElementById("distribuicao");
    const mttr = document.getElementById("mttr")

    window.chartAlerta = new Chart(alerta, {
        type: "bar",
        data: {
            labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
            datasets: [
                {
                    label: "Baixo",
                    data: [9, 8, 12, 13],
                    backgroundColor: "#ffff00",
                    borderRadius: 6
                },
                {
                    label: "Medio",
                    data: [6, 7, 9, 8],
                    backgroundColor: "#FFA500",
                    borderRadius: 6
                },
                {
                    label: "Crítico",
                    data: [3, 2, 2, 1],
                    backgroundColor: "#FF5252",
                    borderRadius: 6
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de alertas por severidade (último mês)',
                    align: 'start',
                    font: {
                        size: 18
                    },
                },
                subtitle: {
                    display: true,
                    text: 'Máximo esperado: Baixos: 10 - 20 | Médios: 2 - 5 | Críticos: 0 - 1',
                    align: 'start',
                    font: {
                        size: 15
                    },
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 40,
                    ticks: {
                        stepSize: 15
                    }
                }
            }
        }
    });

    window.chartMttr = new Chart(mttr, {
        type: "bar",
        data: {
            labels: ["SERVIDOR-DH-01", "SERVIDOR-DH-02", "SERVIDOR-DH-03", "SERVIDOR-DH-04", "SERVIDOR-DH-05", "SERVIDOR-DH-06", "SERVIDOR-DH-07", "SERVIDOR-DH-08", "SERVIDOR-DH-09"],
            datasets: [
                {
                    label: "Baixo",
                    data: [9, 8, 12, 13, 10, 9, 3, 7, 8],
                    backgroundColor: "#ffff00",
                    borderRadius: 6
                },
                {
                    label: "Medio",
                    data: [6, 7, 9, 8, 10, 11, 15, 18, 9],
                    backgroundColor: "#FFA500",
                    borderRadius: 6
                },
                {
                    label: "Crítico",
                    data: [3, 2, 2, 1, 10, 11, 19, 20, 22],
                    backgroundColor: "#FF5252",
                    borderRadius: 6
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                title: {
                    display: true,
                    text: 'MTTR de cada servidor por tipo de alerta em Horas',
                    align: 'start',
                    font: {
                        size: 18
                    },
                },
                subtitle: {
                    display: true,
                    text: 'SLA Baixos : 24 | SLA Médios: 4 | SLA Críticos: 1',
                    align: 'start',
                    color: '#666',
                    font: {
                        size: 14,
                        family: 'Arial',
                        weight: 'normal'
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 60,
                    ticks: {
                        stepSize: 15
                    }
                }
            }
        }
    });

    window.chartDistribuicao = new Chart(distribuicao, {    
        type: "doughnut",
        data: {
            labels: ["CPU", "Disco", "RAM", "REDE"],
            datasets: [{
                data: [8, 19, 33, 30],
                backgroundColor: ["#3c59ea", "#4b8ae1", "#64aee5", "#b3e2ec"],
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "48%",
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        generateLabels(chart) {
                            const data = chart.data;
                            const labels = [];

                            labels.push({
                                text: `${data.labels[0]} ${data.datasets[0].data[0]}`,
                                fillStyle: data.datasets[0].backgroundColor[0],
                                index: 0
                            });
                            labels.push({
                                text: `${data.labels[1]} ${data.datasets[0].data[1]}`,
                                fillStyle: data.datasets[0].backgroundColor[1],
                                index: 1
                            });
                            labels.push({
                                text: `${data.labels[2]} ${data.datasets[0].data[2]}`,
                                fillStyle: data.datasets[0].backgroundColor[2],
                                index: 2
                            });
                            return labels;
                        }
                    },
                },
                title: {
                    display: true,
                    text: 'Distribuição de alertas por componentes (último mês)',
                    align: 'start',
                    font: {
                        size: 18
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Máximo esperado: 12 - 26',
                    align: 'start',
                    font: {
                        size: 15
                    }
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
});

function detalhes() {
    window.location = "dashServidorGestor.html"
}

function limparSessao() {
    sessionStorage.clear();
}



function navegarPara(caminho) {
  window.location.href = caminho;
}
async function carregarDadosDashAlerta() {
    try {
        const respostaS3 = await fetch('/alertas/obter-url-s3');

        if (!respostaS3.ok) {
            throw new Error('Erro ao carregar dados do s3');
        }

        const dadosDashboard = await respostaS3.json();

        console.log("Dados recebidos:", dadosDashboard);

        renderizarDadosDash(dadosDashboard);

    } catch (error) {
        console.log("Houve um erro na função carregarDadosDashAlerta: " + error);
    }
}

async function atualizarDados() {
    try {
        const respostaS3 = await fetch('/alertas/obter-url-s3');

        if (!respostaS3.ok) {
            throw new Error('Erro ao atualizar dados do S3');
        }

        const dadosAtualizados = await respostaS3.json();

        renderizarDadosDash(dadosAtualizados);
    } catch (error) {
        console.log("Erro ao atualizar:", error);
    }
    
}
/*===================================================================================== */

async function carregarDadosDashAlerta2() {
    try {
        const respostaS3 = await fetch('/alertas2/obter-url-s3');

        if (!respostaS3.ok) {
            throw new Error('Erro ao carregar dados do s3');
        }

        const dadosDashboard2 = await respostaS3.json();

        console.log("Dados recebidos 2:", dadosDashboard2);

        renderizarDadosDash2(dadosDashboard2);

    } catch (error) {
        console.log("Houve um erro na função carregarDadosDashAlerta2: " + error);
    }
}

async function atualizarDados2() {
    try {
        const respostaS3 = await fetch('/alertas2/obter-url-s3');

        if (!respostaS3.ok) {
            throw new Error('Erro ao atualizar alertas do S3');
        }

        const dadosAtualizados2 = await respostaS3.json();

        renderizarDadosDash2(dadosAtualizados2);
    } catch (error) {
        console.log("Erro ao atualizar 2:", error);
    }
}

async function renderizarDadosDash(dadosDashboard) {
    let data = sessionStorage.getItem('DATA');
    let regiao = sessionStorage.getItem('REGIAO')

    if (!data) {
        console.log("Datacenter não selecionado.");
        return;
    }

    if(!regiao){
        console.log("Região não foi selecionada!");
        return;
    }

    let caminho = dadosDashboard.região[regiao][data];

    /* ========================= GRÁFICOS =========================*/
    /* ======================== MTTR SERVER =======================*/
    const mttrServer = window.chartMttr;

    const dados = caminho.mttr_por_servidor;
    const listaMttrBaixo = dados.map(item => Number((item.baixo / 60).toFixed(2)));
    const listaMttrMedio = dados.map(item => Number((item.medio / 60).toFixed(2)));
    const listaMttrCritico = dados.map(item => Number((item.critico / 60).toFixed(2)));
    const listaMttrLabels = dados.map(item => item.servidor);

    if (mttrServer) {
        mttrServer.data.labels = listaMttrLabels;
        mttrServer.data.datasets[0].data = listaMttrBaixo;
        mttrServer.data.datasets[1].data = listaMttrMedio;
        mttrServer.data.datasets[2].data = listaMttrCritico;
        mttrServer.update();
    }
    /* ====================== ============ =======================*/
    /* ======================== SUB KPIs =========================*/
    const subBaixo = document.getElementById("maiorB")
    const subMedio = document.getElementById("maiorM")
    const subCritico = document.getElementById("maiorC")
    const subMelhorC = document.getElementById("melhor")

    const maxB = Math.max(...listaMttrBaixo);
    const maxM = Math.max(...listaMttrMedio);
    const maxC = Math.max(...listaMttrCritico);
    const minC = Math.min(...listaMttrCritico);

    const indiceB = listaMttrBaixo.indexOf(maxB);
    const indiceM = listaMttrMedio.indexOf(maxM);
    const indiceC = listaMttrCritico.indexOf(maxC);
    const indiceCmin = listaMttrCritico.indexOf(minC);

    subBaixo.innerHTML = listaMttrLabels[indiceB];
    subMedio.innerHTML = listaMttrLabels[indiceM];
    subCritico.innerHTML = listaMttrLabels[indiceC];
    subMelhorC.innerHTML = listaMttrLabels[indiceCmin];

    renderizarSla(dadosDashboard, data, regiao)
}

async function renderizarDadosDash2(dadosDashboard2) {
    let data = sessionStorage.getItem('DATA');
    let regiao = sessionStorage.getItem('REGIAO');

    if (!data) {
        console.log("Datacenter não selecionada.");
        return;
    }

    if (!regiao) {
        console.log("Região não selecionada.");
        return;
    }

    const empresa = dadosDashboard2["Steam"];

    if (!empresa || !empresa[regiao]) {
        console.log("Dados da região não encontrados.");
        return;
    }

    let caminho = empresa[regiao][data];
    /* ========================== KPIs ========================== */
    const kpiCriticoAberto = document.getElementById("qtdCriticos");
    const kpiMedioAverto = document.getElementById("qtdMedios");
    const kpiBaixoAberto = document.getElementById("qtdBaixos");
    const KpiResolvidos = document.getElementById("qtdResolvidos");
    const kpiNomeServer = document.getElementById("nomeServer");
    const subKpiQtdAlerta = document.getElementById("qtdAlertaServer");

    kpiCriticoAberto.innerHTML = caminho.KPIs.CRITICOS_ABERTOS ? caminho.KPIs.CRITICOS_ABERTOS : 0;
    kpiMedioAverto.innerHTML = caminho.KPIs.MEDIOS_ABERTOS;
    kpiBaixoAberto.innerHTML = caminho.KPIs.BAIXOS_ABERTOS;
    KpiResolvidos.innerHTML = caminho.KPIs.RESOLVIDOS_24H;
    kpiNomeServer.innerHTML = caminho.KPIs.SERVIDOR_MAIS_ALERTAS;

    const contagemPorServidor = {};

    const alertasAtivos = caminho.ALERTAS_ATIVOS;

    alertasAtivos.forEach(alerta => {
        const nomeServer = alerta.servidor;
        contagemPorServidor[nomeServer] = (contagemPorServidor[nomeServer] || 0) + 1;
    });

    let servidorMaisCritico = "Nenhum";
    let maiorNumeroDeAlertas = 0;

    for (const servidor in contagemPorServidor) {
        if (contagemPorServidor[servidor] > maiorNumeroDeAlertas) {
            maiorNumeroDeAlertas = contagemPorServidor[servidor];
            servidorMaisCritico = servidor;
        }
    }

    subKpiQtdAlerta.innerHTML = maiorNumeroDeAlertas
    /* ========================= GRÁFICOS =========================*/
    /* ======================== COMPONENTE ========================*/
    const graficoComponente = window.chartDistribuicao;

    const nomesComponente = Object.keys(caminho.GRAFICOS.ALERTAS_POR_COMPONENTE);
    const numerosComponente = Object.values(caminho.GRAFICOS.ALERTAS_POR_COMPONENTE);

    if (graficoComponente) {

        const nomesComponente =
            Object.keys(caminho.GRAFICOS.ALERTAS_POR_COMPONENTE);

        const numerosComponente =
            Object.values(caminho.GRAFICOS.ALERTAS_POR_COMPONENTE);

        graficoComponente.data.labels =
            nomesComponente;

        graficoComponente.data.datasets[0].data =
            numerosComponente;

        graficoComponente.update();
    }
    /* =========================================================*/
    /* ======================== SEMANA =========================*/
    const graficoSemana = window.chartAlerta;

    const dados = caminho.GRAFICOS.ALERTAS_POR_SEMANA || [];
    const listaBaixo = dados.map(item => item.baixo);
    const listaMedio = dados.map(item => item.medio);
    const listaCritico = dados.map(item => item.critico);
    const listaLabels = dados.map(item => item.semana);

    if (graficoSemana) {
        graficoSemana.data.labels = listaLabels;
        graficoSemana.data.datasets[0].data = listaBaixo;
        graficoSemana.data.datasets[1].data = listaMedio;
        graficoSemana.data.datasets[2].data = listaCritico;
        graficoSemana.update();
    }

    /* =========================================================*/

    renderizarCardsAlertas(dadosDashboard2, data, regiao);
}

function renderizarCardsAlertas(dadosDashboard2, data, regiao) {
    const listaAlertasContainer = document.querySelector(".div_alertas");
    const alertasAtivos = dadosDashboard2["Steam"][regiao][data].ALERTAS_ATIVOS;

    listaAlertasContainer.innerHTML = "";

    alertasAtivos.forEach(alerta => {

        const corSeveridade = alerta.severidade === 'critico' ? '#FF5252' : '#FFA500';

        listaAlertasContainer.innerHTML += `
            <div class="card_alerta">
                <div class="titulo_card_alerta">
                    <div class="cards1">
                        <div class="icon_titulo_card_alerta">
                            <img src="../assets/Icon_alerta.png" alt="">
                        </div>
                        <div class="titulo_texto_card_alerta">
                            <h1>${alerta.componente} ACIMA DE ${alerta.threshold_momento}%</h1>
                        </div>
                    </div>
                    <div class="cards">
                        <div class="status_titulo_card_alerta">
                            <h1 style="color: ${corSeveridade}">${alerta.severidade.toUpperCase()}</h1>
                        </div>
                        <div class="componente_titulo_card_alerta">
                            <h1>${alerta.componente}</h1>
                        </div>
                    </div>
                </div>
                <div class="identificação_servidor">
                    <img src="../assets/icon_servidor.png" alt="">
                    <h1>${alerta.servidor} - ${alerta.zona}</h1>
                </div>
                <div class="botoes_card_alerta">
                    <button style="background-color: #6B7280; color: white; font-weight: 550;"
                        onclick="verDetalhe(window.location.href = "dashServidorGestor.html")">Ver detalhe</button>
                </div>
            </div>
        `;
    });
}

function renderizarSla(dadosDashboard, data, regiao) {
    const containerNome = document.getElementById("nomesAnalistas");
    const containerMttr = document.getElementById("mttrMedios");
    const containerResolvidos = document.getElementById("resolvidosSLA");
    const containerPercentual = document.getElementById("percentual");

    containerNome.innerHTML = `
        <div class="subtitulo">Analista:</div>
    `;
    containerMttr.innerHTML = `
        <div class="subtitulo">MTTR médio:</div>
    `;
    containerResolvidos.innerHTML = `
        <div class="subtitulo">Resolvidos | na SLA</div>
    `;
    containerPercentual.innerHTML = `
        <div class="subtitulo">% de chamados dentro da SLA:</div> 
    `;

    const listaMttr = dadosDashboard.região[regiao][data].mttr_por_servidor; 
    const listaSla = dadosDashboard.região[regiao][data].sla_por_analista; 

    
    listaSla.forEach((analistaSla) => {
        
        const dadosMttrCorrespondente = listaMttr.find(
            (analistaMttr) => analistaMttr.nomeAnalista === analistaSla.nomeAnalista
        );

        const mttrMedio = dadosMttrCorrespondente ? dadosMttrCorrespondente.mttrMedio : "N/A";

        containerNome.innerHTML += `
            <div class="item">
                <img src="../assets/dashAlerta/user.png">
                <span>${analistaSla.nomeAnalista}</span>
            </div>
        `;

        containerMttr.innerHTML += `
            <div class="item">
                <img src="../assets/dashAlerta/medio.png">
                <span>${mttrMedio}</span>
            </div>
        `;

        containerResolvidos.innerHTML += `
            <div class="item mttr-group">
                <img src="../assets/dashAlerta/baixo.png">
                <div class="baixo">${analistaSla.totalChamados}</div> |
                <img src="../assets/dashAlerta/medio.png">
                <div class="medio">${analistaSla.dentroSla}</div>
            </div>
        `;

        containerPercentual.innerHTML += `
            <div class="item">
                <img src="../assets/icon/.png" alt="">
                <span>${analistaSla.percentual}%</span>
            </div>
        `;
    });
}
