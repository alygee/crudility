import Property from '../properties/Property'
import FieldType from '../enum/FieldType'
import TimestampProperty from '../properties/TimestampProperty'

class TimerangeProperty extends Property {
  constructor (item) {
    super(item)
    this.properties = this.getTimestampProps()
  }

  getTimestampProps () {
    const props = {}
    FieldType.timerange.map((timerangeName) => {
      props[timerangeName] = new TimestampProperty({
        name: timerangeName,
        type: FieldType.types.TIMESTAMP
      })
    })
    return props
  }
}

export default TimerangeProperty
