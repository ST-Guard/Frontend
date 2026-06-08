function navegarPara(caminho) {
  window.location.href = caminho;
}

function limparSessao() {
  sessionStorage.clear();
}



function buscarDados() {
  const idUsuario = sessionStorage.ID_USUARIO;
  if (!idUsuario) return; 

  // Puxar Kpis
  fetch(`/sessao/buscarUsuario/${idUsuario}`)
    .then(r => r.json())
    .then(dados => {
      dados = dados[0];
      document.getElementById('username').innerHTML  = dados.nomePessoa;
      document.getElementById('cargoname').innerHTML = dados.cargo;
      const img = document.getElementById('imagemPerfilCima');
      img.src = dados.imagem
        ? `/assets/imgsBd/${dados.imagem}`
        : '../assets/dashConfig/usuario.png';
    })
    .catch(() => {}); 

        var BUCKET = ''
        fetch("/financeira/pegarDadosFinanceira", {
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
        }
        regioes = dados.dadosAlertas.Steam
        totalAlertasCriticos = 0
        totalAlertasAtencao = 0
        for(regiao in regioes){
          const dcsDaRegiao = regioes[regiao];
          for (const nomeDC in dcsDaRegiao) {
            const dadosDC = dcsDaRegiao[nomeDC];
            totalAlertasCriticos += dadosDC.KPIs['CRITICOS_ABERTOS']
            totalAlertasAtencao += dadosDC.KPIs['MEDIOS_ABERTOS'] 
          }
        }
        const dadosAlertas = {
          totalAlertasCriticos: totalAlertasCriticos,
          totalAlertasAtencao: totalAlertasAtencao
        }
        dados.dadosFinanceiros.KPIS['ALERTAS'] = dadosAlertas
        dadosFinais = dados.dadosFinanceiros
        console.log("Dados buscados pelo S3 com sucesso!");
        console.log(dadosFinais)
        plotarDados(dadosFinais)
    });


}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'});
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%`;
}

function formatarVariacaoMoeda(valor) {
  const numero = Number(valor || 0);
  const seta = numero >= 0 ? '▲' : '▼';
  const sinal = numero >= 0 ? '+' : '-';
  return `${seta} ${sinal}${formatarMoeda(Math.abs(numero))} vs mês anterior`;
}

function formatarVariacaoPercentual(valor) {
  const numero = Number(valor || 0);
  const seta = numero >= 0 ? '▲' : '▼';
  const sinal = numero >= 0 ? '+' : '';
  return `${seta} ${sinal}${numero.toLocaleString('pt-BR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}% vs mês anterior`;
}

function atualizarTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function atualizarSelo(id, valor, positivoVerde = true) {
  const elemento = document.getElementById(id);
  if (!elemento) return;

  const positivo = Number(valor || 0) >= 0;
  elemento.classList.remove('badge-kpi-verde', 'badge-kpi-vermelho');
  elemento.classList.add(positivo === positivoVerde ? 'badge-kpi-verde' : 'badge-kpi-vermelho');
}

function atualizarCorKpiRoi(valorRoi) {
  const cartaoRoi = document.getElementById("kpi-roi-card");
  if (!cartaoRoi) return;

  const roiPositivo = Number(valorRoi || 0) >= 0;
  cartaoRoi.classList.toggle("positivo", roiPositivo);
  cartaoRoi.classList.toggle("negativo", !roiPositivo);
}

let projecoesPreditivas = [];
let mesesForecast = 3;
let forecastChartInst;
let modeloPreditivo = {};
let budgetRegressionValue = 0;
let budgetActualValue = 0;
let budgetCustoCorrenteValue = 0;
let budgetMarginPct = 5;
let budgetApprovedValue = 0;
const STORAGE_BUDGET_MARGIN = 'financeira_margem_orcamento_pct';
const STORAGE_BUDGET_APPROVED = 'financeira_orcamento_aprovado';
function limitarNumero(valor, minimo, maximo) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return minimo;
  return Math.min(Math.max(numero, minimo), maximo);
}
function limitarHorizontePredicao(valor) {
  return limitarNumero(valor || 3, 1, 6);
}
function lerMargemOrcamentoSalva() {
  const margemSalva = sessionStorage.getItem(STORAGE_BUDGET_MARGIN);
  return margemSalva === null ? 5 : limitarNumero(margemSalva, 0, 20);
}
function calcularOrcamentoAprovado(base, margemPct) {
  return Number(base || 0) * (1 + Number(margemPct || 0) / 100);
}
function salvarOrcamentoSessao() {
  sessionStorage.setItem(STORAGE_BUDGET_MARGIN, String(budgetMarginPct));
  sessionStorage.setItem(STORAGE_BUDGET_APPROVED, String(budgetApprovedValue));
}

function primeiroValorObjeto(objeto, chaves, padrao = undefined) {
  if (!objeto) return padrao;

  for (const chave of chaves) {
    if (objeto[chave] !== undefined && objeto[chave] !== null) 
      return objeto[chave];
  }

  const mapaChaves = Object.keys(objeto).reduce((acc, chave) => {
    acc[chave.toLowerCase()] = objeto[chave];
    return acc;
  }, {});

  for (const chave of chaves) {
    const valor = mapaChaves[String(chave).toLowerCase()];
    if (valor !== undefined && valor !== null) return valor;
  }

  return padrao;
}

function obterNumeroS3(objeto, chaves, padrao = 0) {
  return Number(primeiroValorObjeto(objeto, chaves, padrao) || padrao);
}

function formatarMesGrafico(mesAno) {
  const [ano, mes] = String(mesAno || '').split('-');
  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const indiceMes = Number(mes) - 1;

  if (!ano || indiceMes < 0 || indiceMes > 11) return mesAno;
  return `${nomesMeses[indiceMes]}/${ano.slice(2)}`;
}

function formatarHoraGrafico(valorHora) {
  const partes = String(valorHora || '').split(' ');
  return partes[1] || valorHora;
}

let historico24Horas = [];

function aplicarHistorico24Horas(historico) {
  historico24Horas = Array.isArray(historico) ? historico : [];
}


function aplicarHistoricoMensal(historicoMensal, projecoes = []) {
  if (!Array.isArray(historicoMensal) || historicoMensal.length === 0) return;

  const tresMesesProjecao = Array.isArray(projecoes) ? projecoes.slice(0, 3) : [];
  const ultimoCustoHistorico = Number(historicoMensal[historicoMensal.length - 1]?.custo || 0) / 1000;
  const ultimaReceitaHistorica = Number(historicoMensal[historicoMensal.length - 1]?.receita || 0) / 1000;

  HISTORICO_MESES = historicoMensal.map(item => formatarMesGrafico(item.mes));
  custoHistorico = historicoMensal.map(item => Number(item.custo || 0) / 1000);
  receitaHistorica = historicoMensal.map(item => Number(item.receita || 0) / 1000);
  historicoRoi = historicoMensal.map(item => Number(item.roi || 0));

  todosRotulos = [...HISTORICO_MESES, ...tresMesesProjecao.map(item => formatarMesGrafico(item.mes))];
  todosCustos = [...custoHistorico, ...tresMesesProjecao.map(() => null)];
  todasReceitas = [...receitaHistorica, ...tresMesesProjecao.map(() => null)];
  prevCustoLn = [...HISTORICO_MESES.slice(0, -1).map(() => null), ultimoCustoHistorico, ...tresMesesProjecao.map(item => Number(item.custo_previsto || 0) / 1000)];
  prevReceitaLn = [...HISTORICO_MESES.slice(0, -1).map(() => null), ultimaReceitaHistorica, ...tresMesesProjecao.map(item => Number(item.receita_prevista || 0) / 1000)];

  definirPeriodoGrafico(periodoGraficoLinha, document.querySelector('.btn-periodo.active:not(.botao-periodo-roi)'));
}

function plotarDados(dadosS3){
  const kpis = dadosS3.KPIS || {};
  modeloPreditivo = dadosS3.MODELO || {};
  const roi = kpis.ROI || {};
  const faturamento = kpis.FATURAMENTO_TOTAL || {};
  const custo = kpis.CUSTO_TOTAL || {};
  const orcamento = kpis.ORCAMENTO || {};
  const previsto = kpis.CUSTO_PREVISTO || {};
  const alertas = kpis.ALERTAS

 // KPIS
  atualizarTexto("ROI_ESTIMADO", formatarPercentual(roi.ROI_MES_CORRENTE));
  atualizarCorKpiRoi(roi.ROI_MES_CORRENTE);
  atualizarTexto("RECEITA_LIQUIDA", formatarMoeda(roi.MARGEM_LIQUIDO));
  atualizarTexto("DELTA_ROI", formatarVariacaoPercentual(roi.DELTA_ROI));
  atualizarSelo("DELTA_ROI", roi.DELTA_ROI);

  atualizarTexto("kpi-rev-val", formatarMoeda(faturamento.FATURAMENTO));
  atualizarTexto("kpi-rev-delta", formatarVariacaoMoeda(faturamento.DELTA_FATURAMENTO));
  atualizarSelo("kpi-rev-delta", faturamento.DELTA_FATURAMENTO);

  atualizarTexto("kpi-cost-val", formatarMoeda(custo.CUSTO));
  atualizarTexto("kpi-cost-delta", formatarVariacaoMoeda(custo.DELTA_CUSTO));
  atualizarSelo("kpi-cost-delta", custo.DELTA_CUSTO, false);
  atualizarTexto("kpi-alertas-criticos-id", alertas.totalAlertasCriticos)
  atualizarTexto(" kpi-alertas-atencao-id", alertas.totalAlertasAtencao)

 

  
  budgetRegressionValue = Number(previsto.CUSTO_PREVISTO || orcamento.CUSTO_PREVISTO || 0);
  budgetActualValue = Number(orcamento.CUSTO_CORRENTE || custo.CUSTO || 0);
  budgetCustoCorrenteValue = Number(custo.CUSTO || budgetActualValue || 0);
  budgetMarginPct = lerMargemOrcamentoSalva();
  budgetApprovedValue = calcularOrcamentoAprovado(budgetRegressionValue, budgetMarginPct);
  atualizarPainelOrcamento();
  atualizarTexto("kpi-predicted", formatarMoeda(previsto.CUSTO_PREVISTO));

  // GRAFICOS
  projecoesPreditivas = Array.isArray(dadosS3.PROJECOES) ? dadosS3.PROJECOES.slice(0, 6) : [];
  aplicarHistorico24Horas(dadosS3.HISTORICO_24HRS);
  aplicarHistoricoMensal(dadosS3.HISTORICO_MENSAL, dadosS3.PROJECOES);
  aplicarDadosGraficos(dadosS3.GRAFICOS);
  if (document.getElementById('modal-preditivo')?.classList.contains('active')) renderizarPreditivo();
}

function aplicarDadosGraficos(graficos) {
  if (!graficos) return;

  if (graficos.DONUT_CUSTOS) {
    aplicarGraficoRoscaCustos(graficos.DONUT_CUSTOS);
  }

  if (Array.isArray(graficos.BARRAS_DATACENTER)) {
    aplicarBarrasCentrosDados(graficos.BARRAS_DATACENTER);
  }

  aplicarDadosTabela(graficos);

}

function abrirModalPreditivo() {
  const modal = document.getElementById('modal-preditivo');
  if (!modal) return;

  modal.classList.add('active');
  renderizarPreditivo();
}

function fecharModalPreditivo() {
  const modal = document.getElementById('modal-preditivo');
  if (modal) modal.classList.remove('active');
}

function abrirPredicaoPeloCartao() {
  abrirModalPreditivo();
}


function definirMesesPrevisao(qtdMeses, botao) {
  mesesForecast = limitarHorizontePredicao(qtdMeses);
  document.querySelectorAll('.btn-mr').forEach(btn => btn.classList.remove('active'));
  if (botao) botao.classList.add('active');

  const slider = document.getElementById('month-slider');
  if (slider) slider.value = mesesForecast;
  atualizarTexto('slider-display', mesesForecast);
  renderizarPreditivo();
}


function aoAlterarControlePrevisao(valor) {
  mesesForecast = limitarHorizontePredicao(valor);
  const slider = document.getElementById('month-slider');
  if (slider) slider.value = mesesForecast;
  atualizarTexto('slider-display', mesesForecast);
  document.querySelectorAll('.btn-mr').forEach(btn => btn.classList.toggle('active', Number(btn.textContent.replace('M', '')) === mesesForecast));
  renderizarPreditivo();
}

function renderizarPreditivo() {
  const modal = document.getElementById('modal-preditivo');
  if (!modal?.classList.contains('active')) return;

  const grid = document.getElementById('predict-grid');
  const canvas = document.getElementById('forecastChart');
  if (!grid || !canvas) return;

  mesesForecast = limitarHorizontePredicao(mesesForecast);
  const projecoes = projecoesPreditivas.slice(0, mesesForecast);
  const maeCusto = obterNumeroS3(modeloPreditivo, ['MAE_CUSTO']);
  const maeReceita = obterNumeroS3(modeloPreditivo, ['MAE_RECEITA']);

  atualizarTexto('model-mae-badge_custo', `MAE CUSTO ${formatarMoeda(maeCusto)}`);
  atualizarTexto('model-mae-badge_receita', `MAE RECEITA ${formatarMoeda(maeReceita)}`);

  const htmlPreditivo = projecoes.length
    ? projecoes.map((item, i) => {
      const confiancaCusto = obterNumeroS3(item, ['confianca_custo', 'CONFIANCA_CUSTO', 'confianca', 'CONFIANCA']);
      const confiancaReceita = obterNumeroS3(item, ['confianca_receita', 'CONFIANCA_RECEITA', 'confianca', 'CONFIANCA']);
      return `
      <div class="cartao-mes-preditivo">
        <div class="rotulo-mes-preditivo"><span class="num-mes">${i + 1}</span>${formatarMesGrafico(item.mes)}</div>
        <div class="linha-preditiva">
          <span class="rotulo-linha-preditiva">Custo</span>
          <span class="valor-linha-preditiva custo">${formatarMoeda(item.custo_previsto)}</span>
        </div>
        <div class="linha-preditiva">
          <span class="rotulo-linha-preditiva">Receita</span>
          <span class="valor-linha-preditiva receita">${formatarMoeda(item.receita_prevista)}</span>
        </div>
        <div class="linha-preditiva">
          <span class="rotulo-linha-preditiva">ROI</span>
          <span class="valor-linha-preditiva roi">${formatarPercentual(item.roi_previsto)}</span>
        </div>
        <div class="confianca-preditiva">
          <div class="linha-confianca-preditiva">
            <span>Índice Confiança do custo</span>
            <strong>${confiancaCusto}%</strong>
          </div>
          <div class="barra-confianca"><div class="preenchimento-confianca custo" style="width:${confiancaCusto}%"></div></div>
          <div class="linha-confianca-preditiva">
            <span>Índice Confiança da receita</span>
            <strong>${confiancaReceita}%</strong>
          </div>
          <div class="barra-confianca"><div class="preenchimento-confianca receita" style="width:${confiancaReceita}%"></div></div>
        </div>
      </div>
    `;
    }).join('')
    : '<div class="cartao-mes-preditivo"><div class="rotulo-mes-preditivo">Sem projeções carregadas</div></div>';
  if (grid.innerHTML !== htmlPreditivo) grid.innerHTML = htmlPreditivo;

  const historicoLabels = HISTORICO_MESES.slice(-6);
  const historicoCustos = custoHistorico.slice(-6);
  const historicoReceitas = receitaHistorica.slice(-6);
  const labels = [...historicoLabels, ...projecoes.map(item => formatarMesGrafico(item.mes))];
  const nulosProjecao = projecoes.map(() => null);
  const ultimoCusto = historicoCustos[historicoCustos.length - 1] || null;
  const ultimaReceita = historicoReceitas[historicoReceitas.length - 1] || null;
  const custosHistoricos = [...historicoCustos, ...nulosProjecao];
  const receitasHistoricas = [...historicoReceitas, ...nulosProjecao];
  const custosPrevistos = [
    ...historicoCustos.slice(0, -1).map(() => null),
    ultimoCusto,
    ...projecoes.map(item => Number(item.custo_previsto || 0) / 1000)
  ];
  const receitasPrevistas = [
    ...historicoReceitas.slice(0, -1).map(() => null),
    ultimaReceita,
    ...projecoes.map(item => Number(item.receita_prevista || 0) / 1000)
  ];

  const dadosGrafico = {
    labels,
    datasets: [
      { label: 'Custo histórico', data: custosHistoricos, borderColor: '#2C5D86', backgroundColor: 'rgba(44,93,134,0.07)', borderWidth: 2, pointRadius: 3, tension: 0.35, fill: true },
      { label: 'Custo previsto', data: custosPrevistos, borderColor: '#66C0F4', borderDash: [6,4], borderWidth: 2, pointRadius: 4, tension: 0.35, fill: false, spanGaps: false },
      { label: 'Receita histórica', data: receitasHistoricas, borderColor: '#F5CC4D', backgroundColor: 'rgba(245,204,77,0.06)', borderWidth: 2, pointRadius: 3, tension: 0.35, fill: true },
      { label: 'Receita prevista', data: receitasPrevistas, borderColor: '#9a7a1a', borderDash: [6,4], borderWidth: 2, pointRadius: 4, tension: 0.35, fill: false, spanGaps: false }
    ]
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatarMoeda(Number(ctx.raw || 0) * 1000)}` } }
    },
    scales: {
      y: { ticks: { color: '#6B7E91', callback: valor => `${valor}k` }, grid: { color: 'rgba(216,227,238,0.8)' } },
      x: { ticks: { color: '#6B7E91' }, grid: { display: false } }
    }
  };

  if (forecastChartInst) {
    forecastChartInst.data = dadosGrafico;
    forecastChartInst.options = opcoesGrafico;
    forecastChartInst.update('none');
    return;
  }

  forecastChartInst = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: dadosGrafico,
    options: opcoesGrafico
  });
}




// ══════════════════════════════════════════════
//  POPUP DO ORÇAMENTO
  
function alternarJanelaOrcamento(e) {
  const pop = document.getElementById('budget-popover');
  pop.classList.toggle('open');
  if (pop.classList.contains('open')) atualizarPainelOrcamento();
}


function fecharJanelaOrcamento(e) {
  document.getElementById('budget-popover').classList.remove('open');
}
function atualizarPainelOrcamento() {
  budgetMarginPct = limitarNumero(budgetMarginPct, 0, 20);
  budgetApprovedValue = calcularOrcamentoAprovado(budgetRegressionValue, budgetMarginPct);
  atualizarTexto("kpi-cost-budget-ref", formatarMoeda(budgetCustoCorrenteValue * 1.05));
  atualizarTexto("kpi-budget-val", formatarMoeda(budgetApprovedValue));
  atualizarTexto("kpi-budget-ref", formatarMoeda(budgetRegressionValue));
  atualizarTexto("kpi-budget-margin-label", budgetMarginPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 }));
  atualizarTexto("budget-margin-display", budgetMarginPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 }));
  atualizarTexto("budget-regression-val", formatarMoeda(budgetRegressionValue));
  atualizarTexto("budget-approved-val", formatarMoeda(budgetApprovedValue));
  atualizarTexto("budget-actual-val", formatarMoeda(budgetActualValue));
  const slider = document.getElementById('budget-margin-slider');
  if (slider) slider.value = budgetMarginPct;
  salvarOrcamentoSessao();
}
function aoAlterarMargemOrcamento(valor) {
  budgetMarginPct = limitarNumero(valor, 0, 20);
  atualizarPainelOrcamento();
}
// ══════════════════════════════════════════════
// MODAL DA KPIA ROI (GRAFICO DE LINHA)
   
let instanciaGraficoRoi;

function construirGraficoRoi(rotulos, historico) {
  if (instanciaGraficoRoi) instanciaGraficoRoi.destroy();
  
  instanciaGraficoRoi = new Chart(document.getElementById('roiChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: rotulos, 
      datasets: [{
        label: 'ROI',
        data: historico,
        borderColor: '#4CAF82',
        backgroundColor: 'rgba(76,175,130,0.1)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#4CAF82',
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `ROI: +${c.raw}%` } }
      },
      scales: {
        y: { ticks: { callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function definirPeriodoRoi(periodo, botao) {
  document.querySelectorAll('.botao-periodo-roi').forEach(b => b.classList.remove('active'));
  if (botao) botao.classList.add('active');
  
  let inicio = 0;
  if (periodo === 1) inicio = Math.max(HISTORICO_MESES.length - 1, 0);
  else if (periodo === 2) inicio = Math.max(HISTORICO_MESES.length - 6, 0);
  else if (periodo === 3) inicio = Math.max(HISTORICO_MESES.length - 12, 0);
  else if (periodo === 4) {
    const ultimoAno = HISTORICO_MESES[HISTORICO_MESES.length - 1]?.split('/')[1];
    const indiceYtd = HISTORICO_MESES.findIndex(mes => mes.endsWith(`/${ultimoAno}`) && mes.startsWith('Jan'));
    inicio = indiceYtd >= 0 ? indiceYtd : 0;
  }
  
  construirGraficoRoi(HISTORICO_MESES.slice(inicio), historicoRoi.slice(inicio));
}

function abrirModalRoi() {
  document.getElementById('roi-modal').classList.add('active');
  
  const botaoAtivo = document.querySelector('.botao-periodo-roi.active') || document.querySelectorAll('.botao-periodo-roi')[2];
  const indicePeriodo = Array.from(document.querySelectorAll('.botao-periodo-roi')).indexOf(botaoAtivo) + 1;
  
  definirPeriodoRoi(indicePeriodo, botaoAtivo);
}

function fecharModalRoi() {
  document.getElementById('roi-modal').classList.remove('active');
}


// ══════════════════════════════════════════════
// GRAFICO DE LINHAS (Custo x Receita)

let HISTORICO_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
let custoHistorico = [12, 14, 13, 15, 14, 16, 15, 17, 18, 16, 19, 20]; 
let receitaHistorica = [25, 28, 26, 30, 29, 32, 34, 33, 36, 35, 38, 40]; 


function rotuloMes(indice) {
  const mesesFuturos = ['Jan (Prev)', 'Fev (Prev)', 'Mar (Prev)'];
  return mesesFuturos[indice] || `Mês ${indice + 1}`;
}


function gerarPrevisoes(quantidade) {
  const previsoes = [];

  for (let i = 0; i < quantidade; i++) {
    const custoFicticio = Math.random() * (25 - 20) + 20; 
    const receitaFicticia = Math.random() * (50 - 40) + 40; 
    const roiFicticio = (((receitaFicticia - custoFicticio) / custoFicticio) * 100).toFixed(1);

    previsoes.push({
      custo: custoFicticio,
      receita: receitaFicticia,
      roi: parseFloat(roiFicticio) 
    });
  }

  return previsoes;
}

const previsoesL3 = gerarPrevisoes(3);


let todosRotulos = [...HISTORICO_MESES, ...previsoesL3.map((_, i) => rotuloMes(i))];
let todosCustos = [...custoHistorico, ...Array(3).fill(null)];
let todasReceitas = [...receitaHistorica, ...Array(3).fill(null)];
let prevCustoLn = [...custoHistorico.map(() => null), custoHistorico[11], ...previsoesL3.map(f => f.custo)];
let prevReceitaLn = [...receitaHistorica.map(() => null), receitaHistorica[11], ...previsoesL3.map(f => f.receita)];
let historicoRoi = custoHistorico.map((c, i) => parseFloat((((receitaHistorica[i] - c) / c) * 100).toFixed(1)));

Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
Chart.defaults.color = '#6B7E91';

let graficoLinha;
let estadoFiltroGrafico = 'todos';
let periodoGraficoLinha = '12m';

function normalizarSerieGrafico(serie) {
  return serie.map(valor => {
    if (valor === null || valor === undefined || valor === '') return null;
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  });
}

function criarOpcoesGraficoLinha(unidade, formatarValorGrafico) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: c => `${c.dataset.label}: ${formatarValorGrafico(c.raw)}`
        }
      }
    },
    scales: {
      y: { ticks: { callback: v => unidade === 'k' ? `${v}k` : formatarMoeda(v), font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } }
    }
  };
}

function construirGraficoLinha(rotulos, custo, receita, unidade = 'k', custoPrevisto = [], receitaPrevista = []) {
  custo = normalizarSerieGrafico(custo);
  receita = normalizarSerieGrafico(receita);
  custoPrevisto = normalizarSerieGrafico(custoPrevisto);
  receitaPrevista = normalizarSerieGrafico(receitaPrevista);

  const datasets = [
    { label: 'Custo', data: custo, borderColor: '#2C5D86', backgroundColor: 'rgba(44,93,134,0.07)', borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#2C5D86', tension: 0.35, fill: true, spanGaps: false },
    { label: 'Receita', data: receita, borderColor: '#F5CC4D', backgroundColor: 'rgba(245,204,77,0.06)', borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#F5CC4D', tension: 0.35, fill: true, spanGaps: false }
  ];

  if (unidade === 'k' && custoPrevisto.length === rotulos.length && receitaPrevista.length === rotulos.length) {
    datasets.push(
      { label: 'Custo previsto', data: custoPrevisto, borderColor: '#66C0F4', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [7, 5], pointRadius: 4, pointBackgroundColor: '#66C0F4', tension: 0.35, fill: false, spanGaps: false },
      { label: 'Receita prevista', data: receitaPrevista, borderColor: '#9a7a1a', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [7, 5], pointRadius: 4, pointBackgroundColor: '#9a7a1a', tension: 0.35, fill: false, spanGaps: false }
    );
  }

  const formatarValorGrafico = valor => unidade === 'k'
    ? `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`
    : formatarMoeda(valor);
  const canvasLinha = document.getElementById('lineChart');
  if (!canvasLinha || typeof Chart === 'undefined') return;

  const dados = { labels: rotulos, datasets };
  const opcoes = criarOpcoesGraficoLinha(unidade, formatarValorGrafico);

  if (graficoLinha) {
    graficoLinha.data = dados;
    graficoLinha.options = opcoes;
    graficoLinha.update('none');
    return;
  }

  graficoLinha = new Chart(canvasLinha.getContext('2d'), {
    type: 'line',
    data: dados,
    options: opcoes
  });
}

function definirPeriodoGrafico(periodo, botao) {
  periodoGraficoLinha = periodo;
  document.querySelectorAll('.btn-periodo:not(.botao-periodo-roi)').forEach(b => b.classList.remove('active'));
  if (botao) botao.classList.add('active');

  if (periodo === '24h') {
    construirGraficoLinha(
      historico24Horas.map(item => formatarHoraGrafico(item.hora)),
      historico24Horas.map(item => Number(item.custo || 0)),
      historico24Horas.map(item => Number(item.receita || 0)),
      'moeda'
    );
  } else {
    const meses = periodo === '6m' ? 6 : 12;
    const inicio = Math.max(HISTORICO_MESES.length - meses, 0);
    const previsoesRotulos = todosRotulos.slice(HISTORICO_MESES.length, HISTORICO_MESES.length + 3);
    const qtdPrevisoes = previsoesRotulos.length;
    const historicoVisivel = HISTORICO_MESES.length - inicio;
    const rotulos = [...HISTORICO_MESES.slice(inicio), ...previsoesRotulos];
    const custo = [...custoHistorico.slice(inicio), ...Array(qtdPrevisoes).fill(null)];
    const receita = [...receitaHistorica.slice(inicio), ...Array(qtdPrevisoes).fill(null)];
    const custosPrevistosFuturos = qtdPrevisoes > 0 ? prevCustoLn.slice(-qtdPrevisoes) : [];
    const receitasPrevistasFuturas = qtdPrevisoes > 0 ? prevReceitaLn.slice(-qtdPrevisoes) : [];
    const custoPrevisto = qtdPrevisoes > 0
      ? [...Array(Math.max(historicoVisivel - 1, 0)).fill(null), custoHistorico[custoHistorico.length - 1], ...custosPrevistosFuturos]
      : [];
    const receitaPrevista = qtdPrevisoes > 0
      ? [...Array(Math.max(historicoVisivel - 1, 0)).fill(null), receitaHistorica[receitaHistorica.length - 1], ...receitasPrevistasFuturas]
      : [];

    construirGraficoLinha(rotulos, custo, receita, 'k', custoPrevisto, receitaPrevista);
  }

  if (estadoFiltroGrafico !== 'todos') alternarGraficoLinha(estadoFiltroGrafico, true);
}



function alternarGraficoLinha(tipo, ignorarRolagem = false) {
  if (!ignorarRolagem) {
    document.getElementById('charts-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
    const cartaoGrafico = document.getElementById('line-chart-card');
    cartaoGrafico.classList.remove('pulso-destaque');
    void cartaoGrafico.offsetWidth; 
    cartaoGrafico.classList.add('pulso-destaque');
    setTimeout(() => cartaoGrafico.classList.remove('pulso-destaque'), 1500);
  }
  
  if (estadoFiltroGrafico === tipo && !ignorarRolagem) {
    estadoFiltroGrafico = 'todos';
    graficoLinha.data.datasets.forEach(ds => ds.hidden = false);
  } else {
    estadoFiltroGrafico = tipo;
    graficoLinha.data.datasets.forEach((ds, i) => {
      if (tipo === 'custo') ds.hidden = (i === 1 || i === 3);
      else if (tipo === 'receita') ds.hidden = (i === 0 || i === 2);
    });
  }
  graficoLinha.update();
}

function alternarSerieGraficoLinha(indice) {
  if (!graficoLinha || !graficoLinha.data.datasets[indice]) return;
  graficoLinha.data.datasets[indice].hidden = !graficoLinha.data.datasets[indice].hidden;
  graficoLinha.update('none');
}


// ══════════════════════════════════════════════
// GRAFICO DE DONUTS
   

const dColors = ['#66C0F4','#0F1C2E','#F5CC4D','#F5A623','#E05050'];
let dLabels = ['Energia','Hardware','Licenças','Manutenção','Rede'];
let dValues = [38,28,16,12,6];
let dAbsValues = [];
let donutChartInst;

function construirGraficoRosca() {
  if (donutChartInst) donutChartInst.destroy();

  donutChartInst = new Chart(document.getElementById('donutChart').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: dLabels,
      datasets: [{ data: dValues, backgroundColor: dColors, borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.label}: ${c.raw}%` } }
      }
    }
  });

  const dl = document.getElementById('donut-legend');
  dl.innerHTML = '';
  dLabels.forEach((l, i) => {
    const absVal = dAbsValues[i] ?? Math.round(562000 * dValues[i] / 100);
    dl.innerHTML += `<div class="item-legenda-donut">
      <div class="esq-legenda-donut">
        <div class="ponto-donut" style="background:${dColors[i]}"></div>
        <span style="color:var(--text-muted);font-size:12px;">${l}</span>
      </div>
      <div style="text-align:right;">
        <span class="pct-donut">${dValues[i]}%</span>
        <div id="donut-abs-${i}" style="font-size:10px;color:var(--text-muted);margin-top:1px;">${formatarMoeda(absVal)}</div>
      </div>
    </div>`;
  });
}

function aplicarGraficoRoscaCustos(donutCustos) {
  const entradas = Object.entries(donutCustos);
  const total = entradas.reduce((soma, [, valor]) => soma + Number(valor || 0), 0);
  if (total <= 0) return;

  const nomes = {
    energia: 'Energia',
    rede: 'Rede',
    hardware: 'Hardware',
    fixo_global: 'Fixo global'
  };

  dLabels = entradas.map(([chave]) => nomes[chave] || chave.replace(/_/g, ' '));
  dAbsValues = entradas.map(([, valor]) => Number(valor || 0));
  dValues = dAbsValues.map(valor => Number(((valor / total) * 100).toFixed(1)));

  construirGraficoRosca();
}


// ══════════════════════════════════════════════
// GRAFICO DE BARRA (custo / ROI por datacenter)
   
let dcLabels = ['DC01-SP','DC02-RJ','DC03-MG','DC04-RS','DC05-PE'];
let dcCosts  = [180000, 138000, 102000, 80000, 62000];
let dcRevs   = [302000, 223000, 172000, 115000, 48000];
let dcRois   = dcCosts.map((c, i) => parseFloat((((dcRevs[i] - c) / c) * 100).toFixed(1)));

let barChartInst;
let barView = 'custo';

function definirVisualizacaoBarra(view, btn) {
  barView = view;
  document.querySelectorAll('.alternador-vista .btn-alternador').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('bar-title').textContent = view === 'custo'
    ? 'Comparação de custo entre datacenters'
    : 'ROI por datacenter';
  document.getElementById('bar-sub').textContent = view === 'custo'
    ? 'Custo mensal'
    : 'Receita sobre custo por DC (negativo = prejuízo)';
  construirGraficoBarra();
}

function aplicarBarrasCentrosDados(barrasDatacenter) {
  if (!barrasDatacenter.length) return;

  dcLabels = barrasDatacenter.map(item => primeiroValorObjeto(item, ['datacenter', 'DATACENTER', 'dc', 'DC', 'nome', 'NOME', 'name', 'label'], 'DC'));
  dcCosts = barrasDatacenter.map(item => Number(primeiroValorObjeto(item, ['custo', 'CUSTO', 'custo_total', 'CUSTO_TOTAL', 'cost', 'valor', 'VALOR'], 0)));
  dcRevs = barrasDatacenter.map(item => Number(primeiroValorObjeto(item, ['receita', 'RECEITA', 'receita_total', 'RECEITA_TOTAL', 'rev', 'revenue'], 0)));
  dcRois = barrasDatacenter.map((item, i) => {
    const roi = primeiroValorObjeto(item, ['roi', 'ROI'], null);
    if (roi !== null) return Number(roi);
    return dcCosts[i] > 0 ? Number((((dcRevs[i] - dcCosts[i]) / dcCosts[i]) * 100).toFixed(1)) : 0;
  });

  document.getElementById('bar-sub').textContent = barView === 'custo'
    ? 'Custo mensal — soma = ' + formatarMoeda(dcCosts.reduce((soma, valor) => soma + valor, 0))
    : 'Receita sobre custo por DC (negativo = prejuízo)';
  construirGraficoBarra();
}

function construirGraficoBarra() {
  if (barChartInst) barChartInst.destroy();
  const isCusto = barView === 'custo';
  const data    = isCusto ? dcCosts.map(v => v) : dcRois;
  const colors  = isCusto
    ? dcCosts.map(() => '#66C0F4')
    : dcRois.map(r => r < 0 ? '#E05050' : r < 50 ? '#F5A623' : '#4CAF82');

  barChartInst = new Chart(document.getElementById('barChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: dcLabels,
      datasets: [{ label: isCusto ? 'Custo mensal' : 'ROI (%)', data, backgroundColor: colors, borderRadius: 5, borderSkipped: false }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => isCusto
          ? `R$ ${c.raw.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
          : `ROI: ${c.raw > 0 ? '+' : ''}${c.raw}%`
        }}
      },
      scales: {
        y: { ticks: { callback: v => isCusto ? (v >= 1000 ? (v/1000)+'k' : v) : v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}


// ══════════════════════════════════════════════
// Tabela (Servidores / Zonas)
   
let servidoresRows = [
  { name:'DC02-CACHE-3', dc:'DC02-RJ', zona:'Zona Beta',    cost:17200,  energy:5400,  st:'critico', stl:'Custo Ocioso' },
  { name:'FK02-GH-02',   dc:'DC01-SP', zona:'Zona Alpha',   cost:28400,  energy:9200,  st:'ativo',   stl:'Ativo' },
  { name:'DC01-WEB-05',  dc:'DC01-SP', zona:'Zona Alpha',   cost:24100,  energy:7800,  st:'alerta',  stl:'Alerta' },
  { name:'DC01-DB-12',   dc:'DC02-RJ', zona:'Zona Beta',    cost:22650,  energy:8400,  st:'ativo',   stl:'Ativo' },
  { name:'DC03-APP-08',  dc:'DC03-MG', zona:'Zona Gama',    cost:19800,  energy:6100,  st:'ativo',   stl:'Ativo' },
  { name:'DC04-AUTH-1',  dc:'DC04-RS', zona:'Zona Delta',   cost:15600,  energy:4800,  st:'ativo',   stl:'Ativo' },
  { name:'DC05-EDGE-2',  dc:'DC05-PE', zona:'Zona Épsilon', cost:12900,  energy:3900,  st:'alerta',  stl:'Alerta' },
];
let zonasRows = [
  { zona:'Zona Alpha',   dc:'DC01-SP', serv:2, cost:52500, energy:17000, st:'alerta',  stl:'Alerta' },
  { zona:'Zona Beta',    dc:'DC02-RJ', serv:2, cost:39850, energy:13800, st:'critico', stl:'Ofensor' },
  { zona:'Zona Gama',    dc:'DC03-MG', serv:1, cost:19800, energy:6100,  st:'ativo',   stl:'Ativo' },
  { zona:'Zona Delta',   dc:'DC04-RS', serv:1, cost:15600, energy:4800,  st:'ativo',   stl:'Ativo' },
  { zona:'Zona Épsilon', dc:'DC05-PE', serv:1, cost:12900, energy:3900,  st:'alerta',  stl:'Alerta' },
];

function montarSeloSituacao(s, l) { 
  return `<span class="badge-status ${normalizarClasseSituacao(s)}"><span class="ponto-status"></span>${l || 'Ativo'}</span>`; 
}

function normalizarClasseSituacao(status) {
  const texto = String(status || 'ativo').toLowerCase();
  if (texto.includes('critic') || texto.includes('ofensor') || texto.includes('alto')) return 'critico';
  if (texto.includes('alert') || texto.includes('medio') || texto.includes('médio')) return 'alerta';
  return 'ativo';
}

function renderizarServidores() {
  return `<table class="tabela-dados"><thead><tr><th>Servidor</th><th>Datacenter</th><th>Zona</th><th>Custo/Mês</th><th>Energia</th><th>Status</th></tr></thead><tbody>
  ${servidoresRows.map(r => `<tr>
    <td><span class="link-servidor">${r.name}</span></td>
    <td>${r.dc}</td><td>${r.zona}</td>
    <td><span class="valor-custo">${formatarMoeda(r.cost)}</span></td>
    <td>${formatarMoeda(r.energy)}</td>
    <td>${montarSeloSituacao(r.st, r.stl)}</td>
  </tr>`).join('')}
  </tbody></table>`;
}

function renderizarZonas(){
  return `<table class="tabela-dados"><thead><tr><th>Zona</th><th>Datacenter</th><th>Servidores</th><th>Custo Total</th><th>Energia</th><th>Status</th></tr></thead><tbody>
  ${zonasRows.map(r => `<tr>
    <td><span class="link-servidor">${r.zona}</span></td>
    <td>${r.dc}</td>
    <td style="font-weight:600;">${r.serv} servidor${r.serv > 1 ? 'es' : ''}</td>
    <td><span class="valor-custo">${formatarMoeda(r.cost)}</span></td>
    <td>${formatarMoeda(r.energy)}</td>
    <td>${montarSeloSituacao(r.st, r.stl)}</td>
  </tr>`).join('')}
  </tbody></table>`;
}

function aplicarDadosTabela(graficos) {
  if (!graficos) return;

  if (Array.isArray(graficos.TOP_SERVIDORES)) {
    aplicarPrincipaisServidores(graficos.TOP_SERVIDORES);
  }

  if (Array.isArray(graficos.TOP_ZONAS)) {
    aplicarPrincipaisZonas(graficos.TOP_ZONAS);
  }

  renderTabelaAtual(false);
}

function aplicarPrincipaisServidores(topServidores) {
  if (!topServidores.length) 
    return;

  servidoresRows = topServidores.map(item => ({
    name: primeiroValorObjeto(item, ['SERVIDOR', 'servidor', 'nome_servidor', 'nomeServidor', 'name', 'nome', 'host'], '-'),
    dc: primeiroValorObjeto(item, ['DATACENTER', 'datacenter', 'DC', 'dc'], '-'),
    zona: primeiroValorObjeto(item, ['ZONA', 'zona', 'zone'], '-'),
    cost: Number(primeiroValorObjeto(item, ['CUSTO', 'custo', 'custo_total', 'CUSTO_TOTAL', 'cost', 'valor'], 0)),
    energy: Number(primeiroValorObjeto(item, ['CUSTO_ENERGIA', 'custo_energia', 'ENERGIA', 'energia', 'energy'], 0)),
    st: primeiroValorObjeto(item, ['STATUS', 'status', 'statusClasse', 'status_classe'], 'ativo'),
    stl: primeiroValorObjeto(item, ['STATUS_LABEL', 'status_label', 'statusLabel', 'STATUS', 'status'], 'Ativo')
  }));
}

function aplicarPrincipaisZonas(topZonas) {
  if (!topZonas.length) 
    return;

  zonasRows = topZonas.map(item => ({
    zona: primeiroValorObjeto(item, ['ZONA', 'zona', 'zone', 'nome', 'name'], '-'),
    dc: primeiroValorObjeto(item, ['DATACENTER', 'datacenter', 'DC', 'dc'], '-'),
    serv: Number(primeiroValorObjeto(item, ['SERVIDORES', 'servidores', 'qtd_servidores', 'quantidade_servidores', 'total_servidores'], 0)),
    cost: Number(primeiroValorObjeto(item, ['CUSTO_TOTAL', 'custo_total', 'CUSTO', 'custo', 'cost', 'valor'], 0)),
    energy: Number(primeiroValorObjeto(item, ['ENERGIA', 'energia', 'CUSTO_ENERGIA', 'custo_energia', 'energy'], 0)),
    st: primeiroValorObjeto(item, ['STATUS', 'status', 'statusClasse', 'status_classe'], 'ativo'),
    stl: primeiroValorObjeto(item, ['STATUS_LABEL', 'status_label', 'statusLabel', 'STATUS', 'status'], 'Ativo')
  }));
}

let curView = 'servidores';

function renderTabelaAtual(animar = true) {
  const w = document.getElementById('table-wrap');
  if (!w) return;

  const html = curView === 'servidores' ? renderizarServidores() : renderizarZonas();
  if (!animar) {
    w.innerHTML = html;
    return;
  }

  w.classList.add('desaparecendo');
  setTimeout(() => {
    w.innerHTML = html;
    w.classList.remove('desaparecendo');
  }, 200);
}

function definirVisualizacaoTabela(view, btn) {
  curView = view;
  const grupoTabela = btn ? btn.closest('.alternador-vista') : null;
  const botoes = grupoTabela ? grupoTabela.querySelectorAll('.btn-alternador') : document.querySelectorAll('.btn-alternador');
  botoes.forEach(b => b.classList.remove('active'));
  if (btn) 
    btn.classList.add('active');
  document.getElementById('table-title').textContent = view === 'servidores' ? 'Top servidores por custo' : 'Top zonas por custo';
  document.getElementById('table-sub').textContent   = view === 'servidores' ? 'Maiores consumidores do orçamento mensal' : 'Custo consolidado por zona de disponibilidade';
  renderTabelaAtual(Boolean(btn));
}



// ══════════════════════════════════════════════
// RELATÓRIOS
  
let relatoriosDisponiveis = [];
let urlRelatorioAtual = '';

const mesesRelatorio = {
  janeiro: 1,
  fevereiro: 2,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

function normalizarTextoRelatorio(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function obterPeriodoRelatorio(nomeArquivo) {
  const nomeNormalizado = normalizarTextoRelatorio(nomeArquivo);
  const correspondencia = nomeNormalizado.match(
    /^relatorio-financeiro-([a-z]+)-(\d{4})\.pdf$/
  );

  if (!correspondencia) {
    return {
      titulo: nomeArquivo.replace(/\.pdf$/i, ''),
      mes: 0,
      ano: 0,
    };
  }

  const nomeMes = correspondencia[1];
  const ano = Number(correspondencia[2]);
  const mes = mesesRelatorio[nomeMes] || 0;
  const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  return {
    titulo: `${mesFormatado} ${ano}`,
    mes,
    ano,
  };
}

function formatarTamanhoArquivo(bytes) {
  const tamanho = Number(bytes || 0);
  if (tamanho < 1024) return `${tamanho} B`;
  if (tamanho < 1024 * 1024) return `${(tamanho / 1024).toFixed(1)} KB`;
  return `${(tamanho / (1024 * 1024)).toFixed(1)} MB`;
}

async function buscarRelatoriosS3() {
  const lista = document.getElementById('reports-list');
  if (!lista) return;

  lista.innerHTML = '<div class="estado-lista-relatorios">Buscando relatórios na S3...</div>';

  try {
    const resposta = await fetch('/financeira/relatorios');
    if (!resposta.ok) throw new Error('Não foi possível carregar os relatórios.');

    relatoriosDisponiveis = await resposta.json();
    relatoriosDisponiveis = relatoriosDisponiveis
      .map(relatorio => ({
        ...relatorio,
        periodo: obterPeriodoRelatorio(relatorio.nomeArquivo),
      }))
      .sort((a, b) => {
        const ordemA = (a.periodo.ano * 100) + a.periodo.mes;
        const ordemB = (b.periodo.ano * 100) + b.periodo.mes;
        return ordemB - ordemA;
      });

    renderizarListaRelatorios();
  } catch (erro) {
    console.error('Erro ao buscar relatórios financeiros:', erro);
    lista.innerHTML = `
      <div class="estado-lista-relatorios erro">
        Não foi possível carregar os relatórios financeiros.
      </div>`;
  }
}

function renderizarListaRelatorios() {
  const lista = document.getElementById('reports-list');
  if (!lista) return;

  if (!relatoriosDisponiveis.length) {
    lista.innerHTML = `
      <div class="estado-lista-relatorios">
        Nenhum relatório PDF foi encontrado na pasta relatorios/.
      </div>`;
    return;
  }

  lista.innerHTML = relatoriosDisponiveis.map((relatorio, indice) => `
      <div class="item-relatorio">
        <div class="icone-doc-relatorio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div>
          <div class="nome-relatorio">${relatorio.periodo.titulo}</div>
          <div class="data-relatorio">${relatorio.nomeArquivo}</div>
        </div>
        <div class="meta-relatorio">
          <div class="item-meta-relatorio">
            <div class="rotulo-meta-relatorio">Formato</div>
            <div class="valor-meta-relatorio">PDF</div>
          </div>
          <div class="item-meta-relatorio">
            <div class="rotulo-meta-relatorio">Tamanho</div>
            <div class="valor-meta-relatorio">${formatarTamanhoArquivo(relatorio.tamanho)}</div>
          </div>
        </div>
        <button class="btn-baixar" data-indice-relatorio="${indice}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Visualizar
        </button>
      </div>
  `).join('');

  lista.querySelectorAll('[data-indice-relatorio]').forEach(botao => {
    botao.addEventListener('click', () => {
      const indice = Number(botao.dataset.indiceRelatorio);
      abrirRelatorioS3(relatoriosDisponiveis[indice]);
    });
  });
}

async function abrirRelatorioS3(relatorio) {
  if (!relatorio) return;

  const modal = document.getElementById('report-full-modal');
  const titulo = document.getElementById('report-modal-title');
  const subtitulo = document.getElementById('report-modal-sub');
  const corpo = document.getElementById('report-doc-body');
  if (!modal || !titulo || !subtitulo || !corpo) return;

  titulo.textContent = `Relatório Financeiro - ${relatorio.periodo.titulo}`;
  subtitulo.textContent = relatorio.nomeArquivo;
  corpo.classList.add('pdf-ativo');
  corpo.innerHTML = '<div class="estado-lista-relatorios">Carregando PDF...</div>';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  try {
    const resposta = await fetch(
      `/financeira/relatorios/url?chave=${relatorio.chave}`
    );
    if (!resposta.ok) throw new Error('Não foi possível abrir o relatório.');

    const dados = await resposta.json();
    urlRelatorioAtual = dados.url;

    const visualizador = document.createElement('iframe');
    visualizador.className = 'visualizador-pdf-relatorio';
    visualizador.src = urlRelatorioAtual;
    visualizador.title = `Relatório financeiro de ${relatorio.periodo.titulo}`;
    corpo.replaceChildren(visualizador);
  } catch (erro) {
    console.error('Erro ao abrir relatório financeiro:', erro);
    corpo.innerHTML = `
      <div class="estado-lista-relatorios erro">
        Não foi possível abrir este relatório.
      </div>`;
  }
}

function abrirRelatorioEmNovaAba() {
  if (urlRelatorioAtual) {
    window.open(urlRelatorioAtual, '_blank', 'noopener');
  }
}

function fecharModalRelatorio() {
  const modal = document.getElementById('report-full-modal');
  const corpo = document.getElementById('report-doc-body');
  if (modal) modal.classList.remove('active');
  if (corpo) {
    corpo.classList.remove('pdf-ativo');
    corpo.innerHTML = '';
  }
  urlRelatorioAtual = '';
  document.body.style.overflow = '';
}



document.getElementById('report-full-modal').addEventListener('click', function (e) {
  if (e.target === this) fecharModalRelatorio();
});

document.getElementById('roi-modal').addEventListener('click', function (e) {
  if (e.target === this) fecharModalRoi();
});

document.getElementById('modal-preditivo').addEventListener('click', function (e) {
  if (e.target === this) fecharModalPreditivo();
});

// ══════════════════════════════════════════════
// INICIALIZAÇÃO
 
document.addEventListener('DOMContentLoaded', () => {

  //Plotar grafico
  buscarDados();
  
  // Gráfico de linha (período padrão: 12 meses)
  definirPeriodoGrafico('12m', document.querySelector('.btn-periodo.active:not(.botao-periodo-roi)'));

  setInterval(() => {
    if (periodoGraficoLinha === '24h') buscarDados();
  }, 60000);

  // Donut
  construirGraficoRosca();

  // Bar
  construirGraficoBarra();

  // Tabela
  // definirVisualizacaoTabela('servidores', true);

     // Relatórios
  buscarRelatoriosS3();
});
