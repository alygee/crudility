const typeConverter = {
  boolean: 'boolean',
  int: 'number',
  long: 'long',
  string: 'string',
  text: 'string',
  double: 'number',
  binary: 'string',
  // date: 'string',
  timestamp: 'object',
  ToMany: 'table',
  ToOne: 'string',
  timerange: 'object',
  script: 'script'
}

const specialTypes = {
  TIMESTAMP: 'timestamp',
  TO_MANY: 'ToMany',
  TO_ONE: 'ToOne',
  TIMERANGE: 'timerange',
  TEXTAREA: 'text'
}

const formatFromType = {
  date: 'date',
  timestamp: ['date', 'time']
}

const timeRangeNames = ['startDate', 'finishDate']

export default {
  defaultType: typeConverter.string,
  timerange: timeRangeNames,
  types: specialTypes,
  getTemplateType (type) {
    return typeConverter[type]
  },

  getTemplateFormat (type) {
    return formatFromType[type]
  },

  isTimestamp (type) {
    return specialTypes.TIMESTAMP === type
  },

  isTimerange (type) {
    return specialTypes.TIMERANGE === type
  },

  isToMany (type) {
    return specialTypes.TO_MANY === type
  },

  isToOne (type) {
    return specialTypes.TO_ONE === type
  },

  isTextarea (type) {
    return specialTypes.TEXTAREA === type
  }
}
