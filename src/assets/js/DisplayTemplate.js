import pickBy from 'lodash/pickBy'
import isObject from 'lodash/isObject'

const MATCH_EXP = /\${(.*?)}/g
const REPLACE_EXP = /(\${.*?})/
const LINE_LENGTH = 50

export default class DisplayTemplate {
  constructor (template) {
    this.init(template || '')
  }

  init (template) {
    this.template = template
    this.fields = this.parseTemplate(template)
  }

  parseTemplate (template) {
    const matches = []
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const match = MATCH_EXP.exec(template)
      if (match === null) {
        break
      }
      matches.push(match[1])
    }
    return matches
  }

  generate (data) {
    if (this.template) {
      return this.fillTemplate(data)
    } else {
      const line = typeof data === 'string' ? data : this.convertToString(data)
      return this.truncateLine(line)
    }
  }

  fillTemplate (data) {
    let filledLine = this.template
    this.fields.map((fieldName) => {
      filledLine = filledLine.replace(REPLACE_EXP, data[fieldName])
    })
    return filledLine
  }

  convertToString (data) {
    return JSON.stringify(pickBy(data, value => !isObject(value)))
  }

  truncateLine (line) {
    return (line.length > LINE_LENGTH)
      ? line.substr(0, LINE_LENGTH - 1) + '...'
      : line
  }
}
