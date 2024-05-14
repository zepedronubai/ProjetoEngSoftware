function createFilterHorarioForm() {
    // Cria um elemento de formulário
    form = document.createElement('form');

    // Definir atributos do formulário (opcional)
    form.setAttribute('id', 'myForm');
    form.setAttribute('action', 'submit.php');
    form.setAttribute('method', 'post');

    for (let i = 0; i != columns.length; i++) {

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


    form.addEventListener('submit', function (event) {

      //Impedir a submissão de formulários ao servidor
      event.preventDefault();

      //Percorrer as entradas do formulário e registar os seus valores
      var inputs = form.querySelectorAll('input');
      inputs.forEach(function (input) {
        if (input.value != "" && input.name != "") {
          console.log("Filtering by:", input.name, "with value:", input.value);
          setTextFilter(input)
        }
      });
    });

  }

module.exports(createFilterHorarioForm)