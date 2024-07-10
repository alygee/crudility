import DisplayTemplate from '../DisplayTemplate'
import concat from 'lodash/concat'

const META = '$meta'

export default class TableDataProcessor {
  /**
   * The method converts nested table objects to a suitable view.
   * Different types of fields are defined in the scheme:
   *    fields - primitive values
   *    fk, revFk, medLnk - object or array of objects
   * For each link is searching value in every item of the table.
   * If the value is found, the object or an array of objects is converted
   * to a string based on a displayTemplate or to markup with a link.
   * @param tableData Array of table elements
   * @param entitySchema
   * @returns {Array} transformedData
   */
  transformData (tableData, entitySchema) {
    const props = this.getProps(entitySchema)

    if (props.length !== 0) {
      tableData.forEach((item) => { item.meta = {} })
      props.forEach(({ name: key, displayTemplate }) => {
        this.dTemplate = new DisplayTemplate(displayTemplate)
        tableData.forEach((item) => {
          if (item.data[key]) {
            this.transformItem(item, key)
          }
        })
      })
    }
    return tableData
  }

  transformItem (item, key) {
    item.data[key] = this.getDisplayValue(item.data, key)
    const metaQuery = this.getMetaQuery(item.data, key)
    if (metaQuery) {
      item.meta[key] = metaQuery
    }
  }

  getDisplayValue (entity, key) {
    const nestedData = entity[key]
    const isArray = Array.isArray(nestedData)

    return isArray
      ? this.processArrayItems(nestedData)
      : this.processSingleItem(nestedData)
  }

  processArrayItems (nestedArray) {
    const entityLines = nestedArray.map(item => this.dTemplate.generate(item))
    return entityLines.reduce((result, line) => {
      return result + line + '<br />'
    }, '')
  }

  processSingleItem (nestedEntity) {
    return this.dTemplate.generate(nestedEntity)
  }

  getMetaQuery (item, linkName) {
    const metaKey = linkName + META
    const metaData = item[metaKey]
    return metaData && metaData.hasMore && metaData.query
  }

  getProps ({ medLnk = [], revFk = [], fk = [], fields = [] }) {
    return concat( medLnk, revFk, fk,
      fields.filter(field => field.type === 'text')
    )
  }
}