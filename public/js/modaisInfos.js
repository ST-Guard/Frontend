/* =========================================== */
/* ----- ABRI MODAIS DOS GRÁFICOS E KPIs ----- */

function abrirModal(titulo, conteudo) {
    document.getElementById("tituloModal").innerHTML = titulo;
    document.getElementById("conteudoModal").innerHTML = conteudo;
    document.getElementById("modalGrafico")
        .classList.add("ativo");
}

function fecharModal() {
    document.getElementById("modalGrafico")
        .classList.remove("ativo");
}

/* =============================== */
/* ---- INFOS GRÁFICOS GESTOR ---- */

const chartServer = document.getElementById("chartServer");

if (chartServer) {

    chartServer.addEventListener("click", function () {

        abrirModal(
            "Servidores com Alertas",

            `
            <p><b>Descrição:</b></p>

            <p>
            Este gráfico apresenta a quantidade de servidores
            que registraram alertas recentemente.
            </p>

            <p>
            Ele permite identificar quais servidores
            estão apresentando maior número de ocorrências
            e precisam de atenção.
            </p>
            `
        );

    });

}

const chartAlerta = document.getElementById("chartAlerta");

if (chartAlerta) {

    chartAlerta.addEventListener("click", function () {

        abrirModal(
            "Distribuição de Alertas",

            `
            <p><b>Descrição:</b></p>

            <p>
            Este gráfico mostra os diferentes tipos
            de alertas registrados no sistema.
            </p>

            <p>
            Ele ajuda a identificar os principais
            problemas que estão ocorrendo na infraestrutura.
            </p>
            `
        );

    });

}

const chartRamxCpu = document.getElementById("chartRamxCpu");

if (chartRamxCpu) {

    chartRamxCpu.addEventListener("click", function () {

        abrirModal(
            "Uso de RAM x CPU",

            `
            <p><b>Descrição:</b></p>

            <p>
            Este gráfico compara o uso de memória RAM
            com o uso de CPU dos servidores.
            </p>

            <p>
            Ele permite identificar correlação entre
            processamento e consumo de memória.
            </p>
            `
        );

    });

}


const chartDiskxLat = document.getElementById("chartDiskxLat");

if (chartDiskxLat) {

    chartDiskxLat.addEventListener("click", function () {

        abrirModal(
            "Uso de Disco x Latência",

            `
            <p><b>Descrição:</b></p>

            <p>
            Este gráfico mostra a relação entre
            uso de disco e latência do sistema.
            </p>

            <p>
            Ele ajuda a identificar possíveis
            gargalos relacionados ao armazenamento.
            </p>
            `
        );

    });

}

/* ============================================== */
/* ----- GRÁFICOS DA DASH DE ANALISTA GERAL ----- */

document.addEventListener("DOMContentLoaded", function () {

    const graficoUso =
        document.getElementById("graficoUso");

    if (graficoUso) {

        graficoUso.addEventListener("click", function () {

            abrirModal(
                "Servidores Estressados X Sobrecarregados",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a quantidade de servidores
                estressados e sobrecarregados.
                </p>

                <p>
                Servidores estressados estão próximos do limite,
                enquanto sobrecarregados já ultrapassaram o limite crítico.
                </p>
                `
            );

        });

    }



    const graficoTopRAM =
        document.getElementById("graficoTopProcRAM");

    if (graficoTopRAM) {

        graficoTopRAM.addEventListener("click", function () {

            abrirModal(
                "Top 3 Processos - Uso de RAM",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra os três processos
                que mais consomem memória RAM.
                </p>
                `
            );

        });

    }



    const graficoTopCPU =
        document.getElementById("graficoTopProcCPU");

    if (graficoTopCPU) {

        graficoTopCPU.addEventListener("click", function () {

            abrirModal(
                "Top 3 Processos - Uso de CPU",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra os três processos
                que mais utilizam CPU.
                </p>
                `
            );

        });

    }

});

/* =================================================== */
/* ----- GRÁFICOS DA DASH DE ANALISTA ESPECIFICA ----- */

document.addEventListener("DOMContentLoaded", function () {

    const graficoRam =
        document.getElementById("graficoRam");

    if (graficoRam) {

        graficoRam.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso da RAM",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a utilização de RAM do servidor selecionado.
                </p>

                <p>
                Útil para saber como esta o componente no presente momento.
                </p>
                `
            );

        });

    }



    const graficoCpu =
        document.getElementById("graficoCpu");

    if (graficoCpu) {

        graficoCpu.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso da CPU",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a utilização de CPU do servidor selecionado.
                </p>

                <p>
                Útil para saber como esta o componente no presente momento.
                </p>
                `
            );

        });

    }



    const graficoDisco =
        document.getElementById("graficoDisco");

    if (graficoDisco) {

        graficoDisco.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso do Disco",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico mostra a utilização de Disco do servidor selecionado.
                </p>

                <p>
                Útil para saber como esta o componente no presente momento.
                </p>
                `
            );

        });

    }


    const chartRamxCpu =
        document.getElementById("chartRamxCpu");

    if (chartRamxCpu) {

        chartRamxCpu.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso da RAM x CPU em horários do dia",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico traz a comparação do uso da RAM e CPU no dia atual
                </p>

                <p>
                Não pensei(ajuste)
                </p>
                `
            );

        });

    }

    const chartDiskxLat =
        document.getElementById("chartDiskxLat");

    if (chartDiskxLat) {

        chartDiskxLat.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso do Disco x Latência de rede",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico traz a comparação do uso da Disco e com a latência em diferentes horários do dia
                </p>

                <p>
                Não pensei(ajuste)
                </p>
                `
            );

        });

    }

    const graficoComponentes =
        document.getElementById("graficoComponentes");

    if (graficoComponentes) {

        graficoComponentes.addEventListener("click", function () {

            abrirModal(
                "Gráfico de uso de todos os componetes",

                `
                <p><b>Descrição:</b></p>

                <p>
                Este gráfico traz o uso de todos os 4 componentes do servidor
                </p>

                <p>
                Não pensei(ajuste)
                </p>
                `
            );

        });

    }

});

/* ============================= */
/* ---- KPIs DA DASH GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const alertServer =
        document.getElementById("alertServer");

    if (alertServer) {

        alertServer.addEventListener("click", function () {

            abrirModal(
                "Histórico de Instabilidade",

                `
                <p><b>Descrição:</b></p>

                <p>
                Exibe o servidor que registrou o maior volume de notificações, avisos ou falhas críticas em um período determinado.
                </p>

                <p>
                Facilitar a manutenção preventiva ao destacar máquinas reincidentes que podem precisar de upgrade, revisão de configuração ou substituição de peças antes de uma queda total.
                </p>
                `
            );

        });

    }
    const procConsumo =
        document.getElementById("procConsumo");

    if (procConsumo) {

        procConsumo.addEventListener("click", function () {

            abrirModal(
                "Alocação Crítica de Recursos",

                `
                <p><b>Descrição:</b></p>

                <p>
                Identifica o serviço ou processo do sistema que apresenta a maior demanda atual sobre o hardware (CPU, Memória RAM ou Disco).
                </p>

                <p>
                Localizar gargalos operacionais e identificar comportamentos anômalos (como vazamento de memória ou loops de processamento) para garantir a estabilidade do servidor.       
                </p>
                `
            );

        });

    }
    const jogAtivos =
        document.getElementById("jogAtivos");

    if (jogAtivos) {

        jogAtivos.addEventListener("click", function () {

            abrirModal(
                "Volume de Usuários Online",

                `
                <p><b>Descrição:</b></p>

                <p>
                Contagem instantânea de usuários com sessão ativa e interação direta com a plataforma.
                </p>

                <p>
                Mensurar o engajamento e a carga de tráfego atual, auxiliando em decisões de escalonamento de recursos e análise de horários de pico.
                </p>
                `
            );

        });

    }
    const serveAtivos =
        document.getElementById("serveAtivos");

    if (serveAtivos) {

        serveAtivos.addEventListener("click", function () {

            abrirModal(
                "Status da Infraestrutura",

                `
                <p><b>Descrição:</b></p>

                <p>
                Monitoramento em tempo real da disponibilidade dos servidores físicos ou virtuais que sustentam a aplicação.
                </p>

                <p>
                Identificar quedas parciais de serviço para agir rapidamente na recuperação de nós offline, evitando a sobrecarga dos servidores remanescentes.
                </p>
                `
            );

        });

    }
});

/* ============================================== */
/* ---- KPIs NA DASH DE SERVIDORES DO GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const p99cpu =
        document.getElementById("p99cpu");

    if (p99cpu) {

        p99cpu.addEventListener("click", function () {

              abrirModal(
                "Pico de Consumo (P99)",

                `
                <p><b>Descrição:</b></p>

                <p>
                Representa o valor de utilização que 99% dos casos não ultrapassam, isolando picos extremos de uso de hardware.
                </p>

                <p>
                Analisa o comportamento do servidor sob carga severa para dimensionar upgrades, garantindo que o sistema suporte momentos de estresse sem travar.
                </p>
                `
            );

        });

    }
    const p99ram =
        document.getElementById("p99ram");

    if (p99ram) {

        p99ram.addEventListener("click", function () {

            abrirModal(
                "Pico de Consumo (P99)",

                `
                <p><b>Descrição:</b></p>

                <p>
                Representa o valor de utilização que 99% dos casos não ultrapassam, isolando picos extremos de uso de hardware.
                </p>

                <p>
                Analisa o comportamento do servidor sob carga severa para dimensionar upgrades, garantindo que o sistema suporte momentos de estresse sem travar.
                </p>
                `
            );

        });

    }
    const p99latencia =
        document.getElementById("p99latencia");

    if (p99latencia) {

        p99latencia.addEventListener("click", function () {

              abrirModal(
                "Latência Crítica (P99)",

                `
                <p><b>Descrição:</b></p>

                <p>
                Indica o tempo máximo de resposta experimentado pelos usuários mais afetados (o 1% com maior lentidão).
                </p>

                <p>
                Util para medir a qualidade real da experiência do usuário; se o P99 de latência estiver alto, significa que parte do seu público está enfrentando travamentos severos, mesmo que a média pareça boa.</p>
                `
            );

        });

    }
    const p99disco =
        document.getElementById("p99disco");

    if (p99disco) {

        p99disco.addEventListener("click", function () {

            abrirModal(
                "Pico de Consumo (P99)",

                `
                <p><b>Descrição:</b></p>

                <p>
                Representa o valor de utilização que 99% dos casos não ultrapassam, isolando picos extremos de uso de hardware.
                </p>

                <p>
                Analisa o comportamento do servidor sob carga severa para dimensionar upgrades, garantindo que o sistema suporte momentos de estresse sem travar.
                </p>
                `
            );

        });

    }

    const totalServer =
        document.getElementById("totalServer");

    if (totalServer) {

        totalServer.addEventListener("click", function () {

            abrirModal(
                "Escopo da Infraestrutura",

                `
                <p><b>Descrição:</b></p>

                <p>
                Quantidade total de máquinas (nós) cadastradas e monitoradas pelo sistema.
                </p>

                <p>
                Fornece uma visão rápida da dimensão do parque tecnológico sob gestão atual.
                </p>
                `
            );

        });

    }
});

/* =========================================== */
/* ---- KPIs NA DASH DE ALERTAS DO GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const severa =
        document.getElementById("severa");

    if (severa) {

        severa.addEventListener("click", function () {

            abrirModal(
                "Incidentes de Alta Prioridade",

                `
                <p><b>Descrição:</b></p>

                <p>
                Alertas que indicam falhas graves, interrupções de serviço ou riscos iminentes à estabilidade do sistema.
                </p>

                <p>
                Direcionam a atenção imediata da equipe técnica para problemas que impactam diretamente a disponibilidade e exigem correção urgente.
                </p>
                `
            );

        });

    }
    const media =
        document.getElementById("media");

    if (media) {

        media.addEventListener("click", function () {

            abrirModal(
                "Alertas de Atenção",

                `
                <p><b>Descrição:</b></p>

                <p>
                Registros de comportamentos anômalos ou degradação de performance que ainda não causaram a queda do serviço.
                </p>

                <p>
                Permitem a intervenção preventiva antes que o problema se torne crítico, garantindo a continuidade operacional sem sustos.
                </p>
                `
            );

        });

    }
    const baixa =
        document.getElementById("baixa");

    if (baixa) {

        baixa.addEventListener("click", function () {

            abrirModal(
                "Notificações Informativas",

                `
                <p><b>Descrição:</b></p>

                <p>
                Eventos de rotina ou pequenos desvios que não comprometem o funcionamento principal da plataforma.
                </p>

                <p>
                Mantem um histórico de eventos para análises futuras e ajustes finos de configuração, sem necessidade de ação imediata
                </p>
                `
            );

        });

    }
    const resolvidos =
        document.getElementById("resolvidos");

    if (resolvidos) {

        resolvidos.addEventListener("click", function () {

            abrirModal(
                "Histórico de Eficiência (SLA)",

                `
                <p><b>Descrição:</b></p>

                <p>
                Volume de chamados ou alertas que foram solucionados e encerrados nas últimas 24 horas.
                </p>

                <p>
                Monitorar a agilidade da equipe de suporte e validar o cumprimento dos acordos de nível de serviço (SLA) estabelecidos.
                </p>
                `
            );

        });

    }
});

/* =============================================== */
/* ---- GRÁFICOS NA DASH DE ALERTAS DO GESTOR ---- */

document.addEventListener("DOMContentLoaded", function () {
    const Alerta =
        document.getElementById("Alerta");

    if (Alerta) {

        Alerta.addEventListener("click", function () {

            abrirModal(
                "Tendência Temporal de Alertas",

                `
                <p><b>Descrição:</b></p>

                <p>
                Demonstra a evolução do volume de incidentes ao longo das últimas quatro semanas, segmentados por nível de severidade.
                </p>

                <p>
                Identifica padrões de instabilidade ou melhoria na saúde do sistema ao longo do mês, permitindo avaliar se atualizações recentes causaram aumento ou redução de falhas.
                </p>
                `
            );

        });

    }
    const distribuicao =
        document.getElementById("distribuicao");

    if (distribuicao) {

        distribuicao.addEventListener("click", function () {

            abrirModal(
                "Mix de Severidade Semanal",

                `
                <p><b>Descrição:</b></p>

                <p>
                Apresenta a proporção exata entre alertas críticos, médios e baixos registrados no período de sete dias.
                </p>

                <p>
                Fornece uma visão macro da "qualidade" dos erros; ajuda a entender se a maioria dos alertas são apenas ruídos informativos ou se há uma concentração perigosa de problemas críticos que demandam mudança de estratégia.
                </p>
                `
            );

        });

    }
});


