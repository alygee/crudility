import Vue from 'vue'
import concat from 'lodash/concat'
import Property from '../properties/Property'

class RevFkTableProperty extends Property {
  constructor (item) {
    super(item)
    this.search = false
    this.hideHeaders = false
    this.hideActions = true
    this.columns = []
    this.link = null
  }

  init (item, entities) {
    if (item.meta) {
      this.link = `${Vue.prototype.$path}?page=search&query=${item.meta.query}`
    }
    const nestedEntityData = Vue.prototype.$findValue(item.targetEntity, entities)
    this.columns = this.getAllProps(nestedEntityData).map((el) => {
      return {
        text: el.title || el.name,
        value: el.name
      }
    })
  }

  getAllProps ({ fields, fk, revFk, medLnk }) {
    return concat(fields, fk, revFk, medLnk)
  }
}

export default RevFkTableProperty
