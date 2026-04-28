function fnNavegar(local) {
    window.location.href = local
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
        dataCenterTitulo.innerHTML = dados.nomeDataCenter
        if (dados.imagem) {
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {

    const ctxLatencia = document.getElementById('graficoLatencia');
    const ctxUso = document.getElementById('graficoDonut');
    const ctxMediaDia = document.getElementById('graficoMediaDia');
    const ctxLatenciaRede = document.getElementById('graficoLatenciaRede');

    new Chart(ctxLatencia, {
        type: 'bar',
        data: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Pacotes enviados    ',
                data: [700, 980, 867, 408, 1098, 640, 580],
                borderColor: '#22C55E',
                backgroundColor: '#8B5CF6',
                tension: 0.5,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Latência de rede',
                    align: 'start',
                    font: {
                        size: 18
                    },
                },
                // subtitle: {
                //     display: true,
                //     text: '',
                //     align: 'start',
                //     font: {
                //         size: 18
                //     },
                // }
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

    new Chart(ctxLatencia, {
        type: "doughnut",
        data: {
            labels: ["Crítico", "Médio", "Baixo"],
            datasets: [{
                data: [8, 30, 42],
                backgroundColor: ["#FF5252", "#F5CC4D", "#23B26D"],
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
                    text: 'Distribuição na semana',
                    align: 'start',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 10,
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Total de alertas por severidade',
                    align: 'start',
                    font: {
                        size: 18
                    },
                    padding: {
                        bottom: 30,
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

new Chart(ctxLatenciaRede, {
    type: 'bar',
    data: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Pacotes enviados    ',
            data: [700, 980, 867, 408, 1098, 640, 580],
            borderColor: '#22C55E',
            backgroundColor: '#8B5CF6',
            tension: 0.5,
            fill: true,
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
            },
            legend: {
                display: true,
                position: 'bottom'
            },

        },
        scales: {
            y: {
                min: 0,
                max: 1200,
                ticks: {
                    stepSize: 300
                },
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: "Pacotes"
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

new Chart(ctxMediaDia, {
    type: 'bar',
    data: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'RAM',
            data: [60, 30, 44, 82, 54, 76, 32],
            borderColor: '#22C55E',
            backgroundColor: '#F5CC4D',
            tension: 0.5,
            fill: true,
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
            },
            legend: {
                display: true,
                position: 'bottom'
            },

        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 10
                },
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: "%"
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});


new Chart(ctxLatencia, {
    type: 'line',
    data: {
        labels: ['02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
        datasets: [{
            label: 'Latência (ms)',
            data: [47, 42, 46, 54, 73, 69, 79, 75, 90, 86, 65, 50],
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.5,
            fill: true,
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
            },
            legend: {
                display: true,
                position: 'bottom'
            },

        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20
                },
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: "MS"
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Em uso: ', 'Disponível: '],
        datasets: [{
            data: [88, 22],
            backgroundColor: [
                '#EF4444',
                '#22C55E'
            ],
            borderWidth: 5,
            hoverOffset: 20
        }]
    },
    options: {
        plugins: {
            tille: {
                display: true,
                text: 'Uso de RAM'
            },
            legend: {
                display: true,
                position: 'bottom'
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
});