export class Condition {
  /**
   * @param column
   * @param operation
   * @param value
   * @param keyword
   * @param index
   * @param conditionWithoutValue - Indicates that in the current condition is specified an operation (is empty/is not empty) in which it is not necessary to specify values.
   */
  constructor (column, operation, value, keyword, index, conditionWithoutValue = false) {
    this.column = column ? column.trim() : ''
    this.operation = operation ? operation.trim() : ''
    this.value = value ? value.trim() : ''
    this.keyword = keyword ? keyword.trim() : ''
    this.index = index || 0
    this.conditionWithoutValue = conditionWithoutValue
  }

  toLine () {
    const str = `${this.column} ${this.operation} ${this.conditionWithoutValue ? '' : this.value + ' '}${this.keyword} `
    return str.trim() + ' '
  }

  toTechLine () {
    const techStr = this.toTechLineWithoutKeyword() + this.keyword
    return techStr.trim() + ' '
  }

  toTechLineWithoutKeyword () {
    const techStr = `${this.addQuotesToColumn(this.column)} ${this.operation} ${this.addQuotesToValue(this.value)}`
    return techStr.trim() + ' '
  }

  addQuotesToValue (option) {
    if (option && !this.hasQuotes(option) && !this.hasBrackets(option)) {
      return `"${option}"`
    } else {
      return option
    }
  }

  addQuotesToColumn (option) {
    const parts = option.split('.')
    if (parts.length > 1) {
      return this.framedOption(parts[0]) + '.' + this.framedOption(parts[1])
    }
    return this.framedOption(option)
  }

  framedOption (option) {
    return option.split(' ').length > 1 ? `"${option}"` : option
  }

  isCompleted () {
    if (this.conditionWithoutValue) {
      return this.column && this.operation
    } else {
      return this.column && this.operation && this.value
    }
  }

  deleteLastOption () {
    if (this.keyword) {
      this.keyword = ''
    } else if (!this.conditionWithoutValue && this.value) {
      this.value = ''
    } else if (this.operation) {
      this.operation = ''
    } else if (this.column) {
      this.column = ''
    }
  }

  hasQuotes (option) {
    return /^['"][^'"]*['"]$/.test(option)
  }

  hasBrackets (option) {
    return /^\([^()]*\)$/.test(option)
  }

  diff (condition) {
    return Object.keys(this).reduce((diff, key) => {
      const isEqual = (this[key] === condition[key]) ||
        (key === 'keyword' && !condition.keyword && this.keyword && condition.value)
      return diff + !isEqual
    }, 0)
  }
}
