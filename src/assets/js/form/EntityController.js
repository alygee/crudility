import omitBy from 'lodash/omitBy'
import cloneDeep from 'lodash/cloneDeep'
import pick from 'lodash/pick'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import DataParser from './DataParser'

const fkSourcePointer = '$meta'

export default class EntityController {
  constructor () {
    this.dataParser = new DataParser()
    this.object = {}
    this.title = ''
    this.entityName = ''
    this.identity = {}
    this.fullObject = {}
    this.initialObject = {}
  }

  init (schema) {
    this.dataParser.setSchema(schema)
    this.entityName = schema.name
    this.title = schema.title || schema.name
  }

  setData (object = {}, identity = {}) {
    this.object = this.dataParser.parseObjectForTemplate(object)
    this.fullObject = cloneDeep(this.object)
    this.identity = identity
    this.initialObject = cloneDeep(this.object)
  }

  resetObject () {
    this.object = cloneDeep(this.initialObject)
  }

  fillFilteredData () {
    Object.assign(this.fullObject, this.object)
    this.object = cloneDeep(this.fullObject)
  }

  getMetaFields () {
    const metaFields = {}
    Object.entries(this.object).map(([key, value]) => {
      if (key.endsWith(fkSourcePointer)) {
        metaFields[key.substring(0, key.lastIndexOf(fkSourcePointer))] = value
      }
    })
    return metaFields
  }

  parseForApi (fields) {
    const data = fields
      ? pick(this.getObjectData(), fields)
      : this.getObjectData()
    return this.dataParser.parseObjectForAPI(data, this.object)
  }

  getObjectData (object = this.object) {
    return omitBy(object, (obj) => {
      if (obj !== null && typeof obj === 'object') {
        return Object.values(obj).every(o => o === null || o === undefined)
      }
      return obj === null || obj === undefined
    })
  }

  getEditedData () {
    const fields = differenceWith(Object.entries(this.object), Object.entries(this.initialObject), (newVal, oldVal) => {
      return isEqual(newVal, oldVal)
    }).map(arr => arr[0])
    return this.parseForApi(fields)
  }
}
