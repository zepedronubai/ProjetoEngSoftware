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

//filterHorarioForm
var form

var botao = document.getElementById("botaoDarkTheme")
var count = 0;
botao.addEventListener("click",darkTheme,false);
function darkTheme(){
    count++;
    if (count % 2 == 0){
      let htmlBody = document.body;
      htmlBody.classList.toggle("dark-mode");      
    }
     
}

document.getElementById("download-csv").addEventListener("click", function(){
  table.download("csv", "data.csv");
});

let oi=0
document.getElementById("botaoteste").addEventListener("click", function(){
  testeLeitura();
  oi++
});

function testeLeitura(){
  if(oi != 0)
    table.setFilter("Turma", "=", "DFB1");
  else
  table.addFilter("Dia da s   emana", "=", "Qua");
}



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

//dar split com ";" e organizar as linhas num vetor
function filtrarFile(content){

  // Split CSV data into lines
  csvLines = content.split('\n');

  // Parse the first line to get column headers
  columns = csvLines[0].split(';');

  // Remove the first line (column headers) from csvLines
  csvLines.shift();
  console.log(columns)
  createTable();
}

//filtros extra
var dateEditor = function(cell, onRendered, success, cancel){
  //cell - the cell component for the editable cell
  //onRendered - function to call when the editor has been rendered
  //success - function to call to pass thesuccessfully updated value to Tabulator
  //cancel - function to call to abort the edit and return to a normal cell

  //create and style input
  var cellValue = luxon.DateTime.fromFormat(cell.getValue(), "dd/MM/yyyy").toFormat("yyyy-MM-dd"),
  input = document.createElement("input");

  input.setAttribute("type", "date");

  input.style.padding = "4px";
  input.style.width = "100%";
  input.style.boxSizing = "border-box";

  input.value = cellValue;

  onRendered(function(){
      input.focus();
      input.style.height = "100%";
  });

  function onChange(){
      if(input.value != cellValue){
          success(luxon.DateTime.fromFormat(input.value, "yyyy-MM-dd").toFormat("dd/MM/yyyy"));
      }else{
          cancel();
      }
  }
  //submit new value on blur or change
  input.addEventListener("blur", onChange);
  //submit new value on enter
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

var timeEditor = function(cell, onRendered, success, cancel){
  //create and style input
  var cellValue = luxon.DateTime.fromFormat(cell.getValue(), "HH:mm:ss").toFormat("HH:mm:ss"),
  input = document.createElement("input");

  input.setAttribute("type", "time");

  input.style.padding = "4px";
  input.style.width = "100%";
  input.style.boxSizing = "border-box";

  // Set today's date along with the time
  var today = luxon.DateTime.local().toISODate();
  input.value = today + 'T' + cellValue;

  onRendered(function(){
      input.focus();
      input.style.height = "100%";
  });

  function onChange(){
      // Construct the full datetime string using today's date and the selected time
      var selectedTime = input.value;
      var fullDatetime = today + 'T' + selectedTime;

      // Parse the full datetime string to ensure it's valid
      var parsedDatetime = luxon.DateTime.fromISO(fullDatetime);

      if(parsedDatetime.isValid){
          success(parsedDatetime.toFormat("HH:mm:ss"));
      }else{
          cancel();
      }
  }
  //submit new value on blur or change
  input.addEventListener("blur", onChange);
  //submit new value on enter
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





function createTable(){
  // Create Tabulator instance
  table = new Tabulator("#table", {
    data: csvLines.map(line => {
      var values = line.split(';');
      var rowData = {};
      columns.forEach((column, index) => {
        rowData[column] = values[index];
      });
      return rowData;
    }),
    columns: columns.map(column => ({ title: column, field: column, editor: hasData(column) ? dateEditor : hasHour(column) ? timeEditor : 'input',headerMenu:headerMenu })),
    layout: "fitDataTable",
    resizableColumns:false,
    pagination: "local",
    paginationSizeSelector:[20, 50, 100],
    paginationSize: 20
  });
  //depois de criar a tabela, cria um form para filtrá-la
  createFilterHorarioForm()
}

//handlers da tabela caracterização sala

document.getElementById("fileCaracterizacaoSalas").addEventListener("change", (event)=>{
  const file = event.target.files[0];
  const reader = new FileReader();
  //leitor do ficheiro
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


function filtrarFileCaracterizacaoSalas(content){
  
  
  // Split CSV data into lines
  csvLinesCaracterizacaoSalas = content.split('\n');

  // Parse the first line to get column headers
  columnsCaracterizacaoSalas = csvLinesCaracterizacaoSalas[0].split(';');

  // Remove the first line (column headers) from csvLines
  csvLinesCaracterizacaoSalas.shift();

  console.log(csvLinesCaracterizacaoSalas[0])
  console.log(columnsCaracterizacaoSalas)
  createSecondTable();
}

//depois de criar a tabela é chamado para criar o form de filtro para o horario
function createFilterHorarioForm(){
  // Create a form element
    form = document.createElement('form');

    // Set form attributes (optional)
    form.setAttribute('id', 'myForm');
    form.setAttribute('action', 'submit.php');
    form.setAttribute('method', 'post');

    for(let i=0;i!=columns.length;i++){

      //label para cada input
      var label = document.createElement('label');
      label.textContent = columns[i]; 
      //para cada elemento do titulo, criar um input para ser filtrado
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

    // Create a submit button
    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);

    //create a reset filter button
    var resetBtn = document.createElement('button');
    resetBtn.setAttribute('id', 'resetBtn');
    resetBtn.setAttribute('type', 'button');
    resetBtn.textContent = 'Reset Filters';
    resetBtn.addEventListener('click', resetTextFilter);
    form.appendChild(resetBtn);

    var section = document.getElementById('fitlerHorarioSection');
    section.appendChild(form);


    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission to the server
      // Loop through form inputs and log their values
      var inputs = form.querySelectorAll('input');
      inputs.forEach(function(input) {
        if(input.value!="" && input.name!=""){
          console.log("Filtering by:", input.name, "with value:", input.value);
          setTextFilter(input)
        }
      });
    });

}

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
      // Rearrange the components to the desired format
      var formattedDate = components[2] + '/' + components[1] + '/' + components[0];
      keywordsToFilter = formattedDate
      console.log("keywords to filter: " + keywordsToFilter)
    }

    table.addFilter(input.name, "keywords", keywordsToFilter, {separator :";"});
}

function resetTextFilter(){
  table.clearFilter();
  var inputs = form.querySelectorAll('input');
  inputs.forEach(function(input) {
    if(input.type!="submit")
      input.value = '';
});
}

function tipoDeInputASerCriado(nomeDaColuna){
  if(nomeDaColuna.toLowerCase().includes("hora"))
    return 'time';
  else if(nomeDaColuna.toLowerCase().includes("data"))
    return 'date';
  else
    return 'text';

  
}

// Criar a tabela da caracterização de salas
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
}


//verificar se os campos são data
function hasData(column){
  columnLower = column.toLowerCase()
  data = "data"
  if(columnLower.includes(data)){
    console.log(columnLower)
    return true
  }else
    return false
}

function hasHour(column){
  columnLower = column.toLowerCase()
  data = "hora"
  if(columnLower.includes(data)){
    console.log(columnLower)
    return true
  }else
    return false
}

//esconder colunas
var headerMenu = function(){
  var menu = [];
  var columns = this.getColumns();

  for(let column of columns){

      //create checkbox element using font awesome icons
      let icon = document.createElement("i");
      icon.classList.add("fas");
      icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

      //build label
      let label = document.createElement("span");
      let title = document.createElement("span");

      title.textContent = " " + column.getDefinition().title;

      label.appendChild(icon);
      label.appendChild(title);

      //create menu item
      menu.push({
          label:label,
          action:function(e){
              //prevent menu closing
              e.stopPropagation();

              //toggle current column visibility
              column.toggle();

              //change menu item icon
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

//filtrar colunas pelo nome


function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
  //headerValue - the value of the header filter element
  //rowValue - the value of the column in this row
  //rowData - the data for the row being filtered
  //filterParams - params object passed to the headerFilterFuncParams property

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

  return true; //must return a boolean, true if it passes the filter.
}