function hasData(column) {
    columnLower = column.toLowerCase()
    data = "data"
    if (columnLower.includes(data)) {
      console.log(columnLower)
      return true
    } else
      return false
  }

  /**
   * Função booleana que verifica se o parâmetro column é igual à string "hora"
   * @param {string} column 
   * @returns boolean (hora or not hora)
   */
  function hasHour(column) {
    columnLower = column.toLowerCase()
    data = "hora"
    if (columnLower.includes(data)) {
      console.log(columnLower)
      return true
    } else
      return false
  }

module.exports = { hasData, hasHour };