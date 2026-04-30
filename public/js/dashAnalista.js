function fnNavegar(caminho){
    window.location.href = caminho
}
window.onload = () => {
    buscarDados()
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
        if (dados.imagem) {
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })
}


document.addEventListener('DOMContentLoaded', () => {
const graficoTop3Ram = document.getElementById('graficoTopProcRAM');
new Chart(graficoTop3Ram, {
    type: 'bar',
    data: {
        labels: [
            'MySQL Server',
            'Apache Web Server',
            'Node.js Application'
        ],
        datasets: [{
            data: [41.9, 30.2, 27.9],
            backgroundColor: [
                '#244770',
                '#66C0F4',
                '#F5CC4D'
            ],
            borderRadius: 5,
            borderSkipped: false,
            barThickness: 50,
        }]
    },
    options: {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'RAM (GB)'
                },
                grid: {
                    color: '#e5e7eb',

                }
            },
            y: {
                grid: {
                    display: false

                }
            }
        }
    }
});

const graficoTop3CPU = document.getElementById('graficoTopProcCPU');
new Chart(graficoTop3CPU, {
    type: 'bar',
    data: {
        labels: [
            'srcds_linux',
            'SourceMod',
            'MySQL Server'
        ],
        datasets: [{
            data: [48, 14, 8],
            backgroundColor: [
                '#244770',
                '#66C0F4',
                '#F5CC4D'
            ],
            borderRadius: 5,
            borderSkipped: false,
            barThickness: 50,
        }]
    },
    options: {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'RAM (GB)'
                },
                grid: {
                    color: '#e5e7eb',

                }
            },
            y: {
                grid: {
                    display: false

                }
            }
        }
    }
});

const graficoUsoG = document.getElementById('graficoUso');
new Chart(graficoUsoG, {
    type: 'line',
    data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        datasets: [
            {
                label: 'Sobrecarregados',
                data: [40, 35, 60, 75, 70, 65, 50],
                borderColor: '#244770',
                backgroundColor: '#244770',
                tension: 0.4,
                pointRadius: 4
            },
           
            {
                label: 'Estressados',
                data: [30, 43, 45, 65, 70, 67, 54],
                borderColor: '#F5CC4D',
                backgroundColor: '#F5CC4D',
                tension: 0.4,
                pointRadius: 4
            }
            
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e3e3e4',
                    borderDash: [5, 5]
                }
            },
            x: {
                grid: {
                    color: '#e3e3e4',
                    borderDash: [5, 5]
                }
            }
        }
    }
});

//Gráfico de donut de RAM
const textoNoCentroDonutRAM = {
    id: 'textoCentral',
    beforeDraw(chart) {
        const { width, height, ctx } = chart;

        ctx.save();

        ctx.font = 'bold 24px IBM Plex Sans';
        ctx.fillStyle = '#244770';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('95.0%', width / 2, height / 2 - 5);

        ctx.font = '12px IBM Plex Sans';
        ctx.fillStyle = '#6B7280';

        ctx.fillText('Em uso', width / 2, height / 2 + 15);

        ctx.restore();
    }
};
const donutRam = document.getElementById('graficoUsoRam');
new Chart(donutRam, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [90, 10],
            backgroundColor: [
                '#244770',
                '#E5E7EB'
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    },
    plugins: [textoNoCentroDonutRAM]
});


//Gráfico de donut CPU

const textoNoCentroDonutCPU = {
    id: 'textoCentral',
    beforeDraw(chart) {
        const { width, height, ctx } = chart;

        ctx.save();

        ctx.font = 'bold 24px IBM Plex Sans';
        ctx.fillStyle = '#66C0F4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('75.0%', width / 2, height / 2 - 5);

        ctx.font = '12px IBM Plex Sans';
        ctx.fillStyle = '#6B7280';

        ctx.fillText('Em uso', width / 2, height / 2 + 15);

        ctx.restore();
    }
};
const donutCPU = document.getElementById('graficoUsoCPU');
new Chart(donutCPU, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [75, 25],
            backgroundColor: [
                '#66C0F4',
                '#E5E7EB'
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    },
    plugins: [textoNoCentroDonutCPU]
});


//Gráfico de donut CPU
const textoNoCentroDonutDisco = {
    id: 'textoCentral',
    beforeDraw(chart) {
        const { width, height, ctx } = chart;

        ctx.save();

        ctx.font = 'bold 24px IBM Plex Sans';
        ctx.fillStyle = '#F5CC4D';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('93.2', width / 2, height / 2 - 5);

        ctx.font = '12px IBM Plex Sans';
        ctx.fillStyle = '#6B7280';
        ctx.fillText('Em uso', width / 2, height / 2 + 15);

        ctx.restore();
    }
};
const donutDisco = document.getElementById('graficoUsoDisco');
new Chart(donutDisco, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [93, 7],
            backgroundColor: [
                '#F5CC4D',
                '#E5E7EB'
            ],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    },
    plugins: [textoNoCentroDonutDisco]
});
});

function limparSessao() {
    sessionStorage.clear();
}