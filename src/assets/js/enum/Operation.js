import values from 'lodash/values'

const types = Object.freeze({
  EQUALS: '=',
  'NOT EQUALS': '!=',
  'GREATER THAN': '>',
  'GREATER THAN EQUALS': '>=',
  'LESS THAN': '<',
  'LESS THAN EQUALS': '<=',
  IN: 'in',
  'NOT IN': 'not in',
  CONTAINS: '~',
  'IS EMPTY': 'is empty',
  'IS NOT EMPTY': 'is not empty'
})

export default {
  getList () {
    return values(types)
  },

  operationsWithoutValueInCondition () {
    return [types['IS EMPTY'], types['IS NOT EMPTY']]
  }
}
