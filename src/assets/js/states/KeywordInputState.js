import { Parser } from '../filter/Parser'
import Keyword from '../enum/Keyword'
import Line from '../filter/Line'
import FilterState from './FilterState'
import ColumnSelectionState from './ColumnSelectionState'
import CellValueSelectionState from './CellValueSelectionState'
import OperationInputState from './OperationInputState'

/**
 * At this stage, the logic of interaction with other conditions is determined.
 * The conditions are linked together using a reserved word from the list of `keywords`.
 */
class KeywordInputState extends FilterState {
  /**
   * Vue parent component reference
   * @param {object} context
   * @param {Boolean} conditionWithoutValue - Indicates that in the current condition is specified an operation (is empty/is not empty) in which it is not necessary to specify values.
   * When 'conditionWithoutValue' is true, CellValueSelectionState is skipping
   * Used to get correct previous state
   */
  constructor (context, conditionWithoutValue = false) {
    super(context)
    this.conditionWithoutValue = conditionWithoutValue
    this.tableUpdated = true
  }

  get isTableUpdated () {
    return this.tableUpdated
  }

  updateOptions () {
    this.context.dOptions.update(Keyword.getList())
  }

  /**
   * Update state, filter and options
   */
  forwardFilter () {
    this.context.tableService.updateTable(new Line(this.context.query.line).techLine())
    this.updateOptions()
  }

  /**
   * After state downgrading updates options, corresponding to the current state
   * and determines the 'conditionWithoutValue' for the current condition (it is necessary to get correct previous state)
   * @param lastChars - part of the query.line, corresponding to the current state
   */
  downgradeFilter (lastChars) {
    this.conditionWithoutValue = Parser.cdLast(this.context.query.line).conditionWithoutValue
    this.updateOptions()
    this.context.dOptions.filter(lastChars)
  }

  /**
   * Checks whether the keyword value has been removed from the condition.
   * @param {Condition} cdInput - new condition that we get from the input line
   * @param {Condition} cdLine - old condition contained in query.line
   * @returns {boolean} `true` if the value has been deleted
   */
  isLastPartDeleted (cdInput, cdLine) {
    if (!cdLine) {
      return false
    }

    if (cdLine.keyword && !cdInput) {
      return true
    }

    if ((cdLine.column !== cdInput.column) ||
      (cdLine.operation !== cdInput.operation) ||
      (cdLine.value !== cdInput.value)) {
      return false
    }

    return cdLine.keyword && !cdInput.keyword
  }

  /**
   * At the next step, the field is selected and the formation of a new condition begins.
   * @returns {ColumnSelectionState}
   */
  next () {
    return new ColumnSelectionState(this.context)
  }

  /**
   * If 'conditionWithoutValue' is true, CellValueSelectionState is skipping and returns OperationInputState.
   * In this state the operation of conditions is determining.
   *
   * Else returns CellValueSelectionState.
   * In this state, entering values is expected to complete the formation of the filter condition.
   * @returns {CellValueSelectionState | OperationInputState}
   */
  prev () {
    if (this.conditionWithoutValue) {
      return new OperationInputState(this.context)
    } else {
      return new CellValueSelectionState(this.context)
    }
  }
}

export default KeywordInputState
