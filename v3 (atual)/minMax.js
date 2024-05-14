function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams) {

    if (rowValue) {
      if (headerValue.start != "") {
        if (headerValue.end != "") {
          return rowValue >= headerValue.start && rowValue <= headerValue.end;
        } else {
          return rowValue >= headerValue.start;
        }
      } else {
        if (headerValue.end != "") {
          return rowValue <= headerValue.end;
        }
      }
    }

    return true; //Devolve um booleano, verdadeiro se passar no filtro
  }

module.exports = {minMaxFilterFunction}