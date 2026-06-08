function fnNavegar(local) {
    window.location.href = local
}

// if (!sessionStorage.ID_USUARIO) {
//   alert("Você precisa estar logado!");
//   window.location = "login.html";
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
        sessionStorage.ID_ZONA = dados.idZona
        //dataCenterTitulo.innerHTML = dados.nomeDataCenter
        if (dados.imagem) {
            console.log(dados.imagem)
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })
}

async function puxarDadosAws() {
    const BUCKET = 'smartdatabucket2'

    return fetch("/especifico/puxarDadosEspecifico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            bucket: BUCKET
        })
    })
     .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dados) {
        if(dados == [] || dados == null || dados == {}){
          console.log("Dados não encontrados")
          return
        } else {
            let kpiTrafego = document.getElementById('kpiVolumeDownload');

            let kpiCpu = document.getElementById('kpiP99Cpu');
            let kpiCpuDesc = document.getElementById('descKpiCpu');

            let kpiDisco = document.getElementById('kpiP99Disco');
            let kpiDiscoDesc = document.getElementById('descKpiDisco');

            let kpiRam = document.getElementById('kpiP99Ram');
            let kpiRamDesc = document.getElementById('descKpiRam');

            let kpiLatencia = document.getElementById('kpiP99Latencia');
            let kpiLatenciaDesc = document.getElementById('descKpiLatencia');

            kpiCpu.innerHTML = dados.KPIS.P99CPUTotal.toFixed(1) + "%"
            kpiCpuDesc.innerHTML = dados.KPIS.P99CPUTotal.toFixed(1) + "%"

            kpiRam.innerHTML = dados.KPIS.P99RAMTotal.toFixed(1) + "%"
            kpiRamDesc.innerHTML = dados.KPIS.P99RAMTotal.toFixed(1) + "%"

            kpiDisco.innerHTML = dados.KPIS.P99DISCOTotal.toFixed(1) + "%"
            kpiDiscoDesc.innerHTML = dados.KPIS.P99DISCOTotal.toFixed(1) + "%"
            
            kpiLatencia.innerHTML = dados.KPIS.P99REDETotal.toFixed(1) + "%"
            kpiLatenciaDesc.innerHTML = dados.KPIS.P99REDETotal.toFixed(1) + "%"

            if (dados.KPIS.P99CPUTotal >= 75) {
                document.querySelector('#container_kpis .kpi3').style.borderColor = '#FF5252';
                document.querySelector('#container_kpis .kpi3 h1').style.color = '#FF5252';
                document.querySelector('#container_kpis .kpi3').style.boxShadow = `1.5px 1px 2px 1px #FF5252, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi3.src = "../assets/dashboard-icons/icon_alerta.svg"
            } else if (dados.KPIS.P99CPUTotal >= 60) {
                document.querySelector('#container_kpis .kpi3').style.borderColor = '#F5CC4D';
                document.querySelector('#container_kpis .kpi3 h1').style.color = '#F5CC4D';
                document.querySelector('#container_kpis .kpi3').style.boxShadow = `1.5px 1px 2px 1px #F5CC4D, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi3.src = "../assets/dashboard-icons/icon_atencao.svg"
            } else {
                document.querySelector('#container_kpis .kpi3').style.borderColor = '#23B26D';
                document.querySelector('#container_kpis .kpi3 h1').style.color = '#23B26D';
                document.querySelector('#container_kpis .kpi3').style.boxShadow = `1.5px 1px 2px 1px #23B26D, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi3.src = "../assets/dashboard-icons/icon_check.svg"
            }

            if (dados.KPIS.P99RAMTotal >= 75) {
                document.querySelector('#container_kpis .kpi4').style.borderColor = '#FF5252';
                document.querySelector('#container_kpis .kpi4 h1').style.color = '#FF5252';
                document.querySelector('#container_kpis .kpi4').style.boxShadow = `1.5px 1px 2px 1px #FF5252, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi4.src = "../assets/dashboard-icons/icon_alerta.svg"
            } else if (dados.KPIS.P99RAMTotal >= 60) {
                document.querySelector('#container_kpis .kpi4').style.borderColor = '#F5CC4D';
                document.querySelector('#container_kpis .kpi4 h1').style.color = '#F5CC4D';
                document.querySelector('#container_kpis .kpi4').style.boxShadow = `1.5px 1px 2px 1px #F5CC4D, 0 4px 12px rgba(0,0,0,0.1)`;   
                imgKpi4.src = "../assets/dashboard-icons/icon_atencao.svg"        
            } else {
                document.querySelector('#container_kpis .kpi4').style.borderColor = '#23B26D';
                document.querySelector('#container_kpis .kpi4 h1').style.color = '#23B26D';
                document.querySelector('#container_kpis .kpi4').style.boxShadow = `1.5px 1px 2px 1px #23B26D, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi4.src = "../assets/dashboard-icons/icon_check.svg"
            }

            if (dados.KPIS.P99DISCOTotal >= 75) {
                document.querySelector('#container_kpis .kpi2').style.borderColor = '#FF5252';
                document.querySelector('#container_kpis .kpi2 h1').style.color = '#FF5252';
                document.querySelector('#container_kpis .kpi2').style.boxShadow = `1.5px 1px 2px 1px #FF5252, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi2.src = "../assets/dashboard-icons/icon_alerta.svg"
            } else if (dados.KPIS.P99DISCOTotal >= 60) {
                document.querySelector('#container_kpis .kpi2').style.borderColor = '#F5CC4D';
                document.querySelector('#container_kpis .kpi2 h1').style.color = '#F5CC4D';
                document.querySelector('#container_kpis .kpi2').style.boxShadow = `1.5px 1px 2px 1px #F5CC4D, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi2.src = "../assets/dashboard-icons/icon_atencao.svg"        
            } else {
                document.querySelector('#container_kpis .kpi2').style.borderColor = '#23B26D';
                document.querySelector('#container_kpis .kpi2 h1').style.color = '#23B26D';
                document.querySelector('#container_kpis .kpi2').style.boxShadow = `1.5px 1px 2px 1px #23B26D, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi2.src = "../assets/dashboard-icons/icon_check.svg"
            }

            if (dados.KPIS.P99REDETotal >= 75) {
                document.querySelector('#container_kpis .kpi1').style.borderColor = '#FF5252';
                document.querySelector('#container_kpis .kpi1 h1').style.color = '#FF5252';
                document.querySelector('#container_kpis .kpi1').style.boxShadow = `1.5px 1px 2px 1px #FF5252, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi1.src = "../assets/dashboard-icons/icon_alerta.svg"
            } else if (dados.KPIS.P99REDETotal >= 60) {
                document.querySelector('#container_kpis .kpi1').style.borderColor = '#F5CC4D';
                document.querySelector('#container_kpis .kpi1 h1').style.color = '#F5CC4D';
                document.querySelector('#container_kpis .kpi1').style.boxShadow = `1.5px 1px 2px 1px #F5CC4D, 0 4px 12px rgba(0,0,0,0.1)`;     
                imgKpi1.src = "../assets/dashboard-icons/icon_atencao.svg"     
            } else {
                document.querySelector('#container_kpis .kpi1').style.borderColor = '#23B26D';
                document.querySelector('#container_kpis .kpi1 h1').style.color = '#23B26D';
                document.querySelector('#container_kpis .kpi1').style.boxShadow = `1.5px 1px 2px 1px #23B26D, 0 4px 12px rgba(0,0,0,0.1)`;
                imgKpi1.src = "../assets/dashboard-icons/icon_check.svg"
            }

            return dados
        }
    });
}

async function estimarDownloadsPorJogador() {
    try {
        const resposta = await fetch("/steam/steamGlobal");
        const dados = await resposta.json();
        const onlineAgora = dados.onlineAgora;
        const jogandoAgora = dados.jogandoAgora * 1.50;
        const usuariosForaDosJogos = onlineAgora - jogandoAgora;
        const usuariosDownload = usuariosForaDosJogos * 0.1;

        const respostaDownload = await fetch("/steam/steamDownloads");
        const dadosDown = await respostaDownload.json();
        const avgmbpsSteam = Number(dadosDown.BRA.avgmbps);
        const gbpsSteam = Number(((avgmbpsSteam / 1000) / 1000).toFixed(2));

        const kpiVolumeDownload = document.getElementById('kpiVolumeDownload');
        kpiVolumeDownload.innerHTML = Number((dadosDown.BRA.avgmbps) / 1000).toFixed(2)

        return {onlineAgora, jogandoAgora, usuariosForaDosJogos, usuariosDownload, gbpsSteam};

    } catch (erro) {
        console.error("Erro ao estimar downloads:", erro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buscarDados()
    carregarDados()

    setInterval(puxarDadosAws, 60000)
    
    const ctxRamCpu = document.getElementById('chartRamxCpu');
    const ctxDiskLat = document.getElementById('chartDiskxLat');
    const ctxDownload = document.getElementById('chartDownload');
    const ctxVolume = document.getElementById('chartVolumeCriticidade');
    const ctxReviews = document.getElementById('chartReviews');

    const chartDiscoXLatencia = new Chart(ctxDiskLat, {
        type: 'line',
        data: {
            labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'],
            datasets: [
            {
                label: 'Disco',
                data: [22.5, 26.5, 40, 48, 51, 38, 22.5, 26.5, 40, 48, 51, 38, 22.5, 26.5, 40, 48, 51, 38, 22.5, 26.5, 40, 48, 51, 38],
                fill: true,
                borderColor: 'rgba(35, 178, 109, 0.7)',
                backgroundColor: 'rgba(35, 178, 109, 0.18)',
                tension: 0.5,
                order: 2,
                pointRadius: 0,
                borderWidth: 1.5
            },
            {
                label: 'Latencia',
                data: [42.5, 33, 27, 23, 26, 28, 42.5, 33, 27, 23, 26, 28, 42.5, 23, 26, 28, 42.5, 33, 27, 23, 26, 28, 42.5, 23],
                fill: true,
                borderColor: 'rgba(29, 133, 194, 0.7)',
                backgroundColor: 'rgba(29, 133, 194, 0.18)',
                tension: 0.5,
                order: 2,
                pointRadius: 0,
                borderWidth: 1.5
            },  
            
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação Disco X Latencia',
                    align: 'start',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 20,
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Taxa em MB/s nas ultimas 24h',
                    align: 'start',
                    font: {
                        size: 14
                    },
                    padding: {
                        bottom: 30,
                    }
                },
                legend: {
                    labels: {
                        padding: 5
                    },
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            responsive: true,
            scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Uso (%)'
                },
                min: 0,
                max: 100
            },
            }
        }
    });

    const labelsDiskLat = [];
    const valoresDiskLat = [];    

    let ultimoTotal = null;

    const chartDownload = new Chart(ctxDownload, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Download Brasil (Gbps)',
            data: [],
            backgroundColor: '#244770',
            borderRadius: 4
        }]
    },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Análise de download nas últimas 24 horas',
                    align: 'start',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 20,
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Contagem por hora',
                    align: 'start',
                    font: {
                        size: 14
                    },
                    padding: {
                        bottom: 30,
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true,
                },
            }
        }
    });

    const chartRamXCpu = new Chart(ctxRamCpu, { 
    type: 'line',
    data: {
        labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'],
        datasets: [
            {
                label: 'RAM',
                data: [32.5, 35, 61, 50, 68, 51, 32.5, 35, 61, 50, 68, 51, 32.5, 35, 50, 68, 51, 32.5, 35, 61, 50, 68, 51, 32.5],
                fill: true,
                borderColor: 'rgba(36, 71, 112, 0.7)',
                backgroundColor: 'rgba(36, 71, 112, 0.18)',
                tension: 0.5,
                order: 2,
                pointRadius: 0,
                borderWidth: 1.5
            },
            {
                label: 'CPU',
                data: [32.5, 45, 52, 70, 73, 37, 32.5, 45, 52, 70, 73, 37, 32.5, 52, 70, 73, 37, 32.5, 45, 52, 70, 73, 37, 32.5],
                fill: true,
                borderColor: 'rgba(201, 80, 80, 0.7)',
                backgroundColor: 'rgba(201, 80, 80, 0.18)',
                tension: 0.5,
                order: 2,
                pointRadius: 0,
                borderWidth: 1.5
            },
        ]
    },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Análise de utilização de recursos',
                    align: 'start',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 20,
                    }
                },
                subtitle: {
                    display: true,
                    text: 'CPU e RAM % nas ultimas 24h',
                    align: 'start',
                    font: {
                        size: 14
                    },
                    padding: {
                        bottom: 30,
                    }
                },
                legend: {
                    labels: {
                        padding: 5
                    },
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            responsive: true,
            scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Uso (%)'
                },
                min: 0,
                max: 100
            },
            }
        }
    });

    const labelsRamCpu = [];
    const valoresRamCpu = [];    

    const chartVolume = new Chart(ctxVolume, { 
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Lançamentos agendados',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1.5,
                    borderRadius: 6
                },
                {
                    label: 'Limite Relevante',
                    data: [10, 10, 10, 10],
                    type: 'line',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    fill: false
                },

                {
                    label: 'Limite Crítico',
                    data: [15, 15, 15, 15],
                    type: 'line',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Quantidade de lançamentos de jogos',
                    align: 'start',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 22,
                        bottom: 10
                    }
                },
                legend: {
                    labels: {
                        padding: 5
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade de lançamentos'
                    }
                },
                x: {
                }
            }
        }
    });

    const labelsReview = [];
    const valoresReview = [];

    const chartReview = new Chart(ctxReviews, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Quantidade de reviews",
                data: [],
                borderColor: "#244770",
                backgroundColor: "#244770",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                title: {
                    display: true,
                    text: "Reviews dos últimos 7 dias por jogo",
                    align: "start",
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 22,
                        bottom: 25
                    }
                },
                legend: {
                    display: false
                }
            },

            scales: {
                x: {
                    beginAtZero: true,
                    }
                },

                y: {
                    ticks: {
                        autoSkip: false
                    }
                }
            }
    });

    async function buscarVolumeLancamentos() {

        const resposta = await fetch("/steam/volumeLancamentosSteam");
        const dados = await resposta.json();
        const labels = [];
        const valores = [];
        const coresFundo = [];
        const coresBorda = [];

        for (let i = 0; i < dados.jogos.length; i++) {
            const data = dados.jogos[i].dataLancamento;
            let posicao = labels.indexOf(data);

            if (posicao === -1) {
                labels.push(data);
                valores.push(1);
            } else {
                valores[posicao]++;
            }
        }

        chartVolume.data.labels = labels;
        chartVolume.data.datasets[0].data = valores;

        for (let i = 0; i < valores.length; i++) {
            const valor = valores[i];

            if (valor >= 15) {
                coresFundo.push('rgba(220, 53, 69, 0.7)');
                coresBorda.push('rgba(220, 53, 69, 1)');
            } else if (valor >= 10) {
                coresFundo.push('rgba(255, 193, 7, 0.7)');
                coresBorda.push('rgba(255, 193, 7, 1)');
            } else {
                coresFundo.push('rgba(60, 179, 113, 0.7)');
                coresBorda.push('rgba(60, 179, 113, 1)');
            }
        }

        chartVolume.data.datasets[0].backgroundColor = coresFundo;
        chartVolume.data.datasets[0].borderColor = coresBorda;
        chartVolume.data.datasets[1].data = [];
        chartVolume.data.datasets[2].data = [];

        for (let i = 0; i < labels.length; i++) {
            chartVolume.data.datasets[1].data.push(10);
            chartVolume.data.datasets[2].data.push(15);
        }

        chartVolume.update();
    }

    async function buscarVolumeComprados() {
        const resposta = await fetch("/steam/volumeCompradosSteam");
        const dados = await resposta.json();
    }

    async function carregarGraficoReviews() {
        labelsReview.length = 0;
        valoresReview.length = 0;

        const respostaTop = await fetch("/steam/topSellers");
        const topSellers = await respostaTop.json();

        for (let i = 0; i < topSellers.length; i++) {
            try {
                const jogo = topSellers[i];

                if (jogo.appId == 730) {
                    const resposta = await fetch(`/steam/reviews/app/${jogo.appId}`);
                    const dados = await resposta.json();
                    labelsReview.push(jogo.nome.length > 18 ? jogo.nome.slice(0, 18) + "..." : jogo.nome);
                    valoresReview.push(1000);
                } else {
                    const resposta = await fetch(`/steam/reviews/app/${jogo.appId}`);
                    const dados = await resposta.json();
                    labelsReview.push(jogo.nome.length > 18 ? jogo.nome.slice(0, 18) + "..." : jogo.nome);
                    valoresReview.push(dados.totalReviews || 0);
                }

            } catch (erro) {
                console.log("Erro jogo:", topSellers[i]);
            }
        }

        chartReview.data.labels = labelsReview;
        chartReview.data.datasets[0].data = valoresReview;
        chartReview.update();
    }

    async function carregarGraficoDownload() {
        const dados = await estimarDownloadsPorJogador();
        const agora = new Date();
        agora.setMinutes(0, 0, 0);
        
        const labelsDownload = [];
        const valoresDownload = [149, 146, 150, 155, 150, 153, 149, 147, 150, 155, 150, 154];
        for (let i = 11; i >= 0; i--) {
            const horario = new Date(agora);
            horario.setHours(agora.getHours() - (i * 2));
            labelsDownload.push(
                horario.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            );
        }
        valoresDownload[valoresDownload.length - 1] = dados.gbpsSteam;

        chartDownload.data.labels = labelsDownload;
        chartDownload.data.datasets[0].data = valoresDownload;
        chartDownload.update();
    }

    async function carregarDados() {
        const idZona = sessionStorage.ID_ZONA
        const selectServer = document.getElementById('selectSrv');
        const nomeTopoServer = document.getElementById('nomeTopoServer');
        const parte2 = document.getElementById('p2');

        selectServer.onchange = async function () {
            if (selectServer.value == "todos") {
                parte2.style.display = "flex";
                nomeTopoServer.innerHTML = "Todos os Servidores";
                atualizarComponente()
            } else {
                parte2.style.display = "none";
                nomeTopoServer.innerHTML = selectServer.value
                atualizarComponente()
            }
        }

        fetch(`/especifico/selectServidor/${idZona}`)
        .then(resposta => resposta.json())
        .then(lista => {
                selectServer.style.display = 'flex';
                selectServer.innerHTML = `<option selected value = "todos">Todos os Servidores</option>`;
                console.log(lista)
                for (let i = 0; i < lista.length; i++) {
                    selectServer.innerHTML += `
                        <option value="${lista[i].nome}">
                            ${lista[i].nome}
                        </option>
                    `;
                }

                selectServer.onchange();
            })
            .catch(
                erro => console.log(erro)
            );

    }

    async function atualizarComponente() {

        const dados = await puxarDadosAws()
        console.log(dados)

        const selectServer = document.getElementById("selectSrv");
        const selecionado = selectServer.value;

        const agora = new Date();
        agora.setMinutes(0, 0, 0);
            
        const labelsRamCpu = [];
        const valoresRam = [32.5, 35, 61, 50, 68, 51, 32.5, 35, 61, 50, 68, 51];
        const valoresCpu = [32.5, 45, 52, 70, 73, 37, 32.5, 45, 52, 70, 73, 37];

        const labelsDiskLat = [];
        const valoresDisco = [22.5, 26.5, 40, 48, 51, 38, 32.5, 16.5, 30, 18, 61, 4];
        const valoresLatencia = [22.5, 53, 67, 43, 36, 48, 32.5, 23, 57, 73, 6, 53];

        for (let i = 11; i >= 0; i--) {
            const horario = new Date(agora);
            horario.setHours(agora.getHours() - (i * 2));
            labelsDiskLat.push(
                horario.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            );

            labelsRamCpu.push(
                horario.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            );
        }

        if (selecionado == "todos") {
            valoresRam[valoresRam.length - 1] = dados.KPIS.P99RAMTotal.toFixed(1);
            valoresCpu[valoresCpu.length - 1] = dados.KPIS.P99CPUTotal.toFixed(1);
            valoresDisco[valoresDisco.length - 1] = dados.KPIS.P99DISCOTotal.toFixed(1);
            valoresLatencia[valoresLatencia.length - 1] = dados.KPIS.P99REDETotal.toFixed(1);
        } else {
            let selectMaior = selecionado.toLowerCase();
            const valoresRam = [24, 42, 55.3, 19, 73, 81, 38, 66.9, 90, 47.5, 12, 33.7];
            const valoresCpu = [18, 39.5, 58, 64.5, 81, 41.2, 22, 51, 49.5, 75, 68.5, 33];
            const valoresDisco = [14.3, 29.8, 35.1, 52.4, 47.2, 22.7, 39.5, 11.2, 44.6, 28.3, 63.9, 8.5];
            const valoresLatencia = [22.5, 53, 67, 43, 36, 48, 32.5, 23, 57, 73, 6, 53];

            valoresRam[valoresRam.length - 1] = dados.KPIS.P99RAMTotal.toFixed(1);
            valoresCpu[valoresCpu.length - 1] = dados.KPIS.P99CPUTotal.toFixed(1);
            valoresDisco[valoresDisco.length - 1] = dados.KPIS.P99DISCOTotal.toFixed(1);
            valoresLatencia[valoresLatencia.length - 1] = dados.KPIS.P99REDETotal.toFixed(1);

        }

        chartRamXCpu.data.labels = labelsRamCpu;
        chartRamXCpu.data.datasets[0].data = valoresRam;
        chartRamXCpu.data.datasets[1].data = valoresCpu;
        chartRamXCpu.update();

        chartDiscoXLatencia.data.labels = labelsDiskLat;
        chartDiscoXLatencia.data.datasets[0].data = valoresDisco;
        chartDiscoXLatencia.data.datasets[1].data = valoresLatencia;
        chartDiscoXLatencia.update();
    }

    carregarGraficoDownload();
    carregarGraficoReviews();
    buscarVolumeComprados()
    buscarVolumeLancamentos();
    setInterval(carregarGraficoDownload, 3600000);

});

function limparSessao() {
    sessionStorage.clear();
}