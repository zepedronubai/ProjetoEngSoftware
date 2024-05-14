function handleFicheiroSalas(event) {
    console.log("aqui")
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log("ois")
    //leitor do ficheiro
    reader.onload = function () {
      const content = reader.result;
      fileContent = content;
      filtrarFileCaracterizacaoSalas(content);
    };

    reader.onerror = function () {
      console.error('Error reading the file');
    };

    reader.readAsText(file, 'utf-8')
  };

module.exports = {handleFicheiroSalas}