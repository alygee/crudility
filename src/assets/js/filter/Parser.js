import Operation from '../enum/Operation'
import { Condition } from './Condition'

/**
 * Helper для работы со строкой.
 */
export class Parser {
  /**
   * Разбивает строку на две части: rootEntity и всё остальное
   * @param {string} str
   * @returns {{trail: '', root: ''}}
   */
  static parse (str) {
    const result = str.match(/(([^:]*):(.*))/)
    return {
      root: result ? result[2] : '',
      trail: result ? result[3].trim() : ''
    }
  }

  /**
   * Возвращает часть строки без rootEntity
   * @param {string} str
   * @returns {string}
   */
  static root (str) {
    const { root } = Parser.parse(str)
    return root
  }

  /**
   * Возвращает rootEntity строки
   * @param str
   * @returns {string}
   */
  static trail (str) {
    const { trail } = Parser.parse(str)
    return trail
  }

  /**
   * Разбивает строку (без rootEntity) на логические части и формирует из них массив Condition
   * @param {string} str
   * @returns {Condition[]}
   */
  static conditions (str) {
    const result = []
    const cdsAndKeywords = Parser.splitTrailByKeywords(str)

    for (let i = 0; i < cdsAndKeywords.length; i = i + 2) {
      if (!cdsAndKeywords[i]) {
        continue
      }
      const condition = Parser.cdSplit(cdsAndKeywords[i], cdsAndKeywords[i + 1], result.length)
      result.push(condition)
    }

    return result
  }

  /**
   * Получает строку без rootEntity и разбивает её на логические части
   * @param {string} str
   * @returns {string[]}
   */
  static splitTrailByKeywords (str) {
    const { trail } = Parser.parse(str)
    return trail.split(/(\bAND\b|\bOR\b)/i)
  }

  /**
   * Converts a string to a Condition object
   * @param {string} str
   * @param keyword
   * @param index
   * @returns {Condition}
   */
  static cdSplit (str, keyword, index) {
    const cd = str.trim().split(/(!=|=|>=|>|<=|<|~|\bis empty\b|\bis not empty\b|\bin\b|\bnot in\b)/)
    return Operation.operationsWithoutValueInCondition().includes(cd[1])
      ? new Condition(cd[0], cd[1], cd[2], keyword, index, true)
      : new Condition(cd[0], cd[1], cd[2], keyword, index, false)
  }

  /**
   * Получение последнего условия в строке
   * @param {string} str
   * @returns {Condition}
   */
  static cdLast (str) {
    const cds = Parser.conditions(str)
    return cds[cds.length - 1]
  }

  static isEmptyCds (line) {
    return Parser.conditions(line).length === 0
  }
}
