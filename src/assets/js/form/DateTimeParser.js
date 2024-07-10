import FieldType from '../enum/FieldType'

export default class DateTimeParser {
  constructor (schema) {
    this.schema = schema
  }

  isDateField (fieldName) {
    return this.isTimerangeFields(fieldName) || this.isTimestampFields(fieldName)
  }

  isTimerangeFields (fieldName) {
    return this.schema.fields
      .filter(field => FieldType.isTimerange(field.type))
      .map(field => field.name)
      .includes(fieldName)
  }

  isTimestampFields (fieldName) {
    return this.schema.fields
      .filter(field => FieldType.isTimestamp(field.type))
      .map(field => field.name)
      .includes(fieldName)
  }

  parseTimestampForAPI (newValue, lastValue) {
    const date = newValue.date || lastValue.date
    const time = newValue.time || lastValue.time
    return this.dateTimeToTimestamp(date, time)
  }

  dateTimeToTimestamp (date, time) {
    date = date || ''
    time = time || ''
    if (!date) {
      return ''
    }
    const dateTime = new Date(Date.parse(`${date} ${time}`))
    if (time) {
      const offset = dateTime.getTimezoneOffset() * 60 * 1000 // offset in milliseconds
      dateTime.setTime(dateTime.getTime() - offset)
    }
    return dateTime.toISOString()
  }

  parseTimestampForTemplate (dateISO) {
    return {
      date: this.dateStringFromISO(dateISO),
      time: this.timeStringFormISO(dateISO)
    }
  }

  dateStringFromISO (timestamp) {
    return timestamp ? timestamp.slice(0, 10) : ''
  }

  timeStringFormISO (timestamp) {
    return timestamp ? timestamp.slice(11, 19) : ''
  }

  parseTimerangeForAPI (newValue, lastValue) {
    const date = {}
    Object.entries(lastValue).map(([nestedKey, nestedVal]) => {
      const currentDate = newValue[nestedKey] || nestedVal
      date[nestedKey] = this.parseTimestampForAPI(currentDate, lastValue[nestedKey])
    })
    return date
  }

  parseTimerangeForTemplate (timeRange) {
    Object.entries(timeRange).map(([nestedKey, nestedVal]) => {
      timeRange[nestedKey] = {
        date: this.dateStringFromISO(nestedVal),
        time: this.timeStringFormISO(nestedVal)
      }
    })
    return timeRange
  }

  stringToTimerange (timerangeString) {
    return {
      startDate: timerangeString.split(',')[0],
      finishDate: timerangeString.split(',')[1]
    }
  }

  timerangeToString (timerange) {
    let timerangeString = ''
    Object.values(timerange).map(({ date, time }) => {
      if (date === null && time === null) {
        return
      }
      timerangeString = timerangeString
        ? `${timerangeString},${this.dateTimeToTimestamp(date, time)}`
        : this.dateTimeToTimestamp(date, time)
    })
    return timerangeString
  }
}
