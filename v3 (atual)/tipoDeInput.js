function tipoDeInputASerCriado(nomeDaColuna) {
    if (nomeDaColuna.toLowerCase().includes("hora"))
      return 'time';
    else if (nomeDaColuna.toLowerCase().includes("data"))
      return 'date';
    else
      return 'text';


  }

  module.exports = {tipoDeInputASerCriado}