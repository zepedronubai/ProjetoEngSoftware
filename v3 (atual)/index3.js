var fileContent;
var titulos = [];
var linhas = [];
var csvData;
var table;
var csvLinesCaracterizacaoSalas;
var columnsCaracterizacaoSalas;
var csvLines;
var columns;
var firstTimeOpeningCaracterizaocaoSalas = true

var botao = document.getElementById("botaoDarkTheme")
botao.addEventListener("click",darkTheme,false);
function darkTheme(){
    console.log("oi")
    let htmlBody = document.body;
    htmlBody.classList.toggle("dark-mode");        
}

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

//dar split com ";" e organizar as linhas num vetor
function filtrarFile(content){

  // Split CSV data into lines
  csvLines = content.split('\n');

  // Parse the first line to get column headers
  columns = csvLines[0].split(';');

  // Remove the first line (column headers) from csvLines
  csvLines.shift();

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
}

//handlers da tabela caracterização sala
fileCaracterizacaoSalas

document.getElementById("fileCaracterizacaoSalas").addEventListener("change", (event)=>{
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

  reader.readAsText(file,'utf-8')
});


function filtrarFileCaracterizacaoSalas(content){
  
  // Split CSV data into lines
  csvLinesCaracterizacaoSalas = content.split('\n');

  // Parse the first line to get column headers
  columnsCaracterizacaoSalas = csvLinesCaracterizacaoSalas[0].split(';');

  // Remove the first line (column headers) from csvLines
  csvLinesCaracterizacaoSalas.shift();

  createSecondTable();
}




// Criar a tabela da caracterização de salas
function createSecondTable(){
  if (firstTimeOpeningCaracterizaocaoSalas){
    console.log("Dentro da criar second table")
    firstTimeOpeningCaracterizaocaoSalas = false
    table = new Tabulator("#table2", {
      data: csvLinesCaracterizacaoSalas.map(line => {
        var values = line.split(';');
        var rowData = {};
        columnsCaracterizacaoSalas.forEach((column, index) => {
          rowData[column] = values[index];
        });
        return rowData;
      }),
      columnsCaracterizacaoSalas: columnsCaracterizacaoSalas.map(column => ({ title: column, field: column})),
      layout: "fitDataTable",
      pagination: "local",
      paginationSizeSelector:[20, 50, 100],
      paginationSize: 20
    });
  }else{

  }
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
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

  var end;

  var container = document.createElement("span");

  //create and style inputs
  var start = document.createElement("input");
  start.setAttribute("type", "number");
  start.setAttribute("placeholder", "Min");
  start.setAttribute("min", 0);
  start.setAttribute("max", 100);
  start.style.padding = "4px";
  start.style.width = "50%";
  start.style.boxSizing = "border-box";

  start.value = cell.getValue();

  function buildValues(){
      success({
          start:start.value,
          end:end.value,
      });
  }

  function keypress(e){
      if(e.keyCode == 13){
          buildValues();
      }

      if(e.keyCode == 27){
          cancel();
      }
  }

  end = start.cloneNode();
  end.setAttribute("placeholder", "Max");

  start.addEventListener("change", buildValues);
  start.addEventListener("blur", buildValues);
  start.addEventListener("keydown", keypress);

  end.addEventListener("change", buildValues);
  end.addEventListener("blur", buildValues);
  end.addEventListener("keydown", keypress);


  container.appendChild(start);
  container.appendChild(end);

  return container;
}

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