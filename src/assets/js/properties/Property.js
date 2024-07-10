import FieldType from '../enum/FieldType'

class Property {
  constructor (item) {
    this.title = item.title || item.name
    this.type = FieldType.getTemplateType(item.type) || FieldType.defaultType
    this.format = FieldType.getTemplateFormat(item.type)
    this.description = item.description
    this.disabled = item.generated
    /**
     * The maxLength property sets the display of the field as textarea
     * Since the server does not provide character limits for the number of characters,
     * the value of maxLength is set to a knowingly large number - 1000000.
     */
    this.maxLength = FieldType.isTextarea(item.type) ? 1000000 : undefined
  }
}

export default Property
