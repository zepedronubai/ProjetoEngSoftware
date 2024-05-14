function filtrarFileCaracterizacaoSalas(content) {

    // Dividir dados CSV por linhas
    csvLinesCaracterizacaoSalas = content.split('\n');

    // Analisa a primeira linha para obter os cabeçalhos das colunas
    columnsCaracterizacaoSalas = csvLinesCaracterizacaoSalas[0].split(';');

    // Remover a primeira linha (cabeçalhos de coluna) de csvLines
    csvLinesCaracterizacaoSalas.shift();

    console.log(csvLinesCaracterizacaoSalas[0])
    console.log(columnsCaracterizacaoSalas)
  }

  module.exports = filtrarFileCaracterizacaoSalas;