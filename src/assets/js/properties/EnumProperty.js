import Property from '../properties/Property'

class EnumProperty extends Property {
  constructor (item, enumData) {
    super(item)
    this.enum = enumData.value.map(e => e.name)
  }
}

export default EnumProperty
