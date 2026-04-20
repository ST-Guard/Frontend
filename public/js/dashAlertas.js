document.addEventListener("DOMContentLoaded", () => {
    const alerta = document.getElementById("Alerta");
    const distribuicao = document.getElementById("distribuicao");

    new Chart(alerta, {
        type: "bar",
        data: {
            labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
            datasets: [
                {
                    label: "Baixo",
                    data: [9, 8, 12, 13],
                    backgroundColor: "#174A5B",
                    borderRadius: 6
                },
                {
                    label: "Medio",
                    data: [6, 7, 9, 8],
                    backgroundColor: "#F4B400",
                    borderRadius: 6
                },
                {
                    label: "Crítico",
                    data: [3, 2, 2, 1],
                    backgroundColor: "#F45B2A",
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
                    text: 'Alertas por semana',
                    align: 'start',
                    font: {
                        size: 18
                    },
                },
                subtitle: {
                    display: true,
                    text: 'Distribuição de alertas por severidade(último mês)',
                    align: 'start',
                    font: {
                        size: 18
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
                max: 60,
                ticks: {
                stepSize: 15
                }
            }
            }
        }
    });

    new Chart(distribuicao, {
        type: "doughnut",
        data: {
            labels: ["Crítico", "Médio", "Baixo"],
            datasets: [{
                data: [8, 30, 42],
                backgroundColor: ["#F45B2A", "#F4B400", "#174A5B"],
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
                    text: 'Distribuição atual',
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
                    text: 'Total de alertas ativos por severidade',
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