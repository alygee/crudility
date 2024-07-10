import concat from 'lodash/concat'
import { Parser } from '../filter/Parser'
import Line from '../filter/Line'
import FilterState from './FilterState'
import OperationInputState from './OperationInputState'
import KeywordInputState from './KeywordInputState'
import EntitySelectionState from './EntitySelectionState'

/**
 * The state in which the type of filtering occurs
 */
class ColumnSelectionState extends FilterState {
  /**
   * Vue parent component reference
   * @param {object} context
   */
  constructor (context) {
    super(context)
    this.link = null
    this.linkName = ''
  }

  get isTableUpdated () {
    return Parser.isEmptyCds(this.context.query.line)
  }

  setLink (option) {
    this.link = this.context.query.findLinkByOption(option)
    this.linkName = this.link ? option : ''
  }

  /**
   * Character input processing
   * @override
   * @param {string} input
   * @param lastChars
   */
  onInputHandler (input, lastChars) {
    /**
     * Значение колонки может быть двух видов: 'columnName' и 'columnName.nestedColumnName'
     * Разделение через точку используется если в выбранной колонке хранится объект. 'nestedColumnName' обозначает свойство вложенного объекта.
     * columnOrLinkPart содержит значение nestedColumnName (при наличии) или columnName
     * @type {string}
     */
    const columnOrLinkPart = lastChars.split('.').pop()
    if (input === this.context.query.line.slice(0, this.context.query.line.lastIndexOf('.'))) {
      this.context.query.downgraded = true
      this.updateOptions()
      return
    }
    this.context.filterOptions(columnOrLinkPart)
    if (this.context.dOptions.findMatch(columnOrLinkPart, false, input.endsWith(' '))) {
      this.context.onOptionClick(columnOrLinkPart)
    }
  }

  /**
   * The method is called after 'appendOrReplacePart'.
   * If 'this.link' is defined in the appendOrReplacePart method (the selected column is a link),
   * then the options are updated, the transition to the next state does not occur.
   */
  forwardFilter () {
    if (Parser.isEmptyCds(this.context.query.line)) {
      this.context.tableService.updateTable(new Line(this.context.query.line).techLine())
    }
    this.updateOptions()
  }

  /**
   * After state downgrading updates table and options, corresponding to the current state and query.line
   * @param lastChars - part of the query.line, corresponding to the current state
   */
  downgradeFilter (lastChars) {
    const columnAndLink = lastChars ? lastChars.split('.') : []
    if (columnAndLink.length > 1) {
      this.setLink(columnAndLink[0])
      this.updateLinkOptions()
    } else {
      this.updateOptions()
    }
    this.context.dOptions.filter(lastChars)
  }

  /**
   * Adds or removes an item in query
   * @param {string} option слово или комбинация слов
   */
  appendOrReplacePart (option) {
    if (this.context.query.downgraded) {
      const trail = this.link && this.linkName !== option ? `${this.linkName}.` : ''
      this.context.query.deletePart(trail)
    }
    this.setLink(option)
    return this.context.query.addPart(option, this.link ? '.' : ' ')
  }

  /**
   * Returns fields names and titles in array
   * @returns {Array}
   */
  updateOptions () {
    const { rootEntity, links } = this.context.query
    const items = concat(rootEntity.fields, links)
    this.context.dOptions.update(this.context.getNamesAndTitles(items))
  }

  updateLinkOptions () {
    const options = this.context.schema.entities.find(e => e.name === this.link.targetEntity).fields
    this.context.dOptions.update(this.context.getNamesAndTitles(options))
  }

  /**
   * Проверяет было ли удалено значение колонки
   * @param {Condition} cdInput - новое условие, которое получаем из строки ввода
   * @param {Condition} cdLine - старое условие, которое содержится в `query.line`
   * @returns {boolean} `true` если было удалено значение
   */
  isLastPartDeleted (cdInput, cdLine) {
    if (!cdLine) {
      return false
    }

    if (cdLine.column && !cdInput && !cdLine.isCompleted()) {
      return true
    }

    if (!cdInput) {
      return false
    }

    if (cdLine.index - cdInput.index === 1 && cdInput.isCompleted() && !cdLine.isCompleted()) {
      // если разница в индексах условий равна 1, при этом cdInput полное условие, а cdLine было неполным (состояло только из column)
      return true
    }
  }

  /**
   * In the next state, the type of filtering for the selected field is determined.
   * @returns {OperationInputState}
   */
  next () {
    return new OperationInputState(this.context)
  }

  /**
   * If there is no conditions in the query.line, then previous state is corresponding to entity selection.
   * Else it is expected that in the previous state the conditions were “glued” using the list of reserved `keywords`.
   * @returns {KeywordInputState | EntitySelectionState}
   */
  prev () {
    if (Parser.isEmptyCds(this.context.query.line)) {
      return new EntitySelectionState(this.context)
    } else {
      return new KeywordInputState(this.context)
    }
  }
}

export default ColumnSelectionState
