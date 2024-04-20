let fileContent;

let titulo = [];
let linhas = [];
let firstTime = 0;

let pagesSize = 50;
let pageIndex = 1;
console.log("Hello world");
let x = "Tamos ai, Zé";
console.log(x); 

let nomeFicheiro = ""
let botao = document.getElementById("botaoDarkTheme");

botao.addEventListener("click",darkTheme,false);

document.getElementById("ficheiro").addEventListener("change", (event)=>{
    const file = event.target.files[0];
    const reader = new FileReader();

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


function darkTheme(){
    let htmlBody = document.body;
    htmlBody.classList.toggle("dark-mode");        
}

function changeBackgroundColour(){
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = "#"+ randomColor;
}

//dar split com ";" e organizar as linhas num vetor
function filtrarFile(content){
    let object = {};
    let contentSplittedByLines = content.split("\n");
    //começar a ler o ficheiro por linhas desde o titulo
        for(let linha=0; linha!= pagesSize/*contentSplittedByLines.length*/ ; linha++){
            let linhaSplitted = contentSplittedByLines[linha].split(";");
            //criar titulo
            if(linha==0){
                for(let j=0;j!=linhaSplitted.length;j++){
                    titulo.push(linhaSplitted[j]);
                }

            }else{ //criar linhas
                let object = {}
                //console.log("Linha a ser observada: " + linhaSplitted)
                for(let j=0;j!=linhaSplitted.length;j++){
                    object[titulo[j]] = linhaSplitted[j];
                   // console.log("Propriedade " + titulo[j] + " com valor" + linhaSplitted[j])
                }
               // console.log("Objeto linha criado e passado para o vetor de objetos" + object)
                linhas.push(object)
            }

        }
    createTable(titulo,linhas);
}

function nextAndBackPage(content, index){
    let object = {};
    let contentSplittedByLines = content.split("\n");
    linhas = [];
    if(index>0){
        pageIndex=index;
    //começar a ler o ficheiro por linhas desde o index até ao tamanhoMax das pages
        for(let linha=index; linha!= index+pagesSize /*contentSplittedByLines.length*/ ; linha++){
            let linhaSplitted = contentSplittedByLines[linha].split(";");
             //criar linhas
                let object = {}
                //console.log("Linha a ser observada: " + linhaSplitted)
                for(let j=0;j!=linhaSplitted.length;j++){
                    object[titulo[j]] = linhaSplitted[j];
                   // console.log("Propriedade " + titulo[j] + " com valor" + linhaSplitted[j])
                }
               // console.log("Objeto linha criado e passado para o vetor de objetos" + object)
                linhas.push(object)
            }
    createTable(titulo,linhas);
    }
}

botaoNextPage = document.getElementById("NextPage");
botaoBackPage = document.getElementById("BackPage");
console.log(botaoNextPage)
botaoBackPage.addEventListener("click", function(){
    nextAndBackPage(fileContent, pageIndex-pagesSize);
});
botaoNextPage.addEventListener("click", function(){
    nextAndBackPage(fileContent, pageIndex+pagesSize);
});


function createTable(titulo, linhas){
    let table = document.getElementById("table");
    if(firstTime==0){
    let tituloEmArray = Object.values(titulo);
        let tituloEmHtml = `<tr>`;
        let botoesSortHtml = ``;
        for(let tituloObj=0; tituloObj!=tituloEmArray.length; tituloObj++){
            let nomeTitulo = tituloEmArray[tituloObj];
            console.log(nomeTitulo);
            //adicionar os botoes para filtrar
            botoesSortHtml += `<button name="${nomeTitulo}" class="sortingBotoes" value="${nomeTitulo}" >${nomeTitulo}</button>`
            botao = document.getElementsByName(nomeTitulo)
            //console.log(document.getElementsByName(nomeTitulo) )
            tituloEmHtml += `<th id="${nomeTitulo}" data-order="desc" onclick="filterColumn('${nomeTitulo}')">${nomeTitulo}</th>`
            //botao.addEventListener("click",filterColumn(document.getElementById("${nomeTitulo}")))
        }
        tituloEmHtml += `</tr>`;
        botoesDiv.innerHTML += botoesSortHtml;
        table.innerHTML += tituloEmHtml;
        eventListenerDosBotoes();
        firstTime++;
    }
    

    let rowsToDelete = document.getElementsByClassName("data-row");
    for(let ya=0; ya!=rowsToDelete.length; ya++){
        rowsToDelete[ya].innerHTML = ``;
    }
    
    //adicionar as linhas à tabela
    for(let linha=0; linha!=linhas.length; linha++){
        let linhaEmHtml = `<tr class="data-row">`;
        let linhaEmArray = Object.values(linhas[linha]);
       // console.log(linhaEmArray);
        for(let obj=0; obj!=linhaEmArray.length; obj++){
        //    console.log(linhaEmArray[obj])
            if(obj==4){
                let valor = linhaEmArray[obj];
                let valorPercentagem = valor*100/60;
                linhaEmHtml += `<td><div style="background-color: #00FF00;width:${valorPercentagem}%">${linhaEmArray[obj]}</div></td>`
            }else{
                linhaEmHtml += `<td>${linhaEmArray[obj]}</td>`
            }
            
        }
        linhaEmHtml += `</tr>`;
        table.innerHTML += linhaEmHtml;                    
    }
    
}

function eventListenerDosBotoes(){
    botoes = document.getElementsByClassName("sortingBotoes");
    console.log(botoes);
    for(let i=0; i!=botoes.length; i++){
        let botaoName = botoes[i].getAttribute("name");
        botoes[i].addEventListener("click", function(){
                                    filterColumn(botaoName);
                                });
        console.log("nome botao: " + botaoName + " Objeto: " + botoes[i]);
    }
}


function filterColumn(ondeClicou){
    console.log("clicou algures" + document.getElementById(ondeClicou).dataset.order)
   // console.log(titulo)
    let colunaClicked = document.getElementById(ondeClicou);
    let columnClickedId = colunaClicked.id;
    let columnClickedOrder = colunaClicked.dataset.order;

    if(columnClickedOrder=="desc"){
        colunaClicked.dataset.order = "asc";
        linhas = linhas.sort((a,b) => a[columnClickedId] >  b[columnClickedId] ? 1:-1);
    }else{
        colunaClicked.dataset.order = "desc";
        linhas = linhas.sort((a,b) => a[columnClickedId] <  b[columnClickedId] ? 1:-1);
    }
    createTable(titulo,linhas)
}

let search = document.getElementById("searchInput").addEventListener("onkeyup", searchFilter);

function searchFilter(){
   // console.log(document.getElementById("searchInput").value);
    let linhasComFiltro = searchTable(document.getElementById("searchInput").value, linhas)
    createTable(titulo,linhasComFiltro)
}



function searchTable(search, linhas){
    let linhasComFiltro = []
    search = search.toLowerCase();

    for(let i=0; i!= linhas.length; i++){
        /*let teste = linhas[i]['Dia da semana'].toLowerCase();*/


        if(checkIfLineHasSearchIncluded(search,linhas[i]))
            linhasComFiltro.push(linhas[i]);
    }
    return linhasComFiltro;
}

function checkIfLineHasSearchIncluded(search,objetoDaLinha){
    objetoDaLinhaEmVetor = Object.values(objetoDaLinha);
    for(let i=0; i!= objetoDaLinhaEmVetor.length; i++){
        if(objetoDaLinhaEmVetor[i].toLowerCase().includes(search))
            return true;
    }
    return false;
}
