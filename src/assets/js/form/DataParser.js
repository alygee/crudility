import cloneDeep from 'lodash/cloneDeep'
import map from 'lodash/map'
import DateTimeParser from './DateTimeParser'

const fkValuePointer = '$value'

/**
 * The 'DataParser' class provides methods for converting data (content of the form)
 * into the necessary form for displaying in the form,
 * in the creation line, to send to the server.
 */
export default class DataParser {
  constructor () {
    this.schema = {}
    this.dateTimeParser = {}
  }

  setSchema (schema) {
    this.schema = schema
    this.dateTimeParser = new DateTimeParser(schema)
  }

  parseObjectForTemplate (object) {
    const dataForTemplate = cloneDeep(object)
    Object.entries(dataForTemplate).map(([key, val]) => {
      if (this.dateTimeParser.isTimestampFields(key)) {
        dataForTemplate[key] = this.dateTimeParser.parseTimestampForTemplate(val)
      } else if (this.dateTimeParser.isTimerangeFields(key)) {
        dataForTemplate[key] = this.dateTimeParser.parseTimerangeForTemplate(val)
      } else if (this.isFkProperty(key)) {
        dataForTemplate[key] = dataForTemplate[this.getFkValueKey(key)] || dataForTemplate[key]
      }
    })
    return dataForTemplate
  }

  parseObjectForAPI (editedData = {}, initialData = {}) {
    Object.entries(editedData).map(([key, val]) => {
      if (this.dateTimeParser.isTimestampFields(key)) {
        editedData[key] = this.dateTimeParser.parseTimestampForAPI(val, initialData[key])
      } else if (this.dateTimeParser.isTimerangeFields(key)) {
        editedData[key] = this.dateTimeParser.parseTimerangeForAPI(val, initialData[key])
      }
    })
    this.getBooleanProps().map((name) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!editedData.hasOwnProperty(name) && initialData[name] === null) {
        editedData[name] = false
      }
    })
    return editedData
  }

  parseObjectToLine (dataObject) {
    let entityString = ''
    Object.entries(dataObject).map(([name, value]) => {
      if (this.dateTimeParser.isDateField(name)) {
        const data = this.dateTimeParser.isTimerangeFields(name)
          ? this.dateTimeParser.timerangeToString(value)
          : this.dateTimeParser.dateTimeToTimestamp(value.date, value.time)
        entityString += `${name} = ${data}, `
      } else if ((!Array.isArray(value) && value) || (Array.isArray(value) && value.length)) {
        entityString += `${name} = ${value}, `
      }
    })
    return entityString
  }

  parseLineToObject (initialObject, newObject) {
    const newKeys = Object.keys(newObject)
    Object.keys(initialObject).forEach((key) => {
      if (newKeys.includes(key)) {
        if (Array.isArray(initialObject[key])) {
          initialObject[key] = [newObject[key]]
        } else if (this.dateTimeParser.isDateField(key)) {
          let data = {}
          if (this.dateTimeParser.isTimerangeFields(key)) {
            data[key] = this.dateTimeParser.stringToTimerange(newObject[key])
          } else {
            data[key] = newObject[key]
          }
          data = this.parseObjectForTemplate(data)
          initialObject[key] = data[key]
        } else {
          initialObject[key] = newObject[key]
        }
      }
    })
    return initialObject
  }

  getFkValueKey (key) {
    return key + fkValuePointer
  }

  isFkProperty (key) {
    // typeof val === 'object' && val !== null && !Array.isArray(val)
    return map(this.schema.fk, 'name').includes(key)
  }

  getBooleanProps () {
    return this.schema.fields
      .filter(prop => prop.type === 'boolean')
      .map(prop => prop.name)
  }
}
