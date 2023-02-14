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
    loadItens();
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

    let z = 0;

    for(let i = 0; i < arrayPrincipal.length; i++){
      qtd_acertos = 0;
      z = 0;
      for (let j = 0; (j < arrayPrincipal[i].length); j++) {
        if(qtd_acertos != 6){
          if(arrayPrincipal[i][z] == jogo_sorteado[j]){
            qtd_acertos++;
            z++;
          }
        }
        if(qtd_acertos == 6 || j == arrayPrincipal[i].length -1 && qtd_acertos >= 4){
          preencherObjJogosPremiadosNoArray(arrayPrincipal[i], qtd_acertos);
          qtd_acertos = 0;
          z = 0;
          break;
        }else{
          if(j == arrayPrincipal[i].length-1 && z < arrayPrincipal[i].length-1){
            z++;
            j = -1;
          }
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


 function copiarJogos(){

  let str = '';

  document.getElementById('btnCopiar').style.opacity = '0.5';
  document.getElementById('btnCopiar').style.cursor = 'initial';

  for (let i = 0; i < itens.length; i++) {
    if(i == itens.length-1){
      str += document.getElementsByClassName('jogos_tabela')[i].innerHTML;
    }
    else{
      str += document.getElementsByClassName('jogos_tabela')[i].innerHTML + "\n";
    }
  }

  str = str.replaceAll("-", " ");
  navigator.clipboard.writeText(str);
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





















// function leech(v){
//   v=v.replace(/o/gi,"0")
//   v=v.replace(/i/gi,"1")
//   v=v.replace(/z/gi,"2")
//   v=v.replace(/e/gi,"3")
//   v=v.replace(/a/gi,"4")
//   v=v.replace(/s/gi,"5")
//   v=v.replace(/t/gi,"7")
//   return v
// }
// function soNumeros(v){
//   return v.replace(/\D/g,"")
// }

// function telefone(v){
//   v=v.replace(/\D/g,"")                 //Remove tudo o que não é dígito
//   v=v.replace(/^(\d\d)(\d)/g,"($1) $2") //Coloca parênteses em volta dos dois primeiros dígitos
//   v=v.replace(/(\d{4})(\d)/,"$1-$2")    //Coloca hífen entre o quarto e o quinto dígitos
//   return v
// }
// function cpf(v){
//   v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
//   v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
//   v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
//                                            //de novo (para o segundo bloco de números)
//   v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
//   return v
// }
// function cep(v){
//   v=v.replace(/D/g,"")                //Remove tudo o que não é dígito
//   v=v.replace(/^(\d{5})(\d)/,"$1-$2") //Esse é tão fácil que não merece explicações
//   return v
// }function soNumeros(v){
//   return v.replace(/\D/g,"")
// }

// function cpf(v){
//   v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
//   v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
//   v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
//                                            //de novo (para o segundo bloco de números)
//   v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
//   return v
// }
// function mdata(v){
//   v=v.replace(/\D/g,"");
//   v=v.replace(/(\d{2})(\d)/,"$1/$2");
//   v=v.replace(/(\d{2})(\d)/,"$1/$2");

//   v=v.replace(/(\d{2})(\d{2})$/,"$1$2");
//   return v;
// }
// function mcc(v){
//   v=v.replace(/\D/g,"");
//   v=v.replace(/^(\d{4})(\d)/g,"$1 $2");
//   v=v.replace(/^(\d{4})\s(\d{4})(\d)/g,"$1 $2 $3");
//   v=v.replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g,"$1 $2 $3 $4");
//   return v;
// }

// document.getElementById('w3review').value = JSON.stringify(objNumerosSorteados);
//parametros para teste
//1-2-3-4-5-6-7-8
//1-2-3-40-50-60
//3-4-5-6-20-40
//10-20-30-40-50-60

// arrayJogosCadastrados = [8-21-23-37-52-57, 5-16-18-23-50-54] ==
//arrayJogosCadastrados = [[8,21,23,37,52,57], [5,16,18,23,50,54]]






