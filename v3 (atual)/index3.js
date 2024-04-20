var fileContent;
var titulos = [];
var linhas = [];
var csvData;
var table;
var csvLines;
var columns;

var botao = document.getElementById("botaoDarkTheme")
botao.addEventListener("click",darkTheme,false);
function darkTheme(){
    console.log("oi")
    let htmlBody = document.body;
    htmlBody.classList.toggle("dark-mode");        
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

var timeEditor = function(cell, onRendered, success, cancel, editorParams){
  // Create and style editor
  var editor = document.createElement("input");
  editor.setAttribute("type", "time");

  // Style input
  editor.style.padding = "3px";
  editor.style.width = "100%";
  editor.style.boxSizing = "border-box";

  // Set value of editor to the current value of the cell
  editor.value = moment(cell.getValue(), "HH:mm").format("HH:mm");

  // Set focus on the input when the editor is selected
  onRendered(function(){
      editor.focus();
  });

  // When the value has been set, trigger the cell to update
  function successFunc(){
      success(moment(editor.value, "HH:mm").format("HH:mm"));
  }

  // Trigger successFunc on change or blur
  editor.addEventListener("change", successFunc);
  editor.addEventListener("blur", successFunc);

  // Return the editor element
  return editor;
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
    columns: columns.map(column => ({ title: column, field: column, editor: hasData(column) ? dateEditor : 'input' })),
    layout: "fitColumns",
    resizableColumns:false,
    pagination: "local",
    paginationSizeSelector:[10, 20, 50, 100],
    paginationSize: 10
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
