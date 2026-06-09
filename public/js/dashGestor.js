window.onload = () => {
    buscarDados();
    atualizarDiaSemana();
    iniciarDashOperacional();
};

if (!sessionStorage.ID_USUARIO) {
    conteiner_msg.innerHTML = "Você precisa estar logado!"
    loadingModal()
    window.location = "login.html";
}

function voltar(){
    window.location.href = 'inicioGestor.html';

}

function atualizarDiaSemana() {
    const dataAtual = new Date();
    const cidadeSessao = sessionStorage.getItem("ESTADO") || "Região";

    const diasDaSemana = [
        "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    ];

    const mesesDoAno = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const nomeDia = diasDaSemana[dataAtual.getDay()];
    const diaDoMes = dataAtual.getDate();
    const nomeMes = mesesDoAno[dataAtual.getMonth()];
    const ano = dataAtual.getFullYear();

    const spanCidade = document.getElementById("cidadeSelecionada");
    const spanDiaSemana = document.getElementById("diaSemanaAtual");

    if (spanCidade) {
        spanCidade.innerHTML = cidadeSessao;
    }

    if (spanDiaSemana) {
        spanDiaSemana.innerHTML = `${nomeDia}, ${diaDoMes} de ${nomeMes} de ${ano}`;
    }
}

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
        if (dados.imagem) {
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })
}
//------------------------------------------------ CHAMANDO DADOS DO BUCKET E RENDERIZANDO ----------------------------------------------------------
let dadosGestoraOp = null;
let datacentersGestor = [];
let datacenterSelecionado = null;
const nomeEmpresa = sessionStorage.getItem("NOME_EMPRESA") || "Steam";

async function iniciarDashOperacional() {
    const carregou = await carregarJsonGestoraOp();
    if (!carregou) {
        return;
    }
    await carregarDatacentersDoGestor();
    iniciarAtualizacaoAutomatica();
}

function iniciarAtualizacaoAutomatica() {
    if (intervaloAtualizacaoDash) {
        clearInterval(intervaloAtualizacaoDash);
    }
    intervaloAtualizacaoDash = setInterval(
        atualizarDashboardAutomaticamente,
        INTERVALO_ATUALIZACAO_DASH
    );
}
async function carregarJsonGestoraOp() {
    try {
        const resposta = await fetch(
            `/dashOperacional/buscarGestoraOpJson?t=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            console.error("Erro ao buscar JSON da gestora:",erro);
            return false;
        }

        dadosGestoraOp = await resposta.json();

        console.log("JSON atualizado:",new Date().toLocaleTimeString(),dadosGestoraOp);
        return true;
    } catch (erro) {
        console.error("Erro geral ao carregar JSON da gestora:",erro);
        return false;
    }
}

// carregamento automático

const INTERVALO_ATUALIZACAO_DASH = 30000;

let intervaloAtualizacaoDash = null;
let atualizacaoEmAndamento = false;

async function atualizarDashboardAutomaticamente() {
    if (atualizacaoEmAndamento) {
        return;
    }
    atualizacaoEmAndamento = true;

    try {
        const atualizou = await carregarJsonGestoraOp();
        if (!atualizou) {
            return;
        }
        if (datacenterSelecionado) {
            renderizarGraficosEKpisDatacenter(datacenterSelecionado);
        }
    } catch (erro) {
        console.error("Erro ao atualizar dashboard:",erro);
    } finally {
        atualizacaoEmAndamento = false;
    }
}
function encontrarDatacenterMaisCritico(datacentersPermitidos) {
    if (!dadosGestoraOp || !dadosGestoraOp.empresas) {
        console.error("JSON da gestora ainda não carregado.");
        return null;
    }

    const empresa = dadosGestoraOp.empresas[nomeEmpresa];

    if (!empresa || !empresa.datacenters) {
        console.error("Empresa ou datacenters não encontrados no JSON.");
        return null;
    }

    let piorDatacenter = null;
    let piorScore = 101;

    datacentersPermitidos.forEach(dc => {
        const nomeDc = dc.nome;
        const dadosDc = empresa.datacenters[nomeDc];

        if (!dadosDc) {
            console.warn("Datacenter não encontrado no JSON:", nomeDc);
            return;
        }

        const score = Number(dadosDc.score);

        if (!Number.isNaN(score) && score < piorScore) {
            piorScore = score;
            piorDatacenter = dc;
        }
    });

    return piorDatacenter;
}

function carregarDatacentersDoGestor() {
    const idUsuario = sessionStorage.getItem("ID_USUARIO");
    const idRegiao = sessionStorage.getItem("ID_REGIAO");
    const selectDatacenter = document.getElementById("selectDatacenter");

    if (!idUsuario) {
        console.error("ID_USUARIO não encontrado no sessionStorage");
        return;
    }

    if (!idRegiao) {
        console.error("ID_REGIAO não encontrado no sessionStorage");
        return;
    }

    if (!selectDatacenter) {
        console.error("selectDatacenter não encontrado no HTML");
        return;
    }

    fetch(`/dashOperacional/listarDatacenters/${idUsuario}/${idRegiao}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Erro ao buscar datacenters do gestor");
            }

            return resposta.json();
        })
        .then(datacenters => {
            datacentersGestor = datacenters;

            selectDatacenter.innerHTML = `
                <option value="" disabled>Selecione um datacenter</option>
            `;

            datacenters.forEach(dc => {
                selectDatacenter.innerHTML += `
                    <option value="${dc.nome}" data-id="${dc.fk_datacenter}">
                        ${dc.nome}
                    </option>
                `;
            });

            const datacenterMaisCritico = encontrarDatacenterMaisCritico(datacenters);

            if (datacenterMaisCritico) {
                selectDatacenter.value = datacenterMaisCritico.nome;
                selecionarDatacenter(datacenterMaisCritico.nome);
            }
        })
        .catch(erro => {
            console.error("Erro ao carregar datacenters:", erro);
        });
}

function selecionarDatacenter(nomeDatacenter) {
    if (!nomeDatacenter) {
        return;
    }

    datacenterSelecionado = nomeDatacenter;
    sessionStorage.setItem("DATACENTER_SELECIONADO", nomeDatacenter);

    renderizarGraficosEKpisDatacenter(nomeDatacenter);
}

//-------------------------------------------------- KPIS RENDERIZANDO ----------------------------------------------------------------------------
function renderizarGraficosEKpisDatacenter(nomeDatacenter) {
    if (!dadosGestoraOp || !dadosGestoraOp.empresas) {
        console.error("JSON da gestora não carregado.");
        return;
    }

    const empresa = dadosGestoraOp.empresas[nomeEmpresa];

    if (!empresa || !empresa.datacenters) {
        console.error("Datacenters não encontrados no JSON.");
        return;
    }

    const datacenter = empresa.datacenters[nomeDatacenter];

    if (!datacenter) {
        console.error("Datacenter não encontrado no JSON:", nomeDatacenter);
        return;
    }

    console.log("Renderizando KPIs do datacenter:", nomeDatacenter, datacenter);

    atualizarKpiScore(datacenter);
    atualizarkpiCrescimentoAlertas(datacenter);
    atualizarKpiUptime(datacenter);
    atualizarKpiServidoresCriticos(datacenter);
    renderizarRankingServidoresCriticos(datacenter);
    renderizarTendenciaDegradacao(datacenter);
    renderizarUptimeServidores(datacenter);
    renderizarGraficoSaudeZonas(datacenter);
    renderizarGraficoAlertas(datacenter);
    atualizarTendenciaAlertas(datacenter);

}
function atualizarKpiScore(datacenter) {
    const score = Number(datacenter.score ?? 0).toFixed(0);
    const status = datacenter.status ?? converterScoreParaStatus(score);

    document.getElementById("scoreDatacenter").innerHTML = score;

    atualizarIconeStatus("statusKpiScore", status);
    atualizarEstiloKpi("kpiScoreSaude", status);
}

function atualizarkpiCrescimentoAlertas(datacenter) {
    const kpi = datacenter.kpiCrescimentoAlertas;

    if (!kpi) {
      document.getElementById("variacaoAlertas").innerHTML = 0;
        document.getElementById("comparacaoAlertas").innerHTML ="→ Sem alerta captado nos último 30 minutos.";
        atualizarIconeStatus("statusKPICresc", 0, 5, 15);
        atualizarEstiloKpi("kpiCrescimentoAlertas", "Estável");
        return;
    }

    const atual = kpi.alertasIntervaloAtual ?? 0;
    const anterior = kpi.alertasIntervaloAnterior ?? 0;
    const diferenca = atual - anterior;
    const percentual = kpi.percentual ?? 0;


    let status;

    if (diferenca <= 0) {
    status = "Estável"; 
    }
    else if (diferenca <= 3) {
        status = "Atenção"; 
    }
    else {
        status = "Crítico"; 
    }
    document.getElementById("variacaoAlertas").innerHTML = atual;
   
    if (diferenca > 0) {
        document.getElementById("comparacaoAlertas").innerHTML =
            `↑ +${diferenca} em relação aos 30 min anteriores`;
    } else if (diferenca < 0) {
        document.getElementById("comparacaoAlertas").innerHTML =
            `↓ ${diferenca} em relação aos 30 min anteriores`;
    } else {
        document.getElementById("comparacaoAlertas").innerHTML =
            "→ Sem alerta captado nos último 30 minutos.";
    }
    atualizarIconeStatus("statusKPICresc", status);
    atualizarEstiloKpi("kpiCrescimentoAlertas", status);
  
}

function atualizarKpiUptime(datacenter) {
    const kpi = datacenter.kpiUptime;

    if (!kpi) {
        document.getElementById("qntServComUptimeBaixo").innerHTML = 0;
        document.getElementById("totalSrvUptime").innerHTML = 0;
        document.getElementById("porcentagemServComBaixoUpt").innerHTML = 0;

        atualizarIconeStatusPercentual("statusMenorUpt", 0, 10, 25);
        atualizarEstiloKpi("kpiServidoresInstaveis", "Estável");
        return;
    }

    const quantidadeAbaixoIdeal = kpi.servidoresAbaixoIdeal ?? 0;
    const totalServidores = kpi.totalServidores ?? 0;
    const percentualAbaixoIdeal = Number(kpi.percentualAbaixoIdeal ?? 0);
    const percentualFormatado = percentualAbaixoIdeal.toFixed(2);

    const status = classificarPercentual(percentualAbaixoIdeal,10,25);

    qntServComUptimeBaixo.innerHTML = quantidadeAbaixoIdeal;
    totalSrvUptime.innerHTML = totalServidores;
    porcentagemServComBaixoUpt.innerHTML = `${percentualFormatado}%`;


    atualizarIconeStatusPercentual("statusMenorUpt", percentualAbaixoIdeal, 10, 25);
    atualizarEstiloKpi("kpiServidoresInstaveis", status);
}

function atualizarKpiServidoresCriticos(datacenter) {
    const kpi = datacenter.kpiServidoresCriticos;

    if (!kpi) {
        document.getElementById("qntSrvComAlertas").innerHTML = 0;
        document.getElementById("totalSrvCriticos").innerHTML = 0;
        document.getElementById("porcentSrvCritic").innerHTML = 0;

        atualizarIconeStatusPercentual("statusSrvCriticos", 0, 10, 25);
        atualizarEstiloKpi("kpiServidoresCriticos", "Estável");
        return;
    }

    const percentual = kpi.percentualCriticos ?? 0;
    const status = classificarPercentual(percentual, 10, 25);

    document.getElementById("qntSrvComAlertas").innerHTML = kpi.qtdCriticos ?? 0;
    document.getElementById("totalSrvCriticos").innerHTML = kpi.totalServidores ?? 0;
    document.getElementById("porcentSrvCritic").innerHTML = percentual;

    atualizarIconeStatusPercentual("statusSrvCriticos", percentual, 10, 25);
    atualizarEstiloKpi("kpiServidoresCriticos", status);
}

//---------------------------------------- CLASSIFICACAO KPIS E MUDANÇA DE ICONES-----------------------------------------------------------------
function classificarPercentual(valor, limiteAtencao, limiteCritico) {
    const percentual = Number(valor);

    if (Number.isNaN(percentual)) {
        return "Indefinido";
    }

    if (percentual <= limiteAtencao) {
        return "Estável";
    }

    if (percentual <= limiteCritico) {
        return "Atenção";
    }

    return "Crítico";
}

function converterScoreParaStatus(score) {
    const scoreNum = Number(score);

    if (Number.isNaN(scoreNum)) {
        return "Indefinido";
    }

    if (scoreNum >= 80) {
        return "Saudável";
    }

    if (scoreNum >= 60) {
        return "Atenção";
    }

    return "Crítico";
}

function atualizarIconeStatus(idImagem, status) {
    const imagem = document.getElementById(idImagem);

    if (!imagem) {
        return;
    }

    const statusNormalizado = String(status)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

        if (statusNormalizado === "saudavel" ||statusNormalizado === "estavel") {
        imagem.src = "../assets/dashboard-icons/icon_check.svg";
        imagem.alt = "Saudável";
    }
    else if (statusNormalizado === "atencao") {
        imagem.src = "../assets/dashboard-icons/icon_atencao.svg";
        imagem.alt = "Atenção";
    }
    else {
        imagem.src = "../assets/dashboard-icons/icon_alerta.svg";
        imagem.alt = "Crítico";
    }
}


function atualizarIconeStatusPercentual(idImagem, valor, limiteAtencao, limiteCritico) {
    const imagem = document.getElementById(idImagem);

    if (!imagem) {
        return;
    }

    const percentual = Number(valor);

    if (Number.isNaN(percentual)) {
        imagem.src = "../assets/dashboard-icons/icon_alerta.svg";
        imagem.alt = "Indefinido";
        return;
    }

    if (percentual <= limiteAtencao) {
        imagem.src = "../assets/dashboard-icons/icon_check.svg";
        imagem.alt = "Estável";
    } else if (percentual <= limiteCritico) {
        imagem.src = "../assets/dashboard-icons/icon_atencao.svg";
        imagem.alt = "Atenção";
    } else {
        imagem.src = "../assets/dashboard-icons/icon_alerta.svg";
        imagem.alt = "Crítico";
    }
}


function atualizarEstiloKpi(idKpi, status) {
    const kpi = document.getElementById(idKpi);

    if (!kpi) {
        return;
    }

    kpi.classList.remove(
        "kpi-saudavel",
        "kpi-atencao",
        "kpi-critico",
        "kpi-indefinido"
    );

    const statusNormalizado = String(status)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (statusNormalizado === "saudavel" || statusNormalizado === "estavel") {
        kpi.classList.add("kpi-saudavel");
    } else if (statusNormalizado === "atencao") {
        kpi.classList.add("kpi-atencao");
    } else if (statusNormalizado === "critico") {
        kpi.classList.add("kpi-critico");
    } else {
        kpi.classList.add("kpi-indefinido");
    }
}

function definirClasseUptime(uptime) {
    const valorUptime = Number(uptime);

    if (valorUptime < 95) {
        return "uptime_critico";
    }

    if (valorUptime < 99) {
        return "uptime_atencao";
    }
    return "uptime_saudavel";
}

function definirClasseUptimeItem(uptime) {
    const valorUptime = Number(uptime);

    if (valorUptime < 95) {
        return "uptime_critico_item";
    }

    if (valorUptime < 99) {
        return "uptime_atencao_item";
    }
    return "uptime_saudavel_item";
}

function definirClasseUptimeP(uptime) {
    const valorUptime = Number(uptime);

    if (valorUptime < 95) {
        return "uptime_critico_p";
    }

    if (valorUptime < 99) {
        return "uptime_atencao_p";
    }
    return "uptime_saudavel_p";
}
//--------------------------------------------------------- WIDGETS SRV: CRITICOS E PREVISAO DE DEGRADAÇÃO ---------------------------------------

function renderizarRankingServidoresCriticos(datacenter) {
    const lista = document.getElementById("listaRankingServidoresCriticos");

    if (!lista) {
        console.error("Container listaRankingServidoresCriticos não encontrado no HTML.");
        return;
    }

    const ranking = datacenter.rankingSrv || [];

    lista.innerHTML = "";

    if (ranking.length === 0) {
        lista.innerHTML = `
            <div class="item_servidor">
                <p>Nenhum servidor crítico encontrado</p>
                <span class="status-servidor servidor-indefinido">● Sem dados disponíveis</span>
            </div>
        `;
        return;
    }

    ranking.forEach((servidor, index) => {
        const nomeServidor = servidor.servidor || "Servidor não identificado";
        const zona = servidor.zona || "Zona não informada";
        const score = servidor.score ?? 0;
        const status = servidor.status || "Indefinido";
        const classeStatus = obterClasseStatusServidor(status);
        console.log("Ranking servidor:", {
            nomeServidor,
            status,
            classeStatus
        });
        const componentesCritico = servidor.componentesCriticidade || [];

        let textoComponentes = "";

        if (componentesCritico.length === 0) {
            textoComponentes = `<p>Nenhum componente ficou acima do limite de forma relevante.</p>`;
        } else {
            componentesCritico.forEach(componente => {
                const nomeComponente = (componente.componente || "Componente").toUpperCase();;
                const persistencia = componente.persistencia ?? 0;
                textoComponentes += `
                <p>
                    ${nomeComponente}: ${persistencia}% das coletas acima do limite
                </p>
            `;
            });
        }

        lista.innerHTML += `
    <div class="item_servidor item_tendencia"  >
         
       
        <div class="item">
            <p>${index + 1}° ${nomeServidor}</p>

            <span class="status-servidor ${classeStatus}">
                ● Score: ${score} | ${zona}
            </span>
        </div>

        <div class="tooltip-tendencia">
             <h4>Motivo do Score</h4>
            ${textoComponentes}
        </div>
    </div>
`;
     });
}
function obterClasseStatusServidor(status) {
    const statusNormalizado = String(status || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (statusNormalizado.includes("saudavel")) {
        return "servidor-saudavel";
    }

    if (statusNormalizado.includes("atencao")) {
        return "servidor-atencao";
    }

    if (statusNormalizado.includes("critico")) {
        return "servidor-critico";
    }

    return "servidor-indefinido";
}

function renderizarTendenciaDegradacao(datacenter) {
    const lista = document.getElementById("listaRiscoDegradacao");

    if (!lista) {
        console.error("Container listaRiscoDegradacao não encontrado no HTML.");
        return;
    }

    const servidores = datacenter?.rankingTendenciaServidores || [];

    lista.innerHTML = "";

    if (servidores.length === 0) {
        lista.innerHTML = `
            <div class="item_servidor item_tendencia">
                <p>Nenhum servidor com tendencia de degradação identificado</p>
            </div>
        `;
        return;
    }

    servidores.forEach((servidor, index) => {
        const nomeServidor = servidor.servidor || "Servidor não identificado";
        const tendencia = servidor.tendenciaDegradacao;
        const componentes = tendencia.componentesTendencia || [];
        const principal = componentes[0] || {};
        const nomeComponente = principal.componente || "N/A";
        const aumento = Number(principal.aumentoPersistencia || 0).toFixed(0);
        const persistenciaAtual =Number(principal.persistenciaAtual || 0).toFixed(0);
        const spann = document.querySelector(".status");
        
                    lista.innerHTML += `
                <div  class="  item_servidor  item_tendencia " >
                    <div class="item">
                        <p>
                            ${index + 1}º
                            ${servidor.servidor}
                        </p>

                        <span  class="status" >
                            ${nomeComponente}
                            <b>+${aumento} p.p. </b>
                        </span>
                    </div>

                    <div class="tooltip-tendencia" >
                        <h4>
                            Motivo do risco
                        </h4>

                        <p>
                            ${tendencia.motivo}
                        </p>

                        <p>
                            Persistência atual:
                            <b>${persistenciaAtual}%</b>
                        </p>
                        <p>
                        Nível de risco: <b>${tendencia.nivelRisco}</b>
                        </p>

                    </div>
                </div>
            `;
});
}

const saudeZonas = []
const nomesZonas = []
function renderizarUptimeServidores(datacenter) {
    const lista = document.getElementById(
        "listaUptimeServidores"
    );

    if (!lista) {
        console.error(
            "Container listaUptimeServidores não encontrado no HTML."
        );
        return;
    }

    lista.innerHTML = "";


    const servidores = datacenter?.uptimeServidores || [];

    if (servidores.length === 0) {
        lista.innerHTML = `
            <div class="item_servidor item_tendencia">
                <p>Nenhum servidor encontrado</p>

                <span class="status-servidor servidor-indefinido">
                    ● Sem dados disponíveis
                </span>
            </div>
        `;

        return;
    }

    servidores.forEach((servidor, index) => {
        const nomeServidor = servidor.servidor ||"Servidor não identificado";
        const zona = servidor.zona ||"Zona não informada";
        const valorUptime =Number(servidor.uptime ?? 0);
        const statusUptime =servidor.statusUptime ||"Indefinido";
        const horasIndisponivel =Number(servidor.tempoIndisponivelHoras ?? 0);
        const classeStatus =obterClasseStatusServidor(statusUptime );
        const classeUptime = definirClasseUptime(valorUptime);
        const classeUptimeItem = definirClasseUptimeItem(valorUptime);
        const classeUptimeP = definirClasseUptimeP(valorUptime);

        lista.innerHTML += `
            <div class="item_servidor item_tendencia  ${classeUptime}">
                <div class="item  ${classeUptimeItem}">
                    <p class=" ${classeUptimeP}">
                        ${index + 1}° ${nomeServidor}
                    </p>

                    <span class="status-servidor ${classeStatus}">
                        ● Uptime: ${valorUptime.toFixed(2)}%
                    </span>
                </div>

                <div class="tooltip-tendencia">
                    <h4>Detalhes do uptime</h4>

                    <p>Zona: ${zona}</p>

                    <p>
                        ${horasIndisponivel} horas de
                        indisponibilidade nos últimos
                        ${servidor.periodoDias ?? 30} dias.
                    </p>
                </div>
            </div>
        `;
    });
}



//}//---------------------------------------------------------------------------------------------------------------------------------------------

function renderizarGraficoSaudeZonas(datacenter) {
    const canvas = document.getElementById(
        "graficoSaudeZonas"
    );

    if (!canvas) {
        console.error("Canvas graficoSaudeZonas não encontrado.");
        return;
    }

    const graficoExistente = Chart.getChart(canvas);

    if (graficoExistente) {
        graficoExistente.destroy();
    }

    const nomesZonas = [];
    const saudeZonas = [];

    const zonas = datacenter?.zonas || [];

    zonas.forEach(zona => {
        nomesZonas.push(zona.zona);
        saudeZonas.push(Number(zona.score).toFixed(0));
    });

    function definirCorZona(score) {
        if (score >= 80) {
            return "#22C55E";
        }

        if (score >= 60) {
            return "#F5A400";
        }

        return "#F23845";
    }



    graficoSaudeZonasInstancia = new Chart(
        canvas,
        {
            type: "bar",

            data: {
                labels: nomesZonas,

                datasets: [
                    {
                        data: saudeZonas,
                        backgroundColor: saudeZonas.map(
                            definirCorZona
                        ),
                        borderRadius: 4,
                        barThickness: 46
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 200
                },

                plugins: {
                    legend: {
                        display: false
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,

                        ticks: {
                            stepSize: 25,
                            color: "#6B7280"
                        },

                        grid: {
                            color: "#E5E7EB"
                        }
                    },

                    x: {
                        ticks: {
                            color: "#6B7280"
                        },

                        grid: {
                            color: "#E5E7EB"
                        }
                    }
                }
            }
        }
    );
}

let graficoAlertasSemana = null;

function renderizarGraficoAlertas(datacenter) {
    const canvas = document.getElementById("graficoIncidentesSemana");

    if (!canvas) {
        console.error(
            "Canvas graficoIncidentesSemana não encontrado."
        );
        return;
    }

    const graficoAlertasExistente = Chart.getChart(canvas);

    if (graficoAlertasExistente) {
        graficoAlertasExistente.destroy();
    }

    const dadosGrafico =
        datacenter?.graficoAlertasSemana || {};

    const alertasPorDia =
        dadosGrafico.alertasPorDia || {};

    const dias = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ];

    const quantidadeAlertas = dias.map(
        dia => Number(alertasPorDia[dia] ?? 0)
    );

    const media = Number(
        dadosGrafico.mediaDiariaAlertas ?? 0
    );

    const linhaMedia = dias.map(() => media);

    console.log(
        "Dados do gráfico de alertas:",
        {
            dias,
            quantidadeAlertas,
            media
        }
    );

    if (graficoAlertasSemana) {
        graficoAlertasSemana.destroy();
    }

    graficoAlertasSemana = new Chart(
        canvas,
        {
            type: "line",
            data: {
                labels: dias,
                datasets: [
                    {
                        label: "Alertas diários",
                        data: quantidadeAlertas,
                        borderColor: "#2F80ED",
                        backgroundColor: "#2F80ED",
                        borderWidth: 3,
                        tension: 0.35,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        fill: false
                    },
                    {
                        label: `Média diária até hoje: ${media}`,
                        data: linhaMedia,
                        borderColor: "#F5A400",
                        backgroundColor: "#F5A400",
                        borderWidth: 2,
                        borderDash: [6, 6],
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        tension: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 300
                },

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {
                    legend: {
                        position: "bottom",

                        labels: {
                            usePointStyle: true,
                            color: "#6B7280",
                            padding: 20
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label(context) {
                                const valor =
                                    context.parsed.y ?? 0;

                                return (
                                    `${context.dataset.label}: ` +
                                    `${valor}`
                                );
                            }
                        }
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,

                        suggestedMax: Math.max(
                            ...quantidadeAlertas,
                            media,
                            5
                        ),

                        ticks: {
                            precision: 0,
                            color: "#6B7280"
                        },

                        grid: {
                            color: "#E5E7EB"
                        }
                    },

                    x: {
                        ticks: {
                            color: "#6B7280"
                        },

                        grid: {
                            color: "#E5E7EB"
                        }
                    }
                }
            }
        }
    );


}

function atualizarTendenciaAlertas(datacenter) {
    const dadosGrafico = datacenter?.graficoAlertasSemana || {};
    const alertasPorDia = dadosGrafico.alertasPorDia || {};

    const dias = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo"
    ];

    const valores = dias.map(
        dia => Number(alertasPorDia[dia] ?? 0)
    );

    const primeiroValor = valores[0];
    const ultimoValor = valores[valores.length - 1];

    const titulo = document.querySelector(".tendencia h1");
    const descricao = document.querySelector(".tendencia p");
    const imagem = document.querySelector(".tendencia img");
    const tend = document.querySelector('.tendencia')

    if (ultimoValor < primeiroValor) {
        titulo.innerHTML = "Tendência Positiva";
        descricao.innerHTML = "Redução recente no volume de alertas.";
        imagem.src = "/assets/icone_certo.png";
        tend.style.backgroundColor="  #C8F7DC"
        tend.style.borderColor = "#23B26D";



    } else if (ultimoValor > primeiroValor) {
        titulo.innerHTML = "Tendência Negativa";
        descricao.innerHTML = "Aumento recente no volume de alertas.";
        imagem.src = "/assets/Icon_alerta.png";
        tend.style.borderColor = "#FF5252";
        tend.style.backgroundColor="  #FFD6D6"

    } else {
        titulo.innerHTML = "Tendência Estável";
        descricao.innerHTML = "Volume de alertas sem variações relevantes.";
        imagem.src = "/assets/dashboard-icons/checkAlerta.png";
        tend.style.borderColor = "#F5CC4D";
        tend.style.backgroundColor="  #FFEAB0"

    }

    console.log(imagem.src);
}

function mostrarRelatorios(){
document.getElementById("div_relatorios").style.display = "block";
carregarRelatoriosDatacenter();

}

function fecharRelatorios(){
document.getElementById("div_relatorios").style.display = "none";

}


function limparSessao() {
    sessionStorage.clear();
}

async function carregarRelatoriosDatacenter() {

    const nomeDatacenter =sessionStorage.getItem("DATACENTER_SELECIONADO");

    const listaRelatorios = document.getElementById(
        "listaRelatoriosGerados"
    );
    console.log("Empresa usada:", nomeEmpresa);
console.log("Datacenter usado:", nomeDatacenter);

    const estadoRelatorios = document.getElementById(
        "estadoRelatoriosGerados"
    );

    const textoDatacenter = document.getElementById(
        "datacenterRelatoriosSelecionado"
    );

    if (!listaRelatorios || !estadoRelatorios) {
        console.error(
            "Elementos da área de relatórios não foram encontrados."
        );
        return;
    }

    listaRelatorios.innerHTML = "";

    if (!nomeEmpresa) {
        exibirEstadoRelatorios(
            "Não foi possível identificar a empresa do usuário.",
            "erro"
        );

        return;
    }

    if (!nomeDatacenter) {
        exibirEstadoRelatorios(
            "Nenhum datacenter está selecionado na dashboard.",
            "vazio"
        );

        return;
    }

    if (textoDatacenter) {
        textoDatacenter.textContent =
            `Empresa: ${nomeEmpresa} | Datacenter: ${nomeDatacenter}`;
    }

    exibirEstadoRelatorios(
        "Carregando relatórios...",
        "carregando"
    );

    try {
        const empresaUrl = encodeURIComponent(nomeEmpresa);
        const datacenterUrl = encodeURIComponent(nomeDatacenter);
        
        const resposta = await fetch(
            `/relatorios/listar/${empresaUrl}/${datacenterUrl}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error( dados.mensagem ||"Não foi possível buscar os relatórios.");
        }

        const relatorios = dados.relatorios || [];

        if (relatorios.length === 0) {
            exibirEstadoRelatorios(
                "Nenhum relatório encontrado para este datacenter.","vazio");
            return;
        }

        estadoRelatorios.style.display = "none";

        relatorios.forEach((relatorio, index) => {
            listaRelatorios.innerHTML += montarRelatorioGerado(relatorio,index);
        });

    } catch (erro) {
        console.error("Erro ao carregar relatórios:",erro);

        exibirEstadoRelatorios(
            "Não foi possível carregar os relatórios deste datacenter.",
            "erro"
        );
    }
}

function montarRelatorioGerado(relatorio, index) {
    const nomeArquivo = escaparHtmlRelatorio(
        relatorio.nomeArquivo
    );

    const dataFormatada = formatarDataRelatorio(
        relatorio.ultimaModificacao
    );

    const tamanhoFormatado = formatarTamanhoRelatorio(
        relatorio.tamanhoBytes
    );

    return `
            <div class="item_relatorio_gerado">

            <div class="informacoes_relatorio_gerado">
                <h4>${nomeArquivo}</h4>

                <p class="detalhes_relatorio_gerado">
                    Gerado em ${dataFormatada}
                    <span>•</span>
                    ${tamanhoFormatado}
                </p>
            </div>

            <a
                class="btn_baixar_relatorio"
                href="${relatorio.urlDownload}"
                target="_blank"
                rel="noopener noreferrer"
                title="Baixar relatório"
            >
                <img
                    src="../assets/icons_dashOpGestora/dowload.svg"
                    alt="Baixar relatório"
                >

            </a>

        </div>
    `;
}

function exibirEstadoRelatorios(mensagem, tipo) {
    const estadoRelatorios = document.getElementById(
        "estadoRelatoriosGerados"
    );

    if (!estadoRelatorios) {
        return;
    }

    estadoRelatorios.style.display = "block";

    estadoRelatorios.className =
        `estado_relatorios_gerados estado_relatorios_${tipo}`;

    estadoRelatorios.textContent = mensagem;
}

function formatarDataRelatorio(data) {
    if (!data) {
        return "data não informada";
    }

    return new Date(data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatarTamanhoRelatorio(tamanhoBytes) {
    const tamanho = Number(tamanhoBytes);

    if (!tamanho || tamanho <= 0) {
        return "tamanho não informado";
    }

    if (tamanho < 1024) {
        return `${tamanho} B`;
    }

    if (tamanho < 1024 * 1024) {
        return `${(tamanho / 1024).toFixed(1)} KB`;
    }

    return `${(tamanho / (1024 * 1024)).toFixed(1)} MB`;
}

function escaparHtmlRelatorio(valor) {
    const elemento = document.createElement("div");

    elemento.textContent = valor || "";

    return elemento.innerHTML;
}

//--------------------------------------------------- MOVENDO O TOOLTIP  PARA QUE ELE NAO FIQUE CORTADO -------------------------------------------------------
let tooltipAberto = null;
let itemTooltipOriginal = null;

document.addEventListener("mouseover", function (event) {
    const item = event.target.closest(".item_tendencia");

    if (!item || item.contains(event.relatedTarget)) {
        return;
    }

    const tooltip = item.querySelector(".tooltip-tendencia");

    if (!tooltip) {
        return;
    }

    const itemPosicao = item.getBoundingClientRect();
    itemTooltipOriginal = item;
    tooltipAberto = tooltip;
    document.body.appendChild(tooltip);
    tooltip.style.display = "block";

    const larguraTooltip = tooltip.offsetWidth;
    const alturaTooltip = tooltip.offsetHeight;

    let esquerda =itemPosicao.left +itemPosicao.width / 2 -larguraTooltip / 2;

    let topo =itemPosicao.top -alturaTooltip -12;

    esquerda = Math.max(10, esquerda);

    esquerda = Math.min(esquerda,window.innerWidth - larguraTooltip - 10);

    if (topo < 10) {
        topo = itemPosicao.bottom + 12;
        tooltip.classList.add("tooltip-abaixo");
    } else {
        tooltip.classList.remove("tooltip-abaixo");
    }

    tooltip.style.left = `${esquerda}px`;
    tooltip.style.top = `${topo}px`;
});


document.addEventListener("mouseout", function (event) {
    const item = event.target.closest(".item_tendencia");

    fecharTooltipAtual();

    if (!item || item.contains(event.relatedTarget)) {
        return;
    }

    if (!tooltipAberto || !itemTooltipOriginal) {
        return;
    }

    tooltipAberto.style.display = "none";
    tooltipAberto.removeAttribute("style");

    itemTooltipOriginal.appendChild(tooltipAberto);

    tooltipAberto = null;
    itemTooltipOriginal = null;
});

function fecharTooltipAtual() {
    if (!tooltipAberto || !itemTooltipOriginal) {
        return;
    }

    tooltipAberto.style.display = "none";
    tooltipAberto.removeAttribute("style");

    itemTooltipOriginal.appendChild(tooltipAberto);

    tooltipAberto = null;
    itemTooltipOriginal = null;
}