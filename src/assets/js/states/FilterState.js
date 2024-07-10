import isEqual from 'lodash/isEqual'
/**
 * This class describes a common “abstract” class for all specific filter states.
 * Error output in methods is necessary for the mandatory implementation of these methods in child classes.
 *
 * All states describe the process of entering a `query` to filter data.
 * At the initial stage, when the component is initialized, the `schema` is received.
 * This `schema` describes root entity models.
 * Each root entity corresponds to a table in the database.
 *
 * After selecting the root entity, a condition is set for filtering data by this entity.
 * The condition consists of three steps:
 *  - field selection (ColumnSelectionState);
 *  - type of filtration (OperationInputState);
 *  - value (CellValueSelectionState).
 *
 * All formed conditions are “glued” to each other using a list of reserved words `keywords`.
 *
 * @abstract
 */
export default class FilterState {
  /**
   * The context is a reference to the Vue component.
   * Through the context, it is convenient to obtain from the necessary information and carry out a change in its state.
   * @param {object} context
   */
  constructor (context) {
    this.context = context
    this.tableUpdated = false
  }

  get isTableUpdated () {
    return this.tableUpdated
  }

  /**
   * Character input processing
   * @param {string} input
   * @param lastChars
   */
  onInputHandler (input, lastChars) {
    this.context.filterOptions(lastChars)
    const value = lastChars.toLowerCase()
    const isValueCompleted = input.endsWith(' ') && this.context.dOptions.findMatch(value, true)
    if (this.context.dOptions.findMatch(value, false) || isValueCompleted) {
      this.context.onOptionClick(value)
    }
  }

  /**
   * Adds or removes an item in query
   * @param {string} option - word or combination of words
   */
  appendOrReplacePart (option) {
    if (this.context.query.downgraded) {
      this.context.query.deletePart()
    }

    return this.context.query.addPart(option, ' ')
  }

  /**
   * Defines an array of strings to display in the options dropdown
   */
  updateOptions () {
    this.context.dOptions.update([])
  }

  /**
   * Update state, filter and options
   */
  forwardFilter () {
    this.updateOptions()
  }

  /**
   * Calls table content update when pagination settings are changing
   * @param query - new search string value
   */
  reloadTableOnOptionChange (query) {
    const { serverItemsLength, hasFurtherData } = this.context.table
    this.context.tableService.updateTable(query, false)
      .then(() => {
        if (!hasFurtherData) {
          this.context.table.serverItemsLength = serverItemsLength
          this.context.table.hasFurtherData = hasFurtherData
        }
      })
  }

  shouldDowngrade (input) {
    return this.context.query.isNeedsToDowngrade(input)
  }
  /**
   * After state downgrading updates table and options, corresponding to the current state and query.line
   * @param lastChars - part of the query.line, corresponding to the current state
   */
  downgradeFilter (lastChars) {
    this.updateOptions()
    this.context.dOptions.filter(lastChars)
  }

  tableRowClick (item) {
    const queryData = Object.assign({ entity: this.context.query.rootEntity.name }, item.identity)
    const itemData = this.context.tableService.items.find(el => isEqual(el.identity, item.identity))
    this.context.$emit('switch-page', 'edit', queryData, {
      objectSchema: this.context.query.rootEntity,
      objectData: itemData
    })
  }

  /**
   * Проверка на удаление последней части из условия
   */
  isLastPartDeleted () {
    throw new Error(`isLastPartDeleted method must be overridden in ${this.constructor.name} class.`)
  }

  /**
   * Getting the next state
   */
  next () {
    throw new Error(`next method must be overridden in ${this.constructor.name} class.`)
  }

  /**
   * Getting the previous state
   */
  prev () {
    throw new Error(`prev method must be overridden in ${this.constructor.name} class.`)
  }
}
