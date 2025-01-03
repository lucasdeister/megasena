var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
const foraModalCriacao1 = document.getElementsByClassName('modal')[0];
const foraModalCriacao2 = document.getElementsByClassName('container')[0];
const foraModalEdicao1 = document.getElementsByClassName('modal')[1];
const foraModalEdicao2 = document.getElementsByClassName('container')[1];
const foraModalVerificacao1 = document.getElementsByClassName('modal')[2];
const foraModalVerificacao2 = document.getElementsByClassName('container')[2];

let item_editado = 0;
var objNumerosSorteados = [];

function exibirModalCriacao() {
  modal.style.display = "block";
}

function exibirModalEdicao() {
  modal2.style.display = "block";
}

function exibirModalVerificacao() {
  modal3.style.display = "block";
}

window.onclick = function (event) {
  if (event.target == foraModalCriacao1 || event.target == foraModalCriacao2) {
    fecharModalCriacao();
  }
  if (event.target == foraModalEdicao1 || event.target == foraModalEdicao2) {
    fecharModalEdicao();
  }
  if (event.target == foraModalVerificacao1 || event.target == foraModalVerificacao2) {
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

  let objetoParaExcluir = '';

  for (const i in itens) {
    if (index == itens[i].id) {
      objetoParaExcluir = itens[i];
      break;
    }
  }

  const tabela = document.getElementsByTagName("table")[0];
  const indiceParaExcluir = itens.indexOf(objetoParaExcluir);

  itens.splice(indiceParaExcluir, 1);
  tabela.deleteRow(indiceParaExcluir + 1);

  setItensBD();
}

const apagarGrid = () => {
  localStorage.clear();
  tbody.innerHTML = '';
  itens = [];
}

function loadItens() {
  itens = getItensBD();
  insertItem(itens);
}

function gerar() {
  let dezena = document.querySelector('#dezenas').value;
  let qtdJogos = document.querySelector('#qtdJogos').value;
  let jogos = gerarJogos(dezena, qtdJogos);

  for (const i in jogos) {
    jogos[i] = jogos[i].join('-');
    itens.push({ 'id': getProxIDJogos(), 'dezena': dezena, 'jogo': jogos[i] })
    insertItemUnico(itens[itens.length - 1]);
  }

  setItensBD();
  fecharModalCriacao();
}

function insertItemUnico(item) {

  let tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${item.id}</td>
    <td class="dezenas_tabela">${item.dezena}</td>
    <td class="jogos_tabela">${item.jogo}</td>
    <td>
      <a onclick="editItem(${item.id})" class="btn btn-outline-primary btn-lg text-dark"><i class='bx bx-edit'></i></a>
      <a onclick="deleteItem(${item.id})" class="btn btn-outline-danger btn-lg text-dark"><i class='bx bx-trash'></i></a>
    </td>`;
  tbody.appendChild(tr);
}

function insertItem(itens) {

  for (const i in itens) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${itens[i].id}</td>
      <td class="dezenas_tabela">${itens[i].dezena}</td>
      <td class="jogos_tabela">${itens[i].jogo}</td>
      <td>
        <a onclick="editItem(${itens[i].id})" class="btn btn-outline-primary btn-lg text-dark"><i class='bx bx-edit'></i></a>
        <a onclick="deleteItem(${itens[i].id})" class="btn btn-outline-danger btn-lg text-dark"><i class='bx bx-trash'></i></a>
      </td>`;
    tbody.appendChild(tr);
  }
}

const removerPossiveisJogosDuplicados = (array) => array.filter((t = {}, a => !(t[a] = a in t)));

function gerarJogos(dezenas, qtdJogos) {

  let vetJogos = [];

  for (let i = 0; i < qtdJogos; i++) {
    vetJogos[i] = gerarJogoUnico(dezenas);
  }

  vetJogos = removerPossiveisJogosDuplicados(vetJogos);

  return vetJogos;
}


function gerarJogoUnico(dezenas){

    const qtdNumerosPossiveis = 60;
    const numeros = new Set();
  
    while (numeros.size < dezenas) {
      const numeroGerado = (Math.floor(Math.random() * qtdNumerosPossiveis) + 1).toString().padStart(2, '0');
      numeros.add(numeroGerado);
    }
  
    return Array.from(numeros).sort(function (a, b) { return a - b; });
  }

function editItem(index) {
  exibirModalEdicao();
  preencherCamposEdicao(index);
}

function preencherCamposEdicao(index) {

  let objetoParaEditar = '';

  for (let i = 0; i < itens.length; i++) {
    if (index === itens[i].id) {
      objetoParaEditar = itens[i];
      break;
    }
  }

  const indiceParaEditar = itens.indexOf(objetoParaEditar);
  dezenas_edicao.value = itens[indiceParaEditar].dezena;
  jogo_edicao.value = itens[indiceParaEditar].jogo.replaceAll(',', '-');
  item_editado = indiceParaEditar;
}

function editarJogoTabela(novoObj) {
  document.getElementsByClassName('dezenas_tabela')[novoObj.id].innerText = novoObj.dezena;
  document.getElementsByClassName('jogos_tabela')[novoObj.id].innerText = novoObj.jogo;
}

function editarJogo(index) {

  let dezena_jogo_edicao = verificarDezenaJogo(jogo_edicao.value);

  itens[index].jogo = jogo_edicao.value;
  itens[index].dezena = dezena_jogo_edicao;

  let novoObj = { 'id': index, 'dezena': dezena_jogo_edicao, 'jogo': jogo_edicao.value };

  setItensBD();
  editarJogoTabela(novoObj);
  fecharModalEdicao();
}

function preencherCampoDezenaEdicao() {
  let dezena_jogo_edicao = verificarDezenaJogo(jogo_edicao.value);
  dezenas_edicao.value = dezena_jogo_edicao;
}

function fecharModalCriacao() {
  modal.style.display = "none";
}

function fecharModalEdicao() {
  modal2.style.display = "none";
}

function fecharModalVerificacao() {
  limparResultado();
  modal3.style.display = "none";
}

function exibirOpcoesTipoAutomatico() {
  esconderOpcoesTipoManual();
  document.querySelectorAll("input[tipo='automatico']")[0].style.display = 'block';
  document.querySelectorAll("input[tipo='automatico']")[1].style.display = 'block';
  document.querySelector("a[tipo='automatico']").style.display = 'inline-block';
}

function esconderOpcoesTipoAutomatico() {
  document.querySelectorAll("input[tipo='automatico']")[0].style.display = 'none';
  document.querySelectorAll("input[tipo='automatico']")[1].style.display = 'none';
  document.querySelector("a[tipo='automatico']").style.display = 'none';
}

function exibirOpcoesTipoManual() {
  esconderOpcoesTipoAutomatico();
  document.querySelector("input[tipo='manual']").style.display = 'block';
  document.querySelector("a[tipo='manual']").style.display = 'inline-block';
}

function esconderOpcoesTipoManual() {
  document.querySelector("input[tipo='manual']").style.display = 'none';
  document.querySelector("a[tipo='manual']").style.display = 'none';
}

function verificarDezenaJogo(jogo_manual) {

  let qtdDezenas = 1;

  for (let i = 0; i < jogo_manual.length; i++) {
    if (jogo_manual[i] == '-') {
      qtdDezenas++;
    }
  }
  return qtdDezenas;
}

document.getElementById('campo_jogo_manual').addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    mask(document.getElementById('campo_jogo_manual').value);
    document.getElementById("btnGerarManual").click();
  }
})

function gerarManual() {

  document.getElementById('campo_jogo_manual').focus();
  let jogo_manual = document.querySelector('#campo_jogo_manual').value;
  const dezena_jogo = verificarDezenaJogo(jogo_manual);
  itens.push({ 'id': getProxIDJogos(), 'dezena': dezena_jogo, 'jogo': jogo_manual });
  setItensBD();
  let ultimoObjeto = itens[itens.length - 1];
  insertItemUnico(ultimoObjeto);
  document.querySelector('#campo_jogo_manual').value = '';
}

function preencherObjJogosPremiadosNoArray(jogo_premiado, qtd_acertos) {

  objNumerosSorteados.push({
    numero: jogo_premiado,
    acertos: qtd_acertos
  });
}

function verificarAcertos() {

  limparResultado();
  objNumerosSorteados = [];
  let jogo_sorteado = document.querySelector('#jogo_sorteado').value;
  jogo_sorteado = jogo_sorteado.replaceAll('-', ',');
  jogo_sorteado = jogo_sorteado.split(',').map(Number);
  let qtd_acertos = 0;
  let arrayJogos = [];

  for (let i in itens) {
    itens[i].jogo = itens[i].jogo.replaceAll('-', ',');
    arrayJogos.push((itens[i].jogo.split(',').map(Number)));
  }

  let arrayPrincipal = [...arrayJogos];
  let arrayAux = arrayPrincipal;

  let z = 0;

  for (let i = 0; i < arrayAux.length; i++) {
    qtd_acertos = 0;
    z = 0;
    for (let j = 0; (j < arrayAux[i].length); j++) {
      if (qtd_acertos != 6) {
        if (jogo_sorteado.includes(arrayAux[i][z])) {
          qtd_acertos++;
        }
        z++;
      }
      if (qtd_acertos == 6 || z == arrayAux[i].length && qtd_acertos > 3) {
        preencherObjJogosPremiadosNoArray(arrayPrincipal[i], qtd_acertos);
        qtd_acertos = 0;
        z = 0;
        break;
      }
    }
  }

  if (objNumerosSorteados.length != 0) {
    let objEmArrayJogos = transformarArrayObjJogosSorteadosEmArray(objNumerosSorteados);
    let objEmArrayAcertos = transformarArrayObjJogosSorteadosEmArray(objNumerosSorteados);

    let arrayJogosResultado = obterArrayJogos(objEmArrayJogos);
    let arrayAcertosResultado = obterArrayAcertos(objEmArrayAcertos);

    preencherResultado(arrayJogosResultado, arrayAcertosResultado);

    for (const i in itens) {
      itens[i].jogo = itens[i].jogo.replaceAll(',', '-');
    }
  }
  else {
    document.querySelector('#campo_resultado').value = 'Nenhum jogo acertado';
  }
}

function obterArrayJogos(arrayJogos) {

  for (const i in arrayJogos) {
    arrayJogos[i] = arrayJogos[i].slice(arrayJogos[i].indexOf('Jogo'), arrayJogos[i].indexOf('-Acertos'));
  }

  return arrayJogos;
}

function obterArrayAcertos(arrayAcertos) {

  for (const i in arrayAcertos) {
    arrayAcertos[i] = arrayAcertos[i].slice(arrayAcertos[i].indexOf('Acertos:'))
  }

  return arrayAcertos;
}

function preencherResultado(arrayJogos, arrayAcertos) {

  let campo_resultado = document.querySelector('#campo_resultado');

  for (let i in arrayJogos) {
    campo_resultado.value = campo_resultado.value + arrayJogos[i] + " " + arrayAcertos[i] + "\n\n";
  }
}

function limparResultado() {

  let campo_resultado = document.querySelector('#campo_resultado');

  campo_resultado.value = '';
}

function transformarArrayObjJogosSorteadosEmArray(objNumerosSorteados) {

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

function copiarJogos(acao) {

  let str = '';

  for (let i = 0; i < itens.length; i++) {
    if (i == itens.length - 1) {
      str += document.getElementsByClassName('jogos_tabela')[i].innerHTML;
    }
    else {
      str += document.getElementsByClassName('jogos_tabela')[i].innerHTML + "\n";
    }
  }

  str = str.replaceAll("-", " ");

  if (acao == 'copiar') {
    navigator.clipboard.writeText(str);
  }

  return str;
}

function mask(valor_campo) {

  if (document.getElementById('campo_jogo_manual').value.includes("-") == false) {
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

function exportarBase() {

  const content = copiarJogos();

  var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

  const link = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = "jogos:" + utc + "_qtd_" + itens[itens.length - 1].id + ".txt";
  link.click();
  URL.revokeObjectURL(link.href);

}

function abrirModalSelecaoArquivo() {
  input.type = 'file';
  input.click();
}

function formatarNumeros(arr) {
  return arr.map(function (item) {
    return item.split('-').map(function (number) {
      return number.toString().padStart(2, '0');
    }).join('-');
  });
}

function importarBase(conteudo_base) {

  conteudo_base = conteudo_base.replaceAll(" ", ",");
  conteudo_base = conteudo_base.split('\n');
  let newArray = conteudo_base.map(function (str) {
    return str.split(",").map(Number);
  });

  apagarGrid();

  let arrayJogosImportacao = [];

  for (const i in newArray) {
    arrayJogosImportacao[i] = newArray[i].join('-');
  }

  arrayJogosImportacao = formatarNumeros(arrayJogosImportacao);

  for (const i in newArray) {
    itens.push({ 'id': getProxIDJogos(), 'dezena': newArray[i].length, 'jogo': arrayJogosImportacao[i] })
  }
  setItensBD();
  insertItem(itens);
}

let input = document.createElement('input');
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));
loadItens();

input.onchange = e => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = readerEvent => {
    let conteudo_base = readerEvent.target.result;
    input.value = '';
    importarBase(conteudo_base);
  }
}

function importar() {
  abrirModalSelecaoArquivo();
}

function getProxIDJogos() {

  let proximoID = 0;

  if (itens.length == 0) {
    proximoID = 1;
  }
  else {
    proximoID = itens[itens.length - 1].id + 1;
  }

  return proximoID;
}