import { Parser } from '../filter/Parser'
import FilterState from './FilterState'
import ColumnSelectionState from './ColumnSelectionState'

/**
 * The selection state of the root entity to search.
 * Each entity is described by three fields: name, title, description.
 */
class EntitySelectionState extends FilterState {
  /**
   * Vue parent component reference
   * @param {object} context
   */
  // eslint-disable-next-line no-useless-constructor
  constructor (context) {
    super(context)
    this.tableUpdated = true
  }

  get isTableUpdated () {
    return this.tableUpdated
  }

  /**
   * Запускает поиск написания в отфильтрованном списке `options` и установку корневой сущности в двух случаях.
   * 1) полное написание названия сущности. Если есть несколько вариантов, то ожидается ввод самого длинного.
   * 2) при нажатии на `:`
   * @param input
   * @param lastChars
   */
  onInputHandler (input, lastChars) {
    const optionIsEntity = input[input.length - 1] === ':'
    const option = optionIsEntity ? lastChars.slice(0, -1) : lastChars

    this.context.filterOptions(option)

    if (this.context.dOptions.findMatch(option.toLowerCase(), optionIsEntity)) {
      this.context.debouncedClick(option)
    }
  }

  /**
   * Sets the root entity and adds or removes an item in query
   * @param {string} option слово или комбинация слов
   */
  appendOrReplacePart (option) {
    this.setRootEntityAndLinks(option)

    if (this.context.query.downgraded || this.context.query.line) {
      this.context.query.deletePart()
    }

    return this.context.query.addPart(option, ': ')
  }

  /**
   * @param {string} option слово или комбинация слов
   */
  setRootEntityAndLinks (option) {
    const compareStrings = (str1, str2) => str1 && str2
      ? str1.toLowerCase() === str2.toLowerCase()
      : false
    const entity = this.context.schema.entities.find(
      data => compareStrings(data.name, option) || compareStrings(data.title, option)
    )

    this.context.query.setRootEntityAndLinks(entity)
  }

  /**
   * Go to next state and update table and options
   * After entering entity value it is necessary to update the table
   * Since in the next state (ColumnSelectionState) table update is not provided, method call FilterState.prototype.updateTable
   */
  forwardFilter () {
    this.updateTable()
    this.updateOptions()
  }

  /**
   * Returns entities names and titles in array
   * @returns {Array}
   */
  updateOptions () {
    const items = this.context.schema.entities
    this.context.dOptions.update(this.context.getNamesAndTitles(items))
  }

  updateTable (resetTableOptions = true) {
    if (resetTableOptions) {
      this.context.table.resetPageAndOffset()
    }
    const items = this.context.schema.entities
    this.context.table.serverItemsLength = -1
    this.context.tableService.updateItems(items)
    this.context.tableService.updateHeaders()
  }

  reloadTableOnOptionChange () {
    this.updateTable(false)
  }

  shouldDowngrade () {
    return false
  }

  downgradeFilter (lastChars) {
    this.context.query.line = Parser.root(this.context.query.line)
    this.context.query.rootEntity = null
    lastChars = this.context.query.line

    this.updateTable()
    this.updateOptions()

    this.context.dOptions.filter(lastChars)
  }

  tableRowClick (item) {
    const option = item.title || item.name
    this.context.onOptionClick(option)
  }

  /**
   * По логике в это место не должны попасть.
   * @returns {boolean}
   */
  isLastPartDeleted () {
    return false
  }

  /**
   * In the next state, the field is selected.
   * The field corresponds to the table field in the database.
   * @returns {ColumnSelectionState}
   */
  next () {
    return new ColumnSelectionState(this.context)
  }

  /**
   * There is no previous state.
   * The choice of the root entity is carried out at first once.
   * The logic of determining the previous state, at the moment, is defined in the context.
   */
  prev () {
    throw new Error('Implement getting the previous state in the EntitySelectionState class')
  }
}

export default EntitySelectionState
