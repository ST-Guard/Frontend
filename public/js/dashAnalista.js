window.onload = () => {
    buscarDados()
    obter_todos_dados() 
    setTimeout(obter_todos_dados, 3000);
}
function fnNavegar(caminho){
    window.location.href = caminho
}
if (!sessionStorage.ID_USUARIO) {
    conteiner_msg.innerHTML = "Você precisa estar logado!"
    loadingModal()
    window.location = "login.html";
}

let idDataCenterSelecionado = null;

function buscarDados() {
    const idUsuario = sessionStorage.ID_USUARIO
    
    fetch(`/sessao/buscarUsuario/${idUsuario}`, {
    })
      .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dados) {
        dados = dados[0]

        console.log(dados)
        username.innerHTML = dados.nomePessoa
        cargoname.innerHTML = dados.cargo
        zonaTitulo.innerHTML = dados.nomeZona
        //dataCenterTitulo.innerHTML = dados.nomeDataCenter
        if (dados.imagem) {
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })}


  var dados_merge_json = ""



function  obter_todos_dados(){
    console.log("Chamando os dados")

    var zonas_usuario = []
    var empresa_usuario = null
    var nome_datacenter = null
    var dados_do_s3 = null
    var servidores_usuario = []

    var dados_juntos = ""




    // buscando as zonas do usuario    
    fetch("/bzonas/BuscarZonas", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
                idUsuario: sessionStorage.ID_USUARIO
            })

    }).then(function(resposta) {
        resposta_json = resposta.json()
        return resposta_json
       
    }).then(function(dados) {
         var zonas = dados.resultadoenvio
         var mensagem = ""

         var_options = ""

         for(i = 0; i < zonas.length; i++) {

            zonas_usuario.push(zonas[i].nome)
     
            var zona_nome =  zonas[i].nome
            var_options  += `<option value="${zona_nome}">${zona_nome}</option>`

         }

         select_zonas.innerHTML = `                  <option value="valor_vazio">SELECIONE A ZONA</option>       ${var_options}`

       if(empresa_usuario != null && nome_datacenter != null && dados_do_s3 != null && zonas_usuario.length >= 1){

        console.log("OS DADOS CHEGARAM")
        console.log(empresa_usuario)
        console.log(nome_datacenter)
        console.log(dados_do_s3)
        
        console.log(zonas_usuario)



        dados_juntos = dados_do_s3[empresa_usuario][nome_datacenter]





        zonas_dados = []
        for (i = 0; i < zonas_usuario.length; i++ ) {


        var nome_zona = zonas_usuario[i]
    

        var zona_atual = dados_juntos[nome_zona]
    zonas_dados.push({ nome_zona: zonas_usuario[i], dados: zona_atual })
        }

        dados_merge = {total_trafego: dados_juntos.TOTAL_JOGADORES_DATACENTER, zonas: zonas_dados}
        

        console.log("JUNTANDO OS DADOS DO USUARIO FICOU: ")
        console.log(dados_merge)

        plotarDadosGKPis(dados_merge)
        dados_merge_json = dados_merge




        var data_center = document.getElementById("data_center_id")

        data_center.innerHTML = nome_datacenter
    }





     
    }).catch(function(erro) {
        console.log("Existe algum erro na aplicação")
        console.log(erro)
    })






    // buscando os dados da empresa
         fetch("/bzonas/BuscarEmpresa", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
                idUsuario: sessionStorage.ID_USUARIO
            })

    }).then(function(resposta) {

        resposta_json = resposta.json()
        return resposta_json
       
        
    }).then(function(dados) {
        var dados_empresa = dados.resultadoenvio

        empresa_usuario = dados_empresa[0]
        empresa_usuario = empresa_usuario.razaoSocial

        nome_datacenter = dados_empresa[0].datacenter
        console.log("o nome do datacenter é ", nome_datacenter)


        for(i = 0; i < dados_empresa.length; i++){

            servidor = dados_empresa[i].nome
            servidores_usuario.push(servidor)
        }



       if(empresa_usuario != null && nome_datacenter != null && dados_do_s3 != null && zonas_usuario.length >= 1){

        console.log("OS DADOS CHEGARAM")
        console.log(empresa_usuario)
        console.log(nome_datacenter)
        console.log(dados_do_s3)
        
        console.log(zonas_usuario)



  
        



        dados_juntos = dados_do_s3[empresa_usuario][nome_datacenter]
        



        zonas_dados = []
        for (i = 0; i < zonas_usuario.length; i++ ) {


        var nome_zona = zonas_usuario[i]
    

        var zona_atual = dados_juntos[nome_zona]
    zonas_dados.push({ nome_zona: zonas_usuario[i], dados: zona_atual })
        }

        dados_merge = {total_trafego: dados_juntos.TOTAL_JOGADORES_DATACENTER, zonas: zonas_dados}
        

        console.log("JUNTANDO OS DADOS DO USUARIO FICOU: ")
        console.log(dados_merge)

        plotarDadosGKPis(dados_merge)
        dados_merge_json = dados_merge
        




        var data_center = document.getElementById("data_center_id")

        data_center.innerHTML = nome_datacenter
    }





    
    }).catch(function(erro) {
        console.log("Existe algum erro na aplicação")
        console.log(erro)
    })




    // buscando os dados gerais do analista
            fetch("/banalista/buscarDadosAnalista_Gerais", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
        },


    }).then(function(resposta) {

        resposta_json = resposta.json()
        return resposta_json
       
        
    }).then(function(dados) {
        
        console.log(dados)


        var dados_gerais  = dados

        dados_do_s3 = dados_gerais["KPIS"]




       if(empresa_usuario != null && nome_datacenter != null && dados_do_s3 != null && zonas_usuario.length >= 1){

        console.log("OS DADOS CHEGARAM")
        console.log(empresa_usuario)
        console.log(nome_datacenter)
        console.log(dados_do_s3)
        
        console.log(zonas_usuario  
        )



        



        dados_juntos = dados_do_s3[empresa_usuario][nome_datacenter]
        
        zonas_dados = []
        for (i = 0; i < zonas_usuario.length; i++ ) {


        var nome_zona = zonas_usuario[i]
    

        var zona_atual = dados_juntos[nome_zona]
    zonas_dados.push({ nome_zona: zonas_usuario[i], dados: zona_atual })
        }

        dados_merge = {total_trafego: dados_juntos.TOTAL_JOGADORES_DATACENTER, zonas: zonas_dados}
        

        console.log("JUNTANDO OS DADOS DO USUARIO FICOU: ")
        console.log(dados_merge)

        plotarDadosGKPis(dados_merge)
        dados_merge_json = dados_merge
        




        var data_center = document.getElementById("data_center_id")

        data_center.innerHTML = nome_datacenter
    }



        
    }).catch(function(erro) {
        console.log("Existe algum erro na aplicação")
        console.log(erro)
    })




    }








function plotarDadosGKPis(dados_zonas_json) {
    


    console.log("VAMOS PLOTAR OS DADOS DAS KPIS")

    trafego_dt.innerHTML = `${new Intl.NumberFormat('pt-BR', {style: 'decimal'}).format(Number((dados_zonas_json.total_trafego)))} mil`


    var zona_matriz = []
    var servidores_matriz = []


    for (i = 0; i < dados_zonas_json.zonas.length; i++){

    var dado_zona_atual = dados_zonas_json.zonas[i]
    var nome_zona = dado_zona_atual.nome_zona
    var dados_zona  = dado_zona_atual.dados



    if (dados_zona == null) {
        console.log("Zona sem dados:", nome_zona)
        continue
    }

    
        var servidores_zona = dados_zona.servidores_zona
        var chaves_zonas = Object.keys(servidores_zona)




        for(l = 0; l < chaves_zonas.length; l++){
            servidor_atual = servidores_zona[chaves_zonas[l]]


            servidores_matriz.push([
                servidor_atual.NOME_ZONA,
                servidor_atual.NOME_SERVIDOR,
                servidor_atual.CPU,
                servidor_atual.RAM,
                servidor_atual.DISCO,
                servidor_atual.SCORE_SERVIDOR              
            ])
        }



        var quantidade_computadores = dados_zona.QUANTIDADE_SERVIDORES
        var quantidade_sobrecarregados = dados_zona.QUANTIDADE_SOBRECAREGADOS
        var quantidade_alta_latencia = dados_zona.QUANTIDADE_ALTA_LATENCIA
        var P99_latencia = dados_zona.P99_LATENCIA
        var total_disco = dados_zona.TOTAL_DISCO
        var quantidade_em_abero = dados_zona.QUANTIDADE_ALERTA_ABERTOS
        var mttr_zona = dados_zona.MTTR_ZONA



    
    



        zona_matriz.push([nome_zona, 
        quantidade_computadores, 
        quantidade_sobrecarregados, 
        quantidade_alta_latencia, 
        P99_latencia,
        total_disco, 
        quantidade_em_abero, 
        mttr_zona
    ])

        

    }



    // ordenando os servidores
    servidores_matriz.sort((a, b) => b[5] - a[5])

    var servidores_ordenados = servidores_matriz



    conteudo = ""
    for( i= 0; i < servidores_ordenados.length; i++){


        


        var servidor = servidores_ordenados[i]
        
    
        if (servidor[5] > 50){
        conteudo += `
                                                                        <div class="div_server"  style="border: 2px solid red">
                            
                            <div class="div_nomeServer" onclick="mudarTelaEspecifica('${servidor[1]}')">
                                <div class="div_titulos_info">
                                <h1>${i + 1}-</h1>
                                
                                <img src="./../assets/dashboard-icons/server.svg" alt="">

                                <div class="titulos_info">

                                <h4><span id="nomeServer">${servidor[0]}</span></h4>
                                <h4><span id="nomeServer">${servidor[1]}</span></h4>
                                </div>
                                </div>
                                <div  class="div_info_cpu">
                                <img src="./../assets/dashboard-icons/icon_kpiCPU.svg" alt="">
                                <h4>CPU</h4>
                                <h4>${servidor[2]}</h4>
                                </div>
                                <div class="div_info_ram">
                                <img src="./../assets/dashboard-icons/icon_ram.svg" alt="">
                                <h4>RAM</h4>
                                <h4>${servidor[3]}</h4>
                                </div>
                                <div class="div_info_disco">
                                <img src="./../assets/dashboard-icons/icon_kpiDisco.svg" alt="">
                                <H4>DISCO</H4>
                                <h4>${servidor[4]}</h4>
                                </div>

                            </div>
                        </div>
        
        
        
        `



        } else {
                    conteudo += `
                                                                        <div class="div_server">
                            
                            <div class="div_nomeServer" onclick="mudarTelaEspecifica('${servidor[1]}')">
                                <div class="div_titulos_info">
                                <h1>${i + 1}-</h1>
                                
                                <img src="./../assets/dashboard-icons/server.svg" alt="">

                                <div class="titulos_info">

                                <h4><span id="nomeServer">${servidor[0]}</span></h4>
                                <h4><span id="nomeServer">${servidor[1]}</span></h4>
                                </div>
                                </div>
                                <div  class="div_info_cpu">
                                <img src="./../assets/dashboard-icons/icon_kpiCPU.svg" alt="">
                                <h4>CPU</h4>
                                <h4>${servidor[2]}</h4>
                                </div>
                                <div class="div_info_ram">
                                <img src="./../assets/dashboard-icons/icon_ram.svg" alt="">
                                <h4>RAM</h4>
                                <h4>${servidor[3]}</h4>
                                </div>
                                <div class="div_info_disco">
                                <img src="./../assets/dashboard-icons/icon_kpiDisco.svg" alt="">
                                <H4>DISCO</H4>
                                <h4>${servidor[4]}</h4>
                                </div>

                            </div>
                        </div>
        
        
        
        `


        }







    }




    conteudoServCrit.innerHTML  =  `                        <div class="conteudoTitulo">
                            <h1>Servidores - Ordem de Criticidade</h1>

                        </div>
    ${conteudo}`



    /// KPIS
    var kpi_em_abertos_ordenada = []
    var mttr_ordenado = []
    var kpi_sobrecarregados_ordenado = []



    for(var  i = 0; i < zona_matriz.length; i++){


        servidor_atual = zona_matriz[i]


        var nome_zona = servidor_atual[0]
        var qtd_servidores = servidor_atual[1]
        var sobrecarregados = servidor_atual[2]
        var quantidade_alertas_abertos = servidor_atual[6]
        var mttr = servidor_atual[7]




        var porcentagem = 0
        var porcentagem_sobrecarregados =  0


        if (qtd_servidores > 0){
            porcentagem  = quantidade_alertas_abertos * 100 / qtd_servidores
            porcentagem_sobrecarregados = quantidade_sobrecarregados * 100 /qtd_servidores
        } else {
            porcentagem = 0
            porcentagem_sobrecarregados = 0
        }


    





        kpi_em_abertos_ordenada.push({nome_zona: nome_zona, qtd_servidores: qtd_servidores, aberto: quantidade_alertas_abertos, porcentagem: porcentagem})
        mttr_ordenado.push({nome_zona: nome_zona, mttr: mttr})
        kpi_sobrecarregados_ordenado.push({nome_zona: nome_zona, qtd_servidores: qtd_servidores, sobrecarregados: quantidade_sobrecarregados, porcentagem: porcentagem_sobrecarregados})


    }



    kpi_em_abertos_ordenada.sort((a, b) => b.porcentagem - a.porcentagem)



    var ultima = kpi_em_abertos_ordenada[0]

    if(ultima.porcentagem > 60){


            kpi1.innerHTML = `
                        <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3 style="font-size: 18px;">ZONA COM A MAIOR QUANTIDADE DE ALERTAS EM ABERTO</h3>
                        </div>
                        <div class="div_situacao">
                            <h1>${ultima.nome_zona}</h1>
                            <img src="../assets/dashboard-icons/icon_alerta.svg" alt="">
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px;">${ultima.aberto}/${ultima.qtd_servidores} EM ALERTA</h1>
                            <img src="../assets/dashboard-icons/icon_alerta.svg" alt="">
                        </div>

                    </div>
    `




    } else if(ultima.porcentagem > 1){
            
    kpi1.innerHTML = `
                        <div class="info_kpi" style="">
                        <div class="containerTitulo">
                            <h3 style="font-size: 18px;">ZONA COM A MAIOR QUANTIDADE DE ALERTAS EM ABERTO</h3>
                        </div>
                        <div class="div_situacao">
                            <h1>${ultima.nome_zona}</h1>
                            <img src="../assets/dashboard-icons/icon_alerta.svg" alt="">
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px;">${ultima.aberto}/${ultima.qtd_servidores} EM ALERTA</h1>
                            <img src="../assets/dashboard-icons/icon_alerta.svg" alt="">
                        </div>

                    </div>
    `
    kpi1.style.border = "1px solid var(--KPI-importante)"
    kpi1.style.boxShadow = "1.5px 1px 2px 1px #23B26D, 0 4px 12px rgba(0,0,0,0.1)"


    } else {


    
    kpi1.innerHTML = `                                   
                    <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3 style="font-size: 18px;">ZONA COM A MAIOR QUANTIDADE DE ALERTAS EM ABERTO</h3>
                        </div>
                        <div class="div_situacao">
                            <h1 style="color: #23B26D; ">${ultima.nome_zona}</h1>
                           
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px; color: #23B26D;">${ultima.aberto}/${ultima.qtd_servidores} EM ALERTA</h1>
                            
                        </div>

                    </div>
                
    `
    kpi1.style.border = "1px solid var(--KPI-normal)"
    kpi1.style.boxShadow = "1.5px 1px 2px 1px #23B26D, 0 4px 12px rgba(0,0,0,0.1)"
                }
        mttr_ordenado.sort((a, b) => b.mttr - a.mttr)
    
        maior_mttr = mttr_ordenado[0]
        maior_mttr.mttr = parseFloat((maior_mttr.mttr / 60 ).toFixed(2))


        if (maior_mttr.mttr > 24) {
            kpi2.innerHTML = `
                            
                    <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3>ZONA COM MAIOR MTTR</h3>
                        </div>
                        <div class="div_situacao">
                            <h1 style="color: var(--KPI-urgente)">${maior_mttr.nome_zona}</h1>
                            <img src="../assets/dashboard-icons/icon_atencao.svg" alt="">
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px; color: var(--KPI-urgente);">${new Date(maior_mttr.mttr * 3600 * 1000).toISOString().substr(11, 5)} HORAS </h1>
                            <img src="../assets/dashboard-icons/icon_atencao.svg" alt="">
                        </div>

                    </div>
               `
kpi2.style.border = "1px solid var(--KPI-urgente)"
kpi2.style.boxShadow = "1.5px 1px 2px 1px var(--KPI-urgente), 0 4px 12px rgba(0,0,0,0.1)"



        }else if(maior_mttr.mttr > 4){


                        kpi2.innerHTML = `
                            
                    <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3>ZONA COM MAIOR MTTR</h3>
                        </div>
                        <div class="div_situacao">
                            <h1 style="color: var(--KPI-importante)">${maior_mttr.nome_zona}</h1>
                            <img src="../assets/dashboard-icons/icon_atencao.svg" alt="">
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px; color: var(--KPI-importante);">${new Date(maior_mttr.mttr * 3600 * 1000).toISOString().substr(11, 5)}  HORAS </h1>
                            <img src="../assets/dashboard-icons/icon_atencao.svg" alt="">
                        </div>

                    </div>
               `
kpi2.style.border = "1px solid var(--KPI-importante)"
kpi2.style.boxShadow = "1.5px 1px 2px 1px var(--KPI-importante), 0 4px 12px rgba(0,0,0,0.1)"

        } else {
                        kpi2.innerHTML = `
                            
                    <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3>ZONA COM MAIOR MTTR</h3>
                        </div>
                        <div class="div_situacao">
                            <h1 style="color: var(--KPI-normal)">${maior_mttr.nome_zona}</h1>
                            <img src="../assets/dashboard-icons/icon_atencao.svg" alt="">
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px; color: var(--KPI-normal);">${new Date(maior_mttr.mttr * 3600 * 1000).toISOString().substr(11, 5)}  HORAS </h1>
                            <img src="../assets/dashboard-icons/icon_atencao.svg" alt="">
                        </div>

                    </div>
               `


kpi2.style.border = "1px solid var(--KPI-normal)"
kpi2.style.boxShadow = "1.5px 1px 2px 1px var(--KPI-normal), 0 4px 12px rgba(0,0,0,0.1)"
kp2.h1.style.color = "ar(--KPI-normal)"

        }


    kpi_sobrecarregados_ordenado.sort((a, b) => b.porcentagem - a.porcentagem)
    console.log(kpi_sobrecarregados_ordenado)
    maior_zona_sobrecarregada = kpi_sobrecarregados_ordenado[0]


    console.log(maior_zona_sobrecarregada)
    if (maior_zona_sobrecarregada.porcentagem > 60){
            kpi4.innerHTML = ` 
                   
                        <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3 style="font-size: 18px;">ZONA COM A MAIOR QUANTIDADE DE SERVIDORES SOBRECARREGADOS</h3>
                        </div>
                        <div class="div_situacao">
                            <h1  style="color: var(--KPI-urgente)">${maior_zona_sobrecarregada.nome_zona}</h1>

                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px;  color: var(--KPI-urgente);">${maior_zona_sobrecarregada.sobrecarregados}/${maior_zona_sobrecarregada.qtd_servidores} SOBRECARREGADOS</h1>

                        </div>
    `

    kpi4.style.border = "1px solid var(--KPI-urgente)"
kpi4.style.boxShadow = "1.5px 1px 2px 1px var(--KPI-urgente), 0 4px 12px rgba(0,0,0,0.1)"

    }

    else if (maior_zona_sobrecarregada.porcentagem > 1){
            kpi4.innerHTML = ` 
                   
                        <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3 style="font-size: 18px;">ZONA COM A MAIOR QUANTIDADE DE SERVIDORES SOBRECARREGADOS</h3>
                        </div>
                        <div class="div_situacao">
                            <h1  style="color: var(--KPI-importante)">${maior_zona_sobrecarregada.nome_zona}</h1>

                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px;  color: var(--KPI-importante);">${maior_zona_sobrecarregada.sobrecarregados}/${maior_zona_sobrecarregada.qtd_servidores} SOBRECARREGADOS</h1>

                        </div>
    `

    kpi4.style.border = "1px solid var(--KPI-importante)"
kpi4.style.boxShadow = "1.5px 1px 2px 1px var(--KPI-importante), 0 4px 12px rgba(0,0,0,0.1)"



    } else {
            kpi4.innerHTML = ` 
                   
                        <div class="info_kpi">
                        <div class="containerTitulo">
                            <h3 style="font-size: 18px;">ZONA COM A MAIOR QUANTIDADE DE SERVIDORES SOBRECARREGADOS</h3>
                        </div>
                        <div class="div_situacao">
                            <h1  style="color: var(--KPI-normal)">${maior_zona_sobrecarregada.nome_zona}</h1>
                            <img src="../assets/dashboard-icons/icon_check.svg" alt="">
                        </div>
                        <div class="div_situacao">
                            <h1 style="font-size: 20px;  color: var(--KPI-normal);">${maior_zona_sobrecarregada.sobrecarregados}/${maior_zona_sobrecarregada.qtd_servidores} SOBRECARREGADOS</h1>
                            <img src="../assets/dashboard-icons/icon_check.svg" alt="">
                        </div>
    `

    kpi4.style.border = "1px solid var(--KPI-normal)"
kpi4.style.boxShadow = "1.5px 1px 2px 1px var(--KPI-normal), 0 4px 12px rgba(0,0,0,0.1)"
kp4.h1.style.color = "ar(--KPI-normal)"

    }


}






function buscarZonaGrafico() {
    var valor_select_zona = select_zonas.value
    if(valor_select_zona != "valor_vazio") {
        titulo_zona.innerHTML = ` 
                <h1>Panorama - ${valor_select_zona}</h1>
                <h2>Visão de primeiras investigações.</h2>
        
        `
        graficos_parte2.style.display = "block"
        titulo_grafico1.innerHTML = `Trafego total comparado ao dia da semana anterior ${valor_select_zona}`
         
        titulo_grafico3.innerHTML = `Correlação entre o Disco em cache x P99 latencia da ${valor_select_zona} `

        plotar_dados(valor_select_zona)

        
    
    } else {
                titulo_zona.innerHTML = ` 
                <h1>Selecione uma zona</h1>
                <h2>Visão de primeiras investigações.</h2>
        
        `
              graficos_parte2.style.display = "none"
    }
}



function plotar_dados(value){
    var valor_selecionado = value
    var json = dados_merge_json.zonas


    var chave = valor_selecionado;

    console.log(json)
    console.log(chave)


    console.log("ESTOU SEPARANDO OS DADOS PARA AS DASHBOARDS")
    console.log(chave)
    console.log(typeof(json))




    json_para_selecionar_dados = ""

    for (i = 0; i < json.length; i++){
        valor_atual = json[i]
        chave_json = json[i].nome_zona
      


        if(chave_json == chave){
            json_para_selecionar_dados =  valor_atual
            console.log("O VALOR SELECIONADO É: ")
            console.log(json_para_selecionar_dados)

        } else {
            
        }
        
    }



    console.log("este é o json para selecionar os dados")

    console.log(json_para_selecionar_dados)



    var dados_gerais = json_para_selecionar_dados.dados







    var dia_semana = dados_gerais.DIA_SEMANA

    var dia_semana_item = document.getElementById("dia_semana")
    dia_semana_item.innerHTML = `Dia atual:  ${dia_semana}`
    var semana_anterior = dados_gerais.JOGADORES_SEMANA_ANTERIOR
    var dia_atual = dados_gerais.JOGADORES_ZONA
    console.log(typeof dados_gerais["data-hora"])
    var hora_agora = new Date(dados_gerais["data-hora"])


    var p99 = dados_gerais.P99_LATENCIA
    var TOTAL_DISCO = dados_gerais.TOTAL_DISCO

    var qtd_sobrecarregados = dados_gerais.QUANTIDADE_SOBRECAREGADOS
    var qtd_alta_latencia = dados_gerais.QUANTIDADE_ALTA_LATENCIA


    hora_agora = hora_agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })



    var json_montado = {dia: dia_semana, semana_anterior: semana_anterior, dia_atual: dia_atual, hora: hora_agora}

    var json_p99 = {hora: hora_agora, p99: p99, disco: TOTAL_DISCO}


    var json_correlacao = {hora: hora_agora, sobrecarregados: qtd_sobrecarregados, latencia: qtd_alta_latencia}
    
    console.log(json_montado)


    plotarGrafico_trafego(json_montado, chave)

    plotarGrafico_p99_disco(json_p99, chave)

    plotarGrafico_correlacao(json_correlacao, chave)




}

function plotarGrafico_correlacao(dados_info, chaves_zona){
        console.log('iniciando plotagem do gráfico...');


        // Criando estrutura para plotar gráfico - labels
        let labels = [];
        
        let dados = {
    data: {


        labels: [],
        datasets: [{
            label: 'Quantidade de sobrecarregados',
            data: [],
            borderColor: '#66C0F4',
            borderWidth: 4,
            pointRadius: 2,
            tension: 0.3     
        }, {
            label: 'Quantidade com latencia alta',
            data: [],
            borderColor: '#FFBB00',   
            borderWidth: 4,
            pointRadius: 2,

            tension: 0.3   
        }]
  
    
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,

      scales: {
        y: {
          
          ticks: {
            
            color: '#6B7280'

        }
    },
        x: {

          ticks: {
            
            color: '#6B7280'

        }
        }
      },

    }

        }


        console.log('----------------------------------------------')
        console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
        console.log(dados_info)


                // Inserindo valores recebidos em estrutura para plotar o gráfico
       
            var registro = dados_info;
            dados.data.labels.push(registro.hora);
            dados.data.datasets[0].data.push(registro.sobrecarregados);
            dados.data.datasets[1].data.push(registro.latencia);
        

        console.log('----------------------------------------------')
        console.log('O gráfico será plotado com os respectivos valores:')
        console.log('Labels:')
        console.log(labels)
        console.log('Dados:')
        console.log(dados.data.datasets)
        console.log('----------------------------------------------')


        const config = {
            type: 'line',
            data: dados.data,
                options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,

      scales: {
        y: {
          
          ticks: {
            
            color: '#6B7280'

        }
    },
        x: {

          ticks: {
            
            color: '#6B7280'

        }
        }
      },

    }




        }



                var grafico = Chart.getChart('myChart4')
    




        if(grafico != undefined){
            grafico.destroy()
        }


                let myChart = new Chart(
            document.getElementById(`myChart4`),
            config
        );




        setTimeout(() => atualizarGrafico(chaves_zona, dados, myChart, "correlacao"), 30000);

}


function plotarGrafico_p99_disco(dados_info, chaves_zona){


        console.log('iniciando plotagem do gráfico...');


        // Criando estrutura para plotar gráfico - labels
        let labels = [];


                let dados = {
    data: {


        labels: [],
        datasets: [{
            label: 'Quantidade total de Armazenamento',
            data: [],
            borderColor: '#2B2377',
            borderWidth: 4,    
            tension: 0.1,
            fill: true,
            backgroundColor: 'rgba(126, 184, 255, 0.29)',  
        }, {
            label: 'Quantidade com latencia alta',
            data: [],
            borderColor: '#FFC100',
            borderWidth: 4,
            tension: 0.1      
        }]
  
    
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,

      scales: {
        y: {
          
          ticks: {
            
            color: '#6B7280'

        }
    },
        x: {

          ticks: {
            
            color: '#6B7280'

        }
        }
      },

    }
  
        };

        console.log('----------------------------------------------')
        console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
        console.log(dados_info)


                // Inserindo valores recebidos em estrutura para plotar o gráfico
       
            var registro = dados_info;
            dados.data.labels.push(registro.hora);
            dados.data.datasets[0].data.push(registro.disco);
            dados.data.datasets[1].data.push(registro.p99);
        

        console.log('----------------------------------------------')
        console.log('O gráfico será plotado com os respectivos valores:')
        console.log('Labels:')
        console.log(labels)
        console.log('Dados:')
        console.log(dados.data.datasets)
        console.log('----------------------------------------------')


                const config = {
            type: 'line',
            data: dados.data,
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,

      scales: {
        y: {
          
          ticks: {
            
            color: '#6B7280'

        }
    },
        x: {

          ticks: {
            
            color: '#6B7280'

        }
        }
      },

    }

        };




                var grafico = Chart.getChart('myChart3')
    




        if(grafico != undefined){
            grafico.destroy()
        }






                // Adicionando gráfico criado em div na tela
        let myChart = new Chart(
            document.getElementById(`myChart3`),
            config
        );


        setTimeout(() => atualizarGrafico(chaves_zona, dados, myChart, "volume"), 30000);


}













    function plotarGrafico_trafego(dados_trafego, chave_zona) {

        console.log('iniciando plotagem do gráfico...');

  

        // Criando estrutura para plotar gráfico - labels
        let labels = [];

        // Criando estrutura para plotar gráfico - dados
        let dados = {
    data: {


        labels: [],
        datasets: [{
            label: 'Quantidade de jogadores na sexta passada',
            data: [],
            borderColor: '#244770',
            borderWidth: 4,
            tension: 0.1,
                     
        }, {
            label: 'Quantidade com latencia alta',
            data: [],
            borderColor: '#66C0F4',
            borderWidth: 4,
            tension: 0.1,
            
        }]
  
    
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,

      scales: {
        y: {
          
          ticks: {
            stepSize: 50,
            color: '#6B7280'

        }
    },
        x: {

          ticks: {
            stepSize: 25,
            color: '#6B7280'

        }
        }
      },

    }
        };

        console.log('----------------------------------------------')
        console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
        console.log(dados_trafego)

        // Inserindo valores recebidos em estrutura para plotar o gráfico
       
            var registro = dados_trafego;
            dados.data.labels.push(registro.hora);
            dados.data.datasets[0].data.push(registro.semana_anterior);
            dados.data.datasets[1].data.push(registro.dia_atual);
        

        console.log('----------------------------------------------')
        console.log('O gráfico será plotado com os respectivos valores:')
        console.log('Labels:')
        console.log(labels)
        console.log('Dados:')
        console.log(dados.data.datasets)
        console.log('----------------------------------------------')

        // Criando estrutura para plotar gráfico - config
        const config = {
            type: 'line',
            data: dados.data,
            options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,

      scales: {
        y: {
          
          ticks: {
            stepSize: 50,
            color: '#6B7280'

        }
    },
        x: {

          ticks: {
            stepSize: 25,
            color: '#6B7280'

        }
        }
      },

    }
        };



        var grafico = Chart.getChart('myChart')
    




        if(grafico != undefined){
            grafico.destroy()
        }
         


        // Adicionando gráfico criado em div na tela
        let myChart = new Chart(
            document.getElementById(`myChart`),
            config
        );
        
        setTimeout(() => atualizarGrafico(chave_zona, dados, myChart, "trafego"), 30000);
     
    }




      function atualizarGrafico(zonai, dados_grafico, myChart, tipo) {

        console.log("OLHA ESTOU AQUI ATUALIZANDO OS GRAFICOS E PRONTO PARA SELECIONAR ELES")
        console.log("A CHAVE DA ZONA: ", zonai)
        console.log("OS DADOS DELA: ", dados_grafico)
        console.log("O ID DO MYCHART: ", myChart)



            var zonas_usuario = []
    var empresa_usuario = null
    var nome_datacenter = null
    var dados_do_s3 = null
    var servidores_usuario = []

    var dados_juntos = ""


 fetch("/bzonas/BuscarZonas", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
                idUsuario: sessionStorage.ID_USUARIO
            })

    }).then(function(resposta) {
        resposta_json = resposta.json()
        return resposta_json
       
    }).then(function(dados) {
         var zonas = dados.resultadoenvio
         var mensagem = ""

         var_options = ""

         for(i = 0; i < zonas.length; i++) {

            zonas_usuario.push(zonas[i].nome)
     
            var zona_nome =  zonas[i].nome
            var_options  += `<option value="${zona_nome}">${zona_nome}</option>`

         }

         select_zonas.innerHTML = `                  <option value="valor_vazio">SELECIONE A ZONA</option>       ${var_options}`

       if(empresa_usuario != null && nome_datacenter != null && dados_do_s3 != null && zonas_usuario.length >= 1){

        console.log("OS DADOS CHEGARAM")
        console.log(empresa_usuario)
        console.log(nome_datacenter)
        console.log(dados_do_s3)
        
        console.log(zonas_usuario)
        dados_juntos = dados_do_s3[empresa_usuario][nome_datacenter]
        
        zonas_dados = []
        for (i = 0; i < zonas_usuario.length; i++ ) {


        var nome_zona = zonas_usuario[i]
    

        var zona_atual = dados_juntos[nome_zona]
    zonas_dados.push({ nome_zona: zonas_usuario[i], dados: zona_atual })
        }

        dados_merge = {total_trafego: dados_juntos.TOTAL_JOGADORES_DATACENTER, zonas: zonas_dados}
        
        plotarDadosGKPis(dados_merge)
        dados_merge_json = dados_merge



        console.log("ESTOU INICIANDO A FILTRAGEM PARA SELEÇÂO DOS DADOS")
        

        zona_pegar_dados = ""
        for(i = 0; i < dados_merge_json.zonas.length; i++ ){
                zona_atual = dados_merge_json.zonas[i]

                

                if(zona_atual.nome_zona == zonai){
                    
                    zona_pegar_dados = zona_atual
                }

        }
        console.log("OLHA PASSEI PELO FOR E OS DADOS DA ZONA ENCONTRADA SÃO ESSES AQUI: ")
        console.log(zona_pegar_dados)

        // vamos pegar os dados agora
    zona_pegar_dados = zona_pegar_dados.dados

    var semana_anterior = zona_pegar_dados.JOGADORES_SEMANA_ANTERIOR
    var dia_atual = zona_pegar_dados.JOGADORES_ZONA
    console.log(typeof zona_pegar_dados["data-hora"])
    var hora_agora = new Date(zona_pegar_dados["data-hora"])
        hora_agora = hora_agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    console.log("OS DADOS ESTAO AQUI")
    console.log(dados)


    var p99 = zona_pegar_dados.P99_LATENCIA
    var disco = zona_pegar_dados.TOTAL_DISCO


    var qtd_sobrecarregados = zona_pegar_dados.QUANTIDADE_SOBRECAREGADOS
    var qtd_alta_latencia = zona_pegar_dados.QUANTIDADE_ALTA_LATENCIA
    


    if(tipo == "trafego"){


    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }

    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(semana_anterior)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(dia_atual)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "trafego"), 30000);   
    }

    if (tipo == "volume"){

    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }




    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(disco)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(p99)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "volume"), 30000);   

    }


        if (tipo == "correlacao"){

    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }




    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(qtd_sobrecarregados)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(qtd_alta_latencia)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "correlacao"), 30000);   

    }

    myChart.update();

    }
    }).catch(function(erro) {
        console.log("Existe algum erro na aplicação")
        console.log(erro)
    })






    // buscando os dados da empresa
         fetch("/bzonas/BuscarEmpresa", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
                idUsuario: sessionStorage.ID_USUARIO
            })

    }).then(function(resposta) {

        resposta_json = resposta.json()
        return resposta_json
       
        
    }).then(function(dados) {
        var dados_empresa = dados.resultadoenvio

        empresa_usuario = dados_empresa[0]
        empresa_usuario = empresa_usuario.razaoSocial

        nome_datacenter = dados_empresa[0].datacenter
        console.log("o nome do datacenter é ", nome_datacenter)


        for(i = 0; i < dados_empresa.length; i++){

            servidor = dados_empresa[i].nome
            servidores_usuario.push(servidor)
        }


  
       if(empresa_usuario != null && nome_datacenter != null && dados_do_s3 != null && zonas_usuario.length >=1){

        console.log("OS DADOS CHEGARAM")
        console.log(empresa_usuario)
        console.log(nome_datacenter)
        console.log(dados_do_s3)
        
        console.log(zonas_usuario)
        dados_juntos = dados_do_s3[empresa_usuario][nome_datacenter]
        
        zonas_dados = []
        for (i = 0; i < zonas_usuario.length; i++ ) {


        var nome_zona = zonas_usuario[i]
    

        var zona_atual = dados_juntos[nome_zona]
    zonas_dados.push({ nome_zona: zonas_usuario[i], dados: zona_atual })
        }

        dados_merge = {total_trafego: dados_juntos.TOTAL_JOGADORES_DATACENTER, zonas: zonas_dados}
        
        plotarDadosGKPis(dados_merge)
        dados_merge_json = dados_merge



        console.log("ESTOU INICIANDO A FILTRAGEM PARA SELEÇÂO DOS DADOS")
        

        zona_pegar_dados = ""
        for(i = 0; i < dados_merge_json.zonas.length; i++ ){
                zona_atual = dados_merge_json.zonas[i]

                

                if(zona_atual.nome_zona == zonai){
                    
                    zona_pegar_dados = zona_atual
                }

        }
        console.log("OLHA PASSEI PELO FOR E OS DADOS DA ZONA ENCONTRADA SÃO ESSES AQUI: ")
        console.log(zona_pegar_dados)

        // vamos pegar os dados agora
    zona_pegar_dados = zona_pegar_dados.dados

    var semana_anterior = zona_pegar_dados.JOGADORES_SEMANA_ANTERIOR
    var dia_atual = zona_pegar_dados.JOGADORES_ZONA
    console.log(typeof zona_pegar_dados["data-hora"])
    var hora_agora = new Date(zona_pegar_dados["data-hora"])
        hora_agora = hora_agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    console.log("OS DADOS ESTAO AQUI")
    console.log(dados)


    var p99 = zona_pegar_dados.P99_LATENCIA
    var disco = zona_pegar_dados.TOTAL_DISCO


    var qtd_sobrecarregados = zona_pegar_dados.QUANTIDADE_SOBRECAREGADOS
    var qtd_alta_latencia = zona_pegar_dados.QUANTIDADE_ALTA_LATENCIA
    


    if(tipo == "trafego"){


    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }

    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(semana_anterior)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(dia_atual)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "trafego"), 30000);   
    }

    if (tipo == "volume"){

    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }




    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(disco)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(p99)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "volume"), 30000);   

    }


        if (tipo == "correlacao"){

    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }




    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(qtd_sobrecarregados)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(qtd_alta_latencia)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "correlacao"), 30000);   

    }

    myChart.update();

    }




    
    }).catch(function(erro) {
        console.log("Existe algum erro na aplicação")
        console.log(erro)
    })




    // buscando os dados gerais do analista
            fetch("/banalista/buscarDadosAnalista_Gerais", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
        },


    }).then(function(resposta) {

        resposta_json = resposta.json()
        return resposta_json
       
        
    }).then(function(dados) {
        
        console.log(dados)


        var dados_gerais  = dados

        dados_do_s3 = dados_gerais["KPIS"]


       if(empresa_usuario != null && nome_datacenter != null && dados_do_s3 != null && zonas_usuario.length > 1){

        console.log("OS DADOS CHEGARAM")
        console.log(empresa_usuario)
        console.log(nome_datacenter)
        console.log(dados_do_s3)
        
        console.log(zonas_usuario)
        dados_juntos = dados_do_s3[empresa_usuario][nome_datacenter]
        
        zonas_dados = []
        for (i = 0; i < zonas_usuario.length; i++ ) {


        var nome_zona = zonas_usuario[i]
    

        var zona_atual = dados_juntos[nome_zona]
    zonas_dados.push({ nome_zona: zonas_usuario[i], dados: zona_atual })
        }

        dados_merge = {total_trafego: dados_juntos.TOTAL_JOGADORES_DATACENTER, zonas: zonas_dados}
        
        plotarDadosGKPis(dados_merge)
        dados_merge_json = dados_merge



        console.log("ESTOU INICIANDO A FILTRAGEM PARA SELEÇÂO DOS DADOS")
        

        zona_pegar_dados = ""
        for(i = 0; i < dados_merge_json.zonas.length; i++ ){
                zona_atual = dados_merge_json.zonas[i]

                

                if(zona_atual.nome_zona == zonai){
                    
                    zona_pegar_dados = zona_atual
                }

        }
        console.log("OLHA PASSEI PELO FOR E OS DADOS DA ZONA ENCONTRADA SÃO ESSES AQUI: ")
        console.log(zona_pegar_dados)

    zona_pegar_dados = zona_pegar_dados.dados

    var semana_anterior = zona_pegar_dados.JOGADORES_SEMANA_ANTERIOR
    var dia_atual = zona_pegar_dados.JOGADORES_ZONA
    console.log(typeof zona_pegar_dados["data-hora"])
    var hora_agora = new Date(zona_pegar_dados["data-hora"])
        hora_agora = hora_agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    console.log("OS DADOS ESTAO AQUI")
    console.log(dados)


    var p99 = zona_pegar_dados.P99_LATENCIA
    var disco = zona_pegar_dados.TOTAL_DISCO


    var qtd_sobrecarregados = zona_pegar_dados.QUANTIDADE_SOBRECAREGADOS
    var qtd_alta_latencia = zona_pegar_dados.QUANTIDADE_ALTA_LATENCIA
    


    if(tipo == "trafego"){


    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }

    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(semana_anterior)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(dia_atual)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "trafego"), 30000);   
    }

    if (tipo == "volume"){

    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }




    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(disco)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(p99)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "volume"), 30000);   

    }


        if (tipo == "correlacao"){

    if (dados_grafico.data.labels.length > 10){
        dados_grafico.data.labels.shift(); 
    }




    dados_grafico.data.labels.push(hora_agora)

    if( dados_grafico.data.datasets[0].data.length > 10){
            dados_grafico.data.datasets[0].data.shift();
    }

    dados_grafico.data.datasets[0].data.push(qtd_sobrecarregados)



    if( dados_grafico.data.datasets[1].data.length > 10){
            dados_grafico.data.datasets[1].data.shift();
    }
    dados_grafico.data.datasets[1].data.push(qtd_alta_latencia)
    setTimeout(() => atualizarGrafico(zonai, dados_grafico, myChart, "correlacao"), 30000);   

    }

    myChart.update();

    }


        
    }).catch(function(erro) {
        console.log("Existe algum erro na aplicação")
        console.log(erro)
    })





    }



            

                



function mudarTelaEspecifica(nomeServidor){
    sessionStorage.setItem("servidor", nomeServidor)
    window.location.href = "dashAnalistaEspecifica.html"
    
}






function abrirModal(titulo, texto) {
    modal_titulo.innerHTML = titulo
    modal_texto.innerHTML = texto
    modal.style.display = "flex"
}

function fecharModal() {
    modal.style.display = "none"
}

// fechar clicando fora
modal.addEventListener("click", function(e) {
    if (e.target == modal) fecharModal()
})





function limparSessao() {
    sessionStorage.clear();
}