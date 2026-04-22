if (!sessionStorage.ID_USUARIO) {
  alert("Você precisa estar logado!");
  window.location = "login.html";
}

// Precisa do DOMcontentLoaded, pq garante que os elementos do html carreguem antes de pegar o id do char, saco?
document.addEventListener('DOMContentLoaded', () => {

    const ctxServer = document.getElementById('chartServer');
    const ctxRamCpu = document.getElementById('chartRamxCpu');
    const ctxDiskLat = document.getElementById('chartDiskxLat');
    const ctxAlerta = document.getElementById('chartAlerta');

    let graficoBarraServer;

    const dadosPico = {
    Server_1: [4, 5, 5, 0, 8, 2, 8],
    Server_2: [2, 2, 2, 3, 5, 6, 4],
    Server_3: [2, 5, 1, 5, 8, 6, 8],
    };

    function somarAlertas(lista) {
    let total = 0;

    for (let i = 0; i < lista.length; i++) {
        total += lista[i];
    }

    return total;
    }

    function atualizarGrafico() {

    const totalServer1 = somarAlertas(dadosPico.Server_1);
    const totalServer2 = somarAlertas(dadosPico.Server_2);
    const totalServer3 = somarAlertas(dadosPico.Server_3);

    if (graficoBarraServer) {
        graficoBarraServer.destroy();
    }

    graficoBarraServer = new Chart(ctxServer, {
        type: 'bar',
        data: {
        labels: ['SERVIDOR-DC01', 'SERVIDOR-DC02', 'SERVIDOR-DC03'],
        datasets: [{
            label: 'Quantidade de Alertas',
            data: [totalServer1, totalServer2, totalServer3],
            backgroundColor: ['#F5CC4D', '#23B26D', '#FF5252'],
            borderRadius: 5,
            barThickness: 60
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            display: false
            },
            title: {
                display: true,
                text: 'Comparação dos servidores que mais receberam alertas',
                align: 'start',
                font: {
                    size: 18
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
            grid: {
                display: false
            }
            },
            y: {
            beginAtZero: true
            }
        }
        }
    });
    }

    new Chart(ctxAlerta, {
    type: 'bar',
    data: {
        labels: ['SERVIDOR-DC01', 'SERVIDOR-DC02', 'SERVIDOR-DC03'],
        datasets: [
            {
                label: 'Baixo',
                data: [8, 6, 6],
                backgroundColor: '#23B26D'
            },
            {
                label: 'Médio',
                data: [7, 6, 4],
                backgroundColor: '#F5CC4D'
            },
            {
                label: 'Crítico',
                data: [2, 3, 1],
                backgroundColor: '#FF5252'
            },
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                boxWidth: 14
                }
            },
            title: {
                display: true,
                text: 'Quantidade de alertas por servidor',
                align: 'start',
                font: {
                    size: 18
                },
                padding: {
                    top: 10,
                    bottom: 30,
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

    new Chart(ctxRamCpu, {
    type: 'bar',
    data: {
        labels: ["04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
        {
            label: 'RAM',
            data: [35, 61, 50, 68, 51],
            backgroundColor: '#244770',
            order: 2
        },
        {
            label: 'CPU',
            data: [45, 52, 70, 73, 37],
            backgroundColor: '#C95050',
            order: 2
        },
        {
            label: 'Previsibilidade',
            data: [40, 55, 60, 70, 44],
            type: 'line',
            borderColor: '#6B7280',
            backgroundColor: '#ffffff',
            tension: 0.5,
            order: 1
        },
        
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Comparando Ram e CPU com índice de previsibilidade',
                align: 'start',
                font: {
                    size: 18
                },
                padding: {
                    top: 20,
                    bottom: 30,
                }
            }
        },
        responsive: true,
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Uso (%)'
            }
        },
        }
    }
    }),

    new Chart(ctxDiskLat, {
    type: 'bar',
    data: {
        labels: ["04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
        {
            label: 'Disco',
            data: [25.5, 40, 48, 51, 38],
            backgroundColor: '#23B26D',
            order: 2
        },
        {
            label: 'Latencia',
            data: [23, 40, 51, 52, 38],
            backgroundColor: '#1D85C2',
            order: 2
        },
        {
            label: 'Previsibilidade',
            data: [24, 40, 50, 51.5, 38],
            type: 'line',
            borderColor: '#6B7280',
            backgroundColor: '#ffffff',
            tension: 0.5,
            order: 1
        },
        
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Comparando Disco e Latencia com índice de previsibilidade',
                align: 'start',
                font: {
                    size: 18
                },
                padding: {
                    top: 20,
                    bottom: 30,
                }
            }
        },
        responsive: true,
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Uso (%)'
            }
        },
        }
    }
    }),

    atualizarGrafico();
})