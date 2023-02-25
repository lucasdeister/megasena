var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
const foraModal = document.getElementsByClassName('container_modal')[0];
const foraModal2 = document.getElementsByClassName('container_modal2')[0];
const foraModal3 = document.getElementsByClassName('container_modal3')[0];
let id = 1;
let item_editado = 0;
var objNumerosSorteados = [];


function exibirModalCriacao(){
    modal.style.display = "block";
    habilitarBotaoCopiar();
}

function exibirModalEdicao(){
  modal2.style.display = "block";
}

function exibirModalVerificacao(){
  modal3.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == foraModal) {
    fecharModalCriacao();
  }
  if(event.target == foraModal2){
    fecharModalEdicao();
  }
  if(event.target == foraModal3){
    fecharModalVerificacao();
  }
}

const inptDezenas = document.querySelector('#dezenas');
const inptQtdJogos = document.querySelector('#qtdJogos');
const dezenas_edicao = document.querySelector('#dezenas_edicao');
const jogo_edicao = document.querySelector('#jogo_edicao');
const btnGravar = document.querySelector('#btnGerar');
const btnSalvarEdicao = document.querySelector('#btnSalvar');
const tbody = document.querySelector('tbody');
let itens = 0;

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
   if(localStorage.dbfunc == '[]'){
      id = 1;
   }
}


const apagarGrid = () => {
  localStorage.clear();
  id = 1;
  loadItens(); 
}


function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = '';
  insertItem(itens);
}


function gerar(){

  let dezena = document.querySelector('#dezenas').value;
  let qtdJogos = document.querySelector('#qtdJogos').value;
  let jogos = gerarJogos(dezena, qtdJogos);

  for (const i in jogos) {
    jogos[i] = jogos[i].join('-');
    itens.push({'id': id, 'dezena': dezena, 'jogo': jogos[i]})
    id++;
  }

  setItensBD();
  loadItens();
  fecharModalCriacao();
}

  function insertItem(itens) {

    for (const i in itens) {
      let tr = document.createElement('tr');
      tr.innerHTML = `
      <td>${itens[i].id}</td>
      <td>${itens[i].dezena}</td>
      <td class="jogos_tabela">${itens[i].jogo}</td>
      <td class="acoes btnEditar" onclick="editItem(${i})">
        <a><i class='bx bx-edit'></i></a>
      </td>
      <td class="acoes btnExcluir" onclick="deleteItem(${i})">
        <a><i class='bx bx-trash'></i></a>
      </td>`;
      tbody.appendChild(tr);
    }
  }

const removerPossiveisJogosDuplicados = (array) => array.filter((t={}, a=> !(t[a]=a in t)));

function gerarJogos(dezenas, qtdJogos){

  let vetJogos = [];

  for (let i = 0; i < qtdJogos; i++) {
    vetJogos[i] = gerarJogoUnico(dezenas);
  } 

  vetJogos = removerPossiveisJogosDuplicados(vetJogos);

  return vetJogos;
}

function gerarJogoUnico(dezenas){

  const qtdNumerosPossiveis = 60;
  let vetNumeros = [];

    let numeroGerado = 0;
    
    for (let i = 0; i < dezenas; i++) {
      numeroGerado = Math.floor(Math.random() * qtdNumerosPossiveis) + 1;
      if(numeroGerado < 10){
        numeroGerado = "0" + numeroGerado;
      }
      while(vetNumeros.includes(numeroGerado)){
        numeroGerado = Math.floor(Math.random() * qtdNumerosPossiveis) + 1;
        if(numeroGerado < 10){
          numeroGerado = "0" + numeroGerado;
        }
        if(vetNumeros.includes(numeroGerado) == false){
          break;
        }
      }
        vetNumeros[i] = numeroGerado;
    }
    vetNumeros = vetNumeros.sort(function (a, b) {  return a - b;});

    return vetNumeros;
}

function editItem(index) {
  item_editado = index;
  exibirModalEdicao();
  preencherCamposEdicao(index);
}

function preencherCamposEdicao(index){
  dezenas_edicao.value = itens[index].dezena;
  jogo_edicao.value = itens[index].jogo.replaceAll(',', '-');
}

function editarJogo(index){

  let dezena_jogo_edicao = verificarDezenaJogo(jogo_edicao.value);

   itens[index].jogo = jogo_edicao.value;
   itens[index].dezena =  dezena_jogo_edicao;
   setItensBD();
   loadItens();
   fecharModalEdicao();
}

function preencherCampoDezenaEdicao(){
  let dezena_jogo_edicao = verificarDezenaJogo(jogo_edicao.value);
  dezenas_edicao.value = dezena_jogo_edicao;
}

function fecharModalCriacao(){
  modal.style.display = "none";
}

function fecharModalEdicao(){
  modal2.style.display = "none";
}

function fecharModalVerificacao(){
  limparParagrafos();
  esconderTituloApresentacao();
  modal3.style.display = "none";
}

function exibirOpcoesTipoAutomatico(){

  esconderOpcoesTipoManual();

  for(let i = 0; i < 5; i++){
    document.getElementsByClassName('tpAutomatico')[i].style.display = 'inline-block';
  }
}

function esconderOpcoesTipoAutomatico(){
  for(let i = 0; i < 5; i++){
    document.getElementsByClassName('tpAutomatico')[i].style.display = 'none';
  }
}

function exibirOpcoesTipoManual(){

  esconderOpcoesTipoAutomatico();

  for(let i = 0; i < 2; i++){
    document.getElementsByClassName('tpManual')[i].style.display = 'inline-block';
  }
}

function esconderOpcoesTipoManual(){
  for(let i = 0; i < 2; i++){
    document.getElementsByClassName('tpManual')[i].style.display = 'none';
  }
}


function verificarDezenaJogo(jogo_manual){

  let qtdDezenas = 1;

  for (let i = 0; i < jogo_manual.length; i++) {
    if(jogo_manual[i] == '-'){
      qtdDezenas++;
    }
  }
  return qtdDezenas;
}

document.getElementById('campo_jogo_manual').addEventListener("keypress", function(event){
  if (event.key === "Enter") {
    mask(document.getElementById('campo_jogo_manual').value);
    document.getElementById("btnGerarManual").click();
  }
})

function gerarManual(){

  document.getElementById('campo_jogo_manual').focus();

  let jogo_manual = document.querySelector('#campo_jogo_manual').value;

  const dezena_jogo = verificarDezenaJogo(jogo_manual);
  itens.push({'id': id, 'dezena': dezena_jogo, 'jogo': jogo_manual})
  id++;
  setItensBD();
  loadItens();
  document.querySelector('#campo_jogo_manual').value = '';
}

  const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
  const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));
  loadItens();

  function preencherObjJogosPremiadosNoArray(jogo_premiado, qtd_acertos){

      objNumerosSorteados.push({
            numero: jogo_premiado,
            acertos: qtd_acertos
        });
  }

  function verificarAcertos(){

    exibirTituloApresentacao();
    limparParagrafos();
    objNumerosSorteados = [];
    let jogo_sorteado = document.querySelector('#jogo_sorteado').value;
    jogo_sorteado = jogo_sorteado.replaceAll('-', ',');
    jogo_sorteado = jogo_sorteado.split(',').map(Number);
    let qtd_acertos = 0;
    let arrayJogos = [];

    for(let i in itens) {
      itens[i].jogo = itens[i].jogo.replaceAll('-', ',');
      arrayJogos.push((itens[i].jogo.split(',').map(Number)));
    }

    let arrayPrincipal = [...arrayJogos];
    let arrayAux = arrayPrincipal;

    let z = 0;

    for(let i = 0; i < arrayAux.length; i++){
      qtd_acertos = 0;
      z = 0;
      for (let j = 0; (j < arrayAux[i].length); j++) {
        if(qtd_acertos != 6){
          if(jogo_sorteado.includes(arrayAux[i][z])) {
            qtd_acertos++;
          }
          z++;
        }
        if(z == arrayAux[i].length && qtd_acertos > 3){
          preencherObjJogosPremiadosNoArray(arrayPrincipal[i], qtd_acertos);
          qtd_acertos = 0;
          z = 0;
          break;
        }
      }
    }

      let objEmArrayJogos = transformarArrayObjJogosSorteadosEmArray(objNumerosSorteados);
      let objEmArrayAcertos = transformarArrayObjJogosSorteadosEmArray(objNumerosSorteados);
  
      let arrayJogosParagrafo = obterArrayJogos(objEmArrayJogos);
      let arrayAcertosParagrafo = obterArrayAcertos(objEmArrayAcertos);

      criarParagrafosJogos(arrayJogosParagrafo, arrayAcertosParagrafo);
  
      for (const i in itens) {
        itens[i].jogo = itens[i].jogo.replaceAll(',', '-');
      }
    }

  function obterArrayJogos(arrayJogos){

    for (const i in arrayJogos) {
      arrayJogos[i] = arrayJogos[i].slice(arrayJogos[i].indexOf('Jogo'), arrayJogos[i].indexOf('-Acertos'));
    }

    return arrayJogos;
  }

  function obterArrayAcertos(arrayAcertos){

    for (const i in arrayAcertos) {
      arrayAcertos[i] = arrayAcertos[i].slice(arrayAcertos[i].indexOf('Acertos:'))
    }

    return arrayAcertos;
  }

  function criarParagrafosJogos(arrayJogos, arrayAcertos) {

    for (let i in arrayJogos) {
      let span = document.createElement('span');
      span.setAttribute("class", "paragrafos");
      span.innerHTML = `<p><span id="jogo">${arrayJogos[i]}</span><span id="acertos">${arrayAcertos[i]}</span></p>`;
      document.getElementById("jogos_acertados").appendChild(span);
    }
  }

  function limparParagrafos(){
    if (document.getElementById('jogo') != null){
      var element = document.getElementsByTagName("p"), index;
      for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
      }
    }
  }

function exibirTituloApresentacao(){
  document.getElementById('tituloApresentacao').style.display = 'block';
}

function esconderTituloApresentacao(){
  document.getElementById('tituloApresentacao').style.display = 'none';
}
  function transformarArrayObjJogosSorteadosEmArray(objNumerosSorteados){

    let arrayNumerosSorteados = [];

    for (let i in objNumerosSorteados) {
      arrayNumerosSorteados[i] = JSON.stringify(objNumerosSorteados[i]);
      arrayNumerosSorteados[i] = arrayNumerosSorteados[i].replaceAll(/["{}()[\]\\]/g, "");
      arrayNumerosSorteados[i] = arrayNumerosSorteados[i].replaceAll("numero", "Jogo");
      arrayNumerosSorteados[i] = arrayNumerosSorteados[i].replaceAll(",", "-");
      arrayNumerosSorteados[i] = arrayNumerosSorteados[i].replaceAll("a", "A");
    }

    return arrayNumerosSorteados;

  }

function habilitarBotaoCopiar(){
  document.getElementById('btnCopiar').style.opacity = '1';
  document.getElementById('btnCopiar').style.cursor = 'pointer';
}

function habilitarBotaoExportar(){
  document.getElementById('btnCopiar').style.opacity = '1';
  document.getElementById('btnCopiar').style.cursor = 'pointer';
}


 function copiarJogos(acao){

  let str = '';

  if(acao == 'copiar'){
    document.getElementById('btnCopiar').style.opacity = '0.5';
    document.getElementById('btnCopiar').style.cursor = 'initial';
  }

  for (let i = 0; i < itens.length; i++) {
    if(i == itens.length-1){
      str += document.getElementsByClassName('jogos_tabela')[i].innerHTML;
    }
    else{
      str += document.getElementsByClassName('jogos_tabela')[i].innerHTML + "\n";
    }
  }

  str = str.replaceAll("-", " ");

  if(acao == 'copiar'){
    navigator.clipboard.writeText(str);
  }

  return str;
}

  function mask(valor_campo) {

    if(document.getElementById('campo_jogo_manual').value.includes("-") == false){
      let output = '';
      for (let i = 0; i < valor_campo.length; i++) {
        if (i % 2 == 0 && i > 0) {
          output += '-';
        }
        output += valor_campo[i];
      }
      document.getElementById('campo_jogo_manual').value = output;
    }
  }



function exportarBase(){

  const content = copiarJogos();

  var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');

  const link = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = "jogos:" + utc + "_qtd_" + itens[itens.length-1].id + ".txt";
  link.click();
  URL.revokeObjectURL(link.href);

}


function abrirModalSelecaoArquivo(){
  input.type = 'file';
  input.click();
}

function formatarNumeros(arr) {
  return arr.map(function(item) {
    return item.split('-').map(function(number) {
      return number.toString().padStart(2, '0');
    }).join('-');
  });
}

function importarBase(conteudo_base){

  conteudo_base = conteudo_base.replaceAll(" ", ",");
  conteudo_base = conteudo_base.split('\n');
  let newArray = conteudo_base.map(function(str) {
    return str.split(",").map(Number);
  });

  apagarGrid();

  let arrayJogosImportacao = [];

  for (const i in newArray) {
    arrayJogosImportacao[i] = newArray[i].join('-');
  }
  
  arrayJogosImportacao = formatarNumeros(arrayJogosImportacao);

  for (const i in newArray) {
    itens.push({'id': id, 'dezena': newArray[i].length, 'jogo': arrayJogosImportacao[i]})
    id++;
  }
  setItensBD();
  loadItens();
}

let input = document.createElement('input');

input.onchange = e => { 
  let file = e.target.files[0]; 
  let reader = new FileReader();
  reader.readAsText(file,'UTF-8');
  reader.onload = readerEvent => {
    let conteudo_base = readerEvent.target.result;
    input.value = '';
    importarBase(conteudo_base);
    }
  }

function importar(){
  abrirModalSelecaoArquivo();
}





