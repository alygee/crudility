import Operation from '../enum/Operation'
import FilterState from './FilterState'
import CellValueSelectionState from './CellValueSelectionState'
import ColumnSelectionState from './ColumnSelectionState'
import KeywordInputState from './KeywordInputState'

/**
 * The state in which the type of filtering occurs
 */
class OperationInputState extends FilterState {
  /**
   * Vue parent component reference
   * @param {object} context
   * @param {Boolean} conditionWithoutValue - Indicates that in the current condition is specified an operation (is empty/is not empty) in which it is not necessary to specify values.
   * When 'conditionWithoutValue' is true, CellValueSelectionState is skipping
   * Used to get correct next state
   */
  constructor (context, conditionWithoutValue = false) {
    super(context)
    this.conditionWithoutValue = conditionWithoutValue
  }

  appendOrReplacePart (option) {
    this.conditionWithoutValue = Operation.operationsWithoutValueInCondition().includes(option)
    return FilterState.prototype.appendOrReplacePart.call(this, option)
  }

  updateOptions () {
    this.context.dOptions.update(Operation.getList())
  }

  /**
   * Checks whether the operation value has been removed from the condition.
   * @param {Condition} cdInput - new condition that we get from the input line
   * @param {Condition} cdLine - old condition contained in query.line
   * @returns {boolean} `true` if the value has been deleted
   */
  isLastPartDeleted (cdInput, cdLine) {
    if (!cdLine) {
      return false
    }

    if (cdLine.operation && !cdInput) {
      return true
    }

    if (cdLine.column !== cdInput.column) {
      return false
    }

    return cdLine.operation && !cdInput.operation
  }

  /**
   * If 'conditionWithoutValue' is true, CellValueSelectionState is skipping and returns KeywordInputState.
   * In this state occurs “gluing” with the new condition using the reserved word “keywords”.
   *
   * Else returns CellValueSelectionState.
   * In this state, entering values is expected to complete the formation of the filter condition.
   * @returns {KeywordInputState | CellValueSelectionState}
   */
  next () {
    if (this.conditionWithoutValue) {
      return new KeywordInputState(this.context, true)
    } else {
      return new CellValueSelectionState(this.context)
    }
  }

  /**
   * In the previous state, a field is selected for the filter condition
   * @returns {ColumnSelectionState}
   */
  prev () {
    return new ColumnSelectionState(this.context)
  }
}

export default OperationInputState
