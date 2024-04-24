/**
 * Atributos:
 */
var fileContent;
var titulos = [];
var linhas = [];
var csvData;
var table;
var table2;
var csvLinesCaracterizacaoSalas;
var columnsCaracterizacaoSalas;
var csvLines;
var columns;
var firstTimeOpeningCaracterizaocaoSalas = true
var form
var botao = document.getElementById("botaoDarkTheme")
var count = 0;

botao.addEventListener("click",darkTheme,false);

/**
 * Função para corrigir bug onde quando se clicava, ele assumia que era clicado 2 vezes então não fazia nada.
 */
function darkTheme(){
    count++;
    if (count % 2 == 0){
      let htmlBody = document.body;
      htmlBody.classList.toggle("dark-mode");      
    }
     
}

/**
 * Lógica para lidar com os butões (escolha do ficheiro e download do ficheiro csv). 
 */
document.getElementById("download-csv").addEventListener("click", function(){
  table.download("csv", "data.csv");
});

document.getElementById("ficheiro").addEventListener("change", (event)=>{
  const file = event.target.files[0];
  const reader = new FileReader();
  console.log("ois")
  //leitor do ficheiro
  reader.onload = function () {
    const content = reader.result;
    fileContent = content;
    filtrarFile(content);
  };

  reader.onerror = function () {
    console.error('Error reading the file');
  };

  reader.readAsText(file,'utf-8')
});


/**
 * Função que dá Split ao texto com ";" e organiza as linhas num vetor
 * @param {string} content - o conteúdo do ficheiro csv inserido após clicar no botão "Escolher Ficheiro"
 */
function filtrarFile(content){

  // Separa os dados do ficheiro CSV em linhas
  csvLines = content.split('\n');

  // Separa o primeiro vetor por ";" onde vão ficar os títulos de cada coluna (column headers)
  columns = csvLines[0].split(';');

  // Remove a primeira linha (column headers) de csvLines
  csvLines.shift();

  console.log(columns)
  createTable();
}

/**
 * Editor das datas.
 * @param {*} cell - A célula editável
 * @param {*} onRendered - Função que é chamada quando o editor é renderizado
 * @param {*} success - Função chamada para passar com sucesso o valor atualizado ao Tabulator
 * @param {*} cancel - Função chamada para abortar a edição e retorna para a célula normal 
 */
var dateEditor = function(cell, onRendered, success, cancel){

  //Lógica para criar e dar "style" ao input.

  var cellValue = luxon.DateTime.fromFormat(cell.getValue(), "dd/MM/yyyy").toFormat("yyyy-MM-dd"),
  input = document.createElement("input");

  input.setAttribute("type", "date");

  input.style.padding = "4px";
  input.style.width = "100%";
  input.style.boxSizing = "border-box";

  input.value = cellValue;

  /**
   * Função chamada no dateEditor para reformatar o input
   */
  onRendered(function(){
      input.focus();
      input.style.height = "100%";
  });

  /**
   * Função de auxílio à edição das datas.
   */
  function onChange(){
      if(input.value != cellValue){
          success(luxon.DateTime.fromFormat(input.value, "yyyy-MM-dd").toFormat("dd/MM/yyyy"));
      }else{
          cancel();
      }
  }
  //Lógica de style para edição das datas.

  input.addEventListener("blur", onChange);
  
  // Quando em edição da data , ENTER para mudar com sucesso e ESC para cancelar a edição.

  input.addEventListener("keydown", function(e){
      if(e.keyCode == 13){
          onChange();
      }

      if(e.keyCode == 27){
          cancel();
      }
  });
  return input;
};

/**
 * Editor dos horários (parecido ao das datas)
 * @param {*} cell - A célula editável
 * @param {*} onRendered - Função que é chamada quando o editor é renderizado
 * @param {*} success - Função chamada para passar com sucesso o valor atualizado ao Tabulator
 * @param {*} cancel - Função chamada para abortar a edição e retorna para a célula normal 
 */
var timeEditor = function(cell, onRendered, success, cancel){
  
  //Lógica para criar e dar "style" ao input.

  var cellValue = luxon.DateTime.fromFormat(cell.getValue(), "HH:mm:ss").toFormat("HH:mm:ss"),
  input = document.createElement("input");

  input.setAttribute("type", "time");

  input.style.padding = "4px";
  input.style.width = "100%";
  input.style.boxSizing = "border-box";

  // Definir o dia e hora atual
  var today = luxon.DateTime.local().toISODate();
  input.value = today + 'T' + cellValue;

  /**
   * Função chamada no timeEditor para reformatar o input
   */
  onRendered(function(){
      input.focus();
      input.style.height = "100%";
  });

  /**
   * Função de auxílio à edição dos horários (horas).
   */
  function onChange(){

      // Constrói a string datetime completa utilizando a data de hoje e a hora selecionada
      var selectedTime = input.value;
      var fullDatetime = today + 'T' + selectedTime;

      // Analisa a string de caracteres datetime completa para garantir que é válida
      var parsedDatetime = luxon.DateTime.fromISO(fullDatetime);

      if(parsedDatetime.isValid){
          success(parsedDatetime.toFormat("HH:mm:ss"));
      }else{
          cancel();
      }
  }
  //Lógica de style para edição das datas.
  input.addEventListener("blur", onChange);

  //// Quando em edição da data , ENTER para mudar com sucesso e ESC para cancelar a edição.
  input.addEventListener("keydown", function(e){
      if(e.keyCode == 13){
          onChange();
      }

      if(e.keyCode == 27){
          cancel();
      }
  });
  return input;
};

/**
 * Função que cria a tabela usando o Tabulator
 */
function createTable(){

  // Cria instância do Tabulator
  table = new Tabulator("#table", {
    maxWidth:"80%",
    data: csvLines.map(line => {
      var values = line.split(';');
      var rowData = {};
      columns.forEach((column, index) => {
        rowData[column] = values[index];
      });
      return rowData;
    }),
    columns: columns.map(column => ({ title: column, field: column, editor: hasData(column) ? dateEditor : hasHour(column) ? timeEditor : 'input',headerMenu:headerMenu })),
    layout: "fitDataStretch",
    resizableColumns:false,
    pagination: "local",
    paginationSizeSelector:[20, 50, 100],
    paginationSize: 20
     
  });
  //Depois de criar a tabela, cria um form para filtrá-la
  createFilterHorarioForm()
}

//Lógica para handle da tabela caracterização sala

document.getElementById("fileCaracterizacaoSalas").addEventListener("change", (event)=>{
  const file = event.target.files[0];
  const reader = new FileReader();
  //Leitor do ficheiro
  reader.onload = function () {
      const content = reader.result;
      fileContent = content;
      filtrarFileCaracterizacaoSalas(content);
  };

  reader.onerror = function () {
      console.error('Error reading the file');
  };

  reader.readAsText(file,'utf-8')
});

/**
 * Função que filtra o ficheiro de caracterização das salas
 * @param {string} content - o conteúdo do ficheiro CaracterizacaoSalas.csv inserido após clicar no botão "Escolher Ficheiro"
 */
function filtrarFileCaracterizacaoSalas(content){
  
  // Dividir dados CSV por linhas
  csvLinesCaracterizacaoSalas = content.split('\n');

  // Analisa a primeira linha para obter os cabeçalhos das colunas
  columnsCaracterizacaoSalas = csvLinesCaracterizacaoSalas[0].split(';');

  // Remover a primeira linha (cabeçalhos de coluna) de csvLines
  csvLinesCaracterizacaoSalas.shift();

  console.log(csvLinesCaracterizacaoSalas[0])
  console.log(columnsCaracterizacaoSalas)
  createSecondTable();
}

/**
 * Depois de criar a tabela é chamado para criar o form de filtro para o horario
 */
function createFilterHorarioForm(){
    // Cria um elemento de formulário
    form = document.createElement('form');

    // Definir atributos do formulário (opcional)
    form.setAttribute('id', 'myForm');
    form.setAttribute('action', 'submit.php');
    form.setAttribute('method', 'post');

    for(let i=0;i!=columns.length;i++){

      //Label para cada input
      var label = document.createElement('label');
      label.textContent = columns[i]; 
      //Para cada elemento do titulo, cria um input para ser filtrado
      console.log(columns[i])
      var input1 = document.createElement('input');
      var tipoDeInput = tipoDeInputASerCriado(columns[i])
      input1.setAttribute('type', tipoDeInput);
      input1.setAttribute('name', columns[i]);
      input1.setAttribute('placeholder', columns[i]);
      input1.setAttribute('id', columns[i]);
      label.setAttribute('for', columns[i]);
      form.appendChild(label)
      form.appendChild(input1);
    }

    //Lógica do botão de submit
    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);

    //Lógica do botão de reset
    var resetBtn = document.createElement('button');
    resetBtn.setAttribute('id', 'resetBtn');
    resetBtn.setAttribute('type', 'button');
    resetBtn.textContent = 'Reset Filters';
    resetBtn.addEventListener('click', resetTextFilter);
    form.appendChild(resetBtn);

    var section = document.getElementById('fitlerHorarioSection');
    section.appendChild(form);


    form.addEventListener('submit', function(event) {
      
      //Impedir a submissão de formulários ao servidor
      event.preventDefault();

      //Percorrer as entradas do formulário e registar os seus valores
      var inputs = form.querySelectorAll('input');
      inputs.forEach(function(input) {
        if(input.value!="" && input.name!=""){
          console.log("Filtering by:", input.name, "with value:", input.value);
          setTextFilter(input)
        }
      });
    });

}

/**
 * Dá handle do input (de um dos campos de filtragem) para filtrar de acordo com a keyword introduzida no input
 * @param {string} input - keyword introduzida
 */
function setTextFilter(input){
    console.log(input.name + ': ' + input.value)
    inputValues = input.value.split(";")
    keywordsToFilter = ""
    if(!input.name.toLowerCase().includes("data"))
      for(var i=0;i!=inputValues.length;i++){
        if(i==0)
          keywordsToFilter = inputValues[i]
        else
        keywordsToFilter = keywordsToFilter + ";" + inputValues[i]
        console.log("keywords to filter: " + keywordsToFilter)
      }
    else{
      var components = input.value.split("-");
      console.log("data splitada: " + components[0])

      // Reorganiza as componentes de acordo com o formato pretendido
      var formattedDate = components[2] + '/' + components[1] + '/' + components[0];
      keywordsToFilter = formattedDate
      console.log("keywords to filter: " + keywordsToFilter)
    }

    table.addFilter(input.name, "keywords", keywordsToFilter, {separator :";"});
}

/**
 * Dá clear no filter, limpando todos os campos
 */
function resetTextFilter(){
  table.clearFilter();
  var inputs = form.querySelectorAll('input');
  inputs.forEach(function(input) {
    if(input.type!="submit")
      input.value = '';
});
}

/**
 * Retorna o tipo de input (hora/data/texto(salas,etc...)) de acordo com o nomeDaColuna
 * @param {string} nomeDaColuna 
 * @returns tipo de input (hora/data/texto(salas,etc...))
 */
function tipoDeInputASerCriado(nomeDaColuna){
  if(nomeDaColuna.toLowerCase().includes("hora"))
    return 'time';
  else if(nomeDaColuna.toLowerCase().includes("data"))
    return 'date';
  else
    return 'text';

  
}

/**
 * Função que criar a tabela da caracterização de salas (em baixo da tabela de horário)
 */
function createSecondTable(){
    console.log("Dentro da criar second table")
    table2 = new Tabulator("#table2", {
      data: csvLinesCaracterizacaoSalas.map(line => {
        var values = line.split(';');
        var rowData = {};
        columnsCaracterizacaoSalas.forEach((column, index) => {
          rowData[column] = values[index];
        });
        return rowData;
      }),
      columns: columnsCaracterizacaoSalas.map(column => ({ title: column, field: column})),
      layout: "fitDataTable",
      pagination: "local",
      paginationSizeSelector:[20, 50, 100],
      paginationSize: 20
    });
    createFilterCaracterizacaoForm()
}


/**
 * Função booleana que verifica se o parâmetro column é igual à string "data"
 * @param {string} column 
 * @returns boolean (data or not data)
 */
function hasData(column){
  columnLower = column.toLowerCase()
  data = "data"
  if(columnLower.includes(data)){
    console.log(columnLower)
    return true
  }else
    return false
}

/**
 * Função booleana que verifica se o parâmetro column é igual à string "hora"
 * @param {string} column 
 * @returns boolean (hora or not hora)
 */
function hasHour(column){
  columnLower = column.toLowerCase()
  data = "hora"
  if(columnLower.includes(data)){
    console.log(columnLower)
    return true
  }else
    return false
}

  //Lógica para esconder colunas
  var headerMenu = function(){
  var menu = [];
  var columns = this.getColumns();

  for(let column of columns){

      //Cria elemento de caixa de verificação utilizando ícones
      let icon = document.createElement("i");
      icon.classList.add("fas");
      icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

      //Constrói a label
      let label = document.createElement("span");
      let title = document.createElement("span");

      title.textContent = " " + column.getDefinition().title;

      label.appendChild(icon);
      label.appendChild(title);

      //Cria o menu
      menu.push({
          label:label,
          action:function(e){

              //Previne fecho do menu
              e.stopPropagation();

              //Alterna a visibilidade da coluna atual
              column.toggle();

              //Altera o ícone do item do menu
              if(column.isVisible()){
                  icon.classList.remove("fa-square");
                  icon.classList.add("fa-check-square");
              }else{
                  icon.classList.remove("fa-check-square");
                  icon.classList.add("fa-square");
              }
          }
      });
  }

 return menu;
};

/**
 * Filtra colunas pelo nome
 * @param {*} headerValue - o valor do elemento de filtro do cabeçalho
 * @param {*} rowValue - o valor da coluna nesta linha
 * @param {*} rowData - os dados da linha que está a ser filtrada
 * @param {*} filterParams - objeto params passado para a propriedade headerFilterFuncParams
 * @returns boolean (verdadeiro se passar no filtro)
 */
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){

      if(rowValue){
          if(headerValue.start != ""){
              if(headerValue.end != ""){
                  return rowValue >= headerValue.start && rowValue <= headerValue.end;
              }else{
                  return rowValue >= headerValue.start;
              }
          }else{
              if(headerValue.end != ""){
                  return rowValue <= headerValue.end;
              }
          }
      }

  return true; //Devolve um booleano, verdadeiro se passar no filtro
}

/**
 * Função de criação dos filtros do ficheiro CaracterizacaoSalas.csv
 */
function createFilterCaracterizacaoForm(){
  //Cria um elemento de formulário
    form = document.createElement('form');

    //Define atributos do formulário (opcional)
    form.setAttribute('id', 'CaracterizacaoForm');
    form.setAttribute('action', 'submit.php');
    form.setAttribute('method', 'post');
     console.log("criou")
    for(let i=0;i!=columnsCaracterizacaoSalas.length;i++){

      //Label para cada input
      var label = document.createElement('label');
      label.textContent = columnsCaracterizacaoSalas[i];
      //Para cada elemento do titulo, cria um input para ser filtrado
      console.log(columnsCaracterizacaoSalas[i])
      var input1 = document.createElement('input');
      var tipoDeInput = tipoDeInputASerCriado(columnsCaracterizacaoSalas[i])
      input1.setAttribute('type', tipoDeInput);
      input1.setAttribute('name', columnsCaracterizacaoSalas[i]);
      input1.setAttribute('placeholder', columnsCaracterizacaoSalas[i]);
      input1.setAttribute('id', columnsCaracterizacaoSalas[i]);
      label.setAttribute('for', columnsCaracterizacaoSalas[i]);
      form.appendChild(label)
      form.appendChild(input1);
    }

    //Lógica de botão de submit
    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);

    //Lógica de botão de reset filter
    var resetBtn = document.createElement('button');
    resetBtn.setAttribute('id', 'resetBtn2');
    resetBtn.setAttribute('type', 'button');
    resetBtn.textContent = 'Reset Filters';
    resetBtn.addEventListener('click', resetTextFilter2);
    form.appendChild(resetBtn);

    var section = document.getElementById('fitlercaracterizacaoSection');
    section.appendChild(form);


    form.addEventListener('submit', function(event) {
      //Impede a submissão de formulários ao servidor
      event.preventDefault();

      //Percorre as entradas do formulário e registar os seus valores
      var inputs = form.querySelectorAll('input');
      inputs.forEach(function(input) {
        if(input.value!="" && input.name!=""){
          console.log("Filtering by:", input.name, "with value:", input.value);
          setTextFilter2(input)
        }
      });
    });

}

/**
 * 2ª Função de reset filter
 */
function resetTextFilter2(){
  table2.clearFilter();
  var inputs = form.querySelectorAll('input');
  inputs.forEach(function(input) {
    if(input.type!="submit")
      input.value = '';
});
}

/**
 * Dá handle do input (de um dos campos de filtragem) para filtrar de acordo com a keyword introduzida no input
 * @param {string} input - keyword introduzida
 */
function setTextFilter2(input){
  console.log(input.name + ': ' + input.value)
  inputValues = input.value.split(";")
  keywordsToFilter = ""
  if(!input.name.toLowerCase().includes("data"))
    for(var i=0;i!=inputValues.length;i++){
      if(i==0)
        keywordsToFilter = inputValues[i]
      else
      keywordsToFilter = keywordsToFilter + ";" + inputValues[i]
      console.log("keywords to filter: " + keywordsToFilter)
    }
  else{
    var components = input.value.split("-");
    console.log("data splitada: " + components[0])
    //Reorganiza os componentes de acordo com o formato pretendido
    var formattedDate = components[2] + '/' + components[1] + '/' + components[0];
    keywordsToFilter = formattedDate
    console.log("keywords to filter: " + keywordsToFilter)
  }

  table2.addFilter(input.name, "keywords", keywordsToFilter, {separator :";"});
}