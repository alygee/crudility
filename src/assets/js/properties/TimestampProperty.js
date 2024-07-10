import Property from '../properties/Property'
import FieldType from '../enum/FieldType'

class TimestampProperty extends Property {
  constructor (item) {
    super(item)
    this.properties = this.getDateAndTimeProps(item)
    this.required = item.required ? Object.keys(this.properties) : []
  }

  getDateAndTimeProps (item) {
    const props = {}
    FieldType.getTemplateFormat(item.type).map((formatValue) => {
      props[formatValue] = {
        format: formatValue,
        type: FieldType.defaultType,
        'x-class': 'sm3'
      }
    })
    return props
  }
}

export default TimestampProperty
