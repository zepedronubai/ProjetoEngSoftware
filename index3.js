var fileContent;
var titulos = [];
var linhas = [];
var csvData;

var csvLines;
var columns;

var botao = document.getElementById("botaoDarkTheme")
botao.addEventListener("click",darkTheme,false);
function darkTheme(){
    console.log("oi")
    let htmlBody = document.body;
    htmlBody.classList.toggle("dark-mode");        
}


 // Your CSV data
  var csvData2 = `Name,Date,Time
John,2024-03-18,08:00
Alice,2024-03-22,09:00
Bob,2024-03-20,10:00`;




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
    let object = {};
    let contentSplittedByLines = content.split("\n");
    //começar a ler o ficheiro por linhas desde o titulo
        for(let linha=0; linha!= 300/*pagesSizecontentSplittedByLines.length*/ ; linha++){
            let linhaSplitted = contentSplittedByLines[linha].split(";");
            //criar titulo
            if(linha==0){
                for(let j=0;j!=linhaSplitted.length;j++){
                    titulos.push(linhaSplitted[j]);
                }

            }else{ //criar linhas
                let object = {}
                //console.log("Linha a ser observada: " + linhaSplitted)
                for(let j=0;j!=linhaSplitted.length;j++){
                    object[titulos[j]] = linhaSplitted[j];
                   // console.log("Propriedade " + titulo[j] + " com valor" + linhaSplitted[j])
                }
               // console.log("Objeto linha criado e passado para o vetor de objetos" + object)
                linhas.push(object)
            }

        }
    csvData = fileContent

    // Split CSV data into lines
    csvLines = csvData.split('\n');

    // Parse the first line to get column headers
    columns = csvLines[0].split(';');

    // Remove the first line (column headers) from csvLines
    csvLines.shift();

    createTable();
}


function createTable(){
  // Create Tabulator instance
  var table = new Tabulator("#table", {
    data: csvLines.map(line => {
      var values = line.split(';');
      var rowData = {};
      columns.forEach((column, index) => {
        rowData[column] = values[index];
      });
      return rowData;
    }),
    columns: columns.map(column => ({ title: column, field: column })),
    layout: "fitColumns",
    resizableColumns:false,
    pagination: "local",
    paginationSize: 10
  });
}