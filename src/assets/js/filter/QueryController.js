import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'

import EntitySelectionState from '../states/EntitySelectionState'
import ColumnSelectionState from '../states/ColumnSelectionState'
import OperationInputState from '../states/OperationInputState'
import KeywordInputState from '../states/KeywordInputState'
import { Parser } from './Parser'
import Line from './Line'

export default class QueryController {
  /**
   * context - ссылка на ComplexFilter vue-компонент, для доступа к состояниям
   * downgraded
   * validation
   * line
   * links
   * rootEntity
   */
  constructor (context) {
    this.context = context
    this.reset()
  }

  reset () {
    this.downgraded = false
    this.validation = {
      status: true,
      message: ''
    }
    this.links = null
    this.line = ''
    this.input = ''
    this.rootEntity = null
  }

  /**
   * Вызывается в состоянии выбора корневой сущности.
   * @param {string} entity слово или комбинация слов
   */
  setRootEntityAndLinks (entity) {
    this.rootEntity = entity
    this.links = concat(entity.medLnk, entity.revFk, entity.fk)
  }

  /**
   * Adding a new item to the query string
   * Timeout was added because the deletion does not have time to apply to the line.
   * An error occurred if the same value was deleted and added.
   * @param {string} option word or combination of words
   * @param {string} annex colon with space, period, or space
   */
  addPart (option, annex) {
    return new Promise(resolve => setTimeout(resolve, 10))
      .then(() => {
        this.line += option + annex
      })
  }

  haveBrackets (option) {
    return /^\([^()]*\)$/.test(option)
  }

  haveQuotes (option) {
    return /^['"][^'"]*['"]$/.test(option)
  }

  /**
   * Удаляем какую-то часть и опускаем флаг downgraded
   */
  deletePart (trail = '') {
    this.line = new Line(this.line).truncatedQueryLine() + trail
    this.downgraded = false
  }

  isNeedsToDowngrade (input) {
    return !this.downgraded && input === this.line.trimRight() && this.getChanges(input)
  }

  getChanges (input) {
    if (this.downgraded) {
      return this.getStringDiff(input, new Line(this.line).truncatedQueryLine())
    } else {
      return this.getStringDiff(input, this.line)
    }
  }

  /**
   * Ищет поле таблицы в ссылках rootEntity
   * @param option
   * @returns {*}
   */
  findLinkByOption (option) {
    return this.links.find((link) => {
      return link.title
        ? [link.name.toUpperCase(), link.title.toUpperCase()].includes(option.toUpperCase())
        : link.name.toUpperCase() === option.toUpperCase()
    })
  }

  getStringDiff (longStr, shortStr) {
    return longStr.split(shortStr).join('')
  }

  /**
   * Determining the current state of the filter depending on the length of the query
   * @returns {FilterState|Error} one of the filter states
   */
  getState () {
    if (!this.line || (this.line && !this.rootEntity)) {
      return new EntitySelectionState(this.context)
    }

    if (this.rootEntity && !Parser.trail(this.line)) {
      return new ColumnSelectionState(this.context)
    }

    const cd = Parser.cdLast(this.line)

    if (cd.column && !cd.operation && !cd.value && !cd.keyword) {
      return new OperationInputState(this.context)
    }

    if (cd.column && cd.operation && !cd.value && !cd.keyword) {
      return new OperationInputState(this.context, cd.conditionWithoutValue).next()
    }

    if (cd.column && cd.operation && cd.value && !cd.keyword) {
      return new KeywordInputState(this.context)
    }

    if (cd.column && cd.operation && (cd.value || (!cd.value && cd.conditionWithoutValue)) && cd.keyword) {
      return new ColumnSelectionState(this.context)
    }

    throw new Error('Failed to determine state by query line')
  }

  /**
   * Устанавливает line, rootEntity и меняет state контекста
   * @param {string} str
   */
  setState (str) {
    this.line = str.trim() + ' '
    const rootEntity = this.context.$findValue(Parser.root(this.line), this.context.schema.entities)
    if (!isEmpty(rootEntity)) {
      this.setRootEntityAndLinks(rootEntity)
    }
    this.context.state = this.getState()
  }

  hasManyChanges (input) {
    const inputCds = Parser.conditions(input)
    const lineCds = Parser.conditions(this.line)
    const inputLength = inputCds.length
    const lineLength = lineCds.length
    return lineLength - inputLength > 0 ||
      (lineLength === inputLength && inputLength && lineCds[lineLength - 1].diff(inputCds[inputLength - 1]) > 1) ||
      (inputLength - lineLength > 0 && inputCds[inputLength - 1].isCompleted())
  }
}
