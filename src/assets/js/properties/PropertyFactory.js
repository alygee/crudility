import FieldType from '../enum/FieldType'
import TimestampProperty from '../properties/TimestampProperty'
import TimerangeProperty from '../properties/TimerangeProperty'
import EnumProperty from '../properties/EnumProperty'
import Property from '../properties/Property'
import FkSelectProperty from './FkSelectProperty'
import RevFkTableProperty from './RevFkTableProperty'

export default class PropertyFactory {
  constructor (schema) {
    this.schema = schema
  }

  async create (item) {
    let prop = new Property(item)
    if (FieldType.isToMany(item.type)) {
      prop = new RevFkTableProperty(item)
      prop.init(item, this.schema.entities)
    }
    if (FieldType.isToOne(item.type)) {
      prop = new FkSelectProperty(item)
      await prop.init(item)
    }
    if (FieldType.isTimestamp(item.type)) {
      prop = new TimestampProperty(item)
    }
    if (FieldType.isTimerange(item.type)) {
      prop = new TimerangeProperty(item)
    }
    const enumData = this.findEnumValue(item)
    if (enumData) {
      prop = new EnumProperty(item, enumData)
    }
    return prop
  }

  findEnumValue (item) {
    return this.schema.enums.find((en) => {
      return en.name === item.type
    })
  }
}
