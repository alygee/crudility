import Line from '../filter/Line'
import FilterState from './FilterState'
import KeywordInputState from './KeywordInputState'
import OperationInputState from './OperationInputState'

/**
 * In this state, a filter value is entered.
 * The filtering condition is then considered to be formed.
 */
class CellValueSelectionState extends FilterState {
  /**
   * Vue parent component reference
   * @param {object} context
   */
  // eslint-disable-next-line no-useless-constructor
  constructor (context) {
    super(context)
  }

  /**
   * Character input processing
   * @override
   * @param {string} input
   * @param lastChars
   */
  onInputHandler (input, lastChars) {
    if (this.isCellValueCompleted(input, lastChars) && lastChars) {
      this.context.onOptionClick(lastChars)
    }
  }

  /**
   * The cell value is considered complete if it is
   * 1. one word, without quote and bracket at the beginning of the string, and with the space at the end. Ex., 'test_value '
   * 2. a line, that ends with a space, and the text is enclosed in brackets
   * 3. a line, that ends with a space, and the text is enclosed in quotes
   * @param input - full line
   * @param lastChars - last state value
   * @returns {boolean | *}
   */
  isCellValueCompleted (input, lastChars) {
    const isStartsWithQuotes = /^['"][^'"]*/.test(lastChars)
    const isStartsAndEndsWithQuotes = this.context.query.haveQuotes(lastChars)

    const isStartsWithBrackets = /^\([^()]*/.test(lastChars)
    const isStartsAndEndsWithBrackets = this.context.query.haveBrackets(lastChars)

    return (input.endsWith(' ') && !isStartsWithQuotes && !isStartsWithBrackets) ||
      (input.endsWith(' ') && isStartsAndEndsWithQuotes) ||
      (input.endsWith(' ') && isStartsAndEndsWithBrackets)
  }

  /**
   * Updates the table based on the query, without the current condition
   * The current condition is not taken into account when updating the table,
   * as the cell value is editing, that is, it will obviously change and the condition is not relevant
   * @param lastChars
   */
  downgradeFilter (lastChars) {
    this.context.tableService.updateTable(new Line(this.context.query.line).techLine(true))
    this.updateOptions()
    this.context.dOptions.filter(lastChars)
  }

  /**
   * Проверяет было ли удалено значение из условия
   * @param {Condition} cdInput - новое условие, которое получаем из строки ввода
   * @param {Condition} cdLine - старое условие, которое содержится в `query.line`
   * @returns {boolean} `true` если было удалено значение
   */
  isLastPartDeleted (cdInput, cdLine) {
    if (!cdLine) {
      return false
    }

    if (cdLine.value && !cdInput) {
      return true
    }

    if ((cdLine.column !== cdInput.column) || (cdLine.operation !== cdInput.operation)) {
      return false
    }

    return cdLine.value && !cdInput.value
  }

  /**
   * In the new state, occurs “gluing” with the new condition using the reserved word “keywords”.
   * @returns {KeywordInputState}
   */
  next () {
    return new KeywordInputState(this.context)
  }

  /**
   * In the previous state, the type of filtering is determined
   * @returns {OperationInputState}
   */
  prev () {
    return new OperationInputState(this.context)
  }
}

export default CellValueSelectionState
