import { Parser } from './Parser'

export default class Line {
  constructor (line) {
    this.line = line
  }
  /**
   * Returns techLine
   * @param truncated - trim last condition or not
   * @returns {string}
   */
  techLine (truncated) {
    const cds = Parser.conditions(this.line)
    const root = Parser.root(this.line)
    if (cds.length !== 0) {
      const lastCd = cds[cds.length - 1]
      if (!lastCd.isCompleted() || truncated) {
        cds.pop()
      }
    }
    return this.buildTechLine(root, cds)
  }

  /**
   * Remaining from the query line after deleting the last part
   * @returns {string}
   */
  truncatedQueryLine () {
    const cds = Parser.conditions(this.line)

    if (!cds.length) {
      return ''
    } else {
      const lastCd = cds[cds.length - 1]
      lastCd.deleteLastOption()
      return this.buildQueryLine(Parser.root(this.line), cds)
    }
  }

  /**
   * Builds a new query line from rootEntity and a set of conditions
   * @param {string} root
   * @param {Condition[]}cds
   * @returns {string}
   */
  buildQueryLine (root, cds) {
    let str = root + ': '
    for (let i = 0; i < cds.length; i++) {
      str += cds[i].toLine()
    }
    return str.trim() + ' '
  }

  /**
   * Builds new techLine from rootEntity and conditions,
   * in which values are wrapped in quotation marks if necessary (consist of several words and are not reserved words).
   * @param {string} root
   * @param {Condition[]}cds
   * @returns {string}
   */
  buildTechLine (root, cds) {
    const containMultipleWords = root.split(' ').length > 1
    let str = containMultipleWords ? `"${root}": ` : `${root}: `
    cds.map((cd, i) => {
      str += i === cds.length - 1
        ? cd.toTechLineWithoutKeyword()
        : cd.toTechLine()
    })
    return str.trim() + ' '
  }
}
