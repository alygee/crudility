import values from 'lodash/values'

const types = Object.freeze({
  AND: 'and',
  OR: 'or'
})

export default {
  getList () {
    return values(types)
  }
}
