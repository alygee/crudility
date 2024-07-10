export default class FormTemplate {
  constructor (description) {
    this.description = description
    this.type = 'object'
    this.required = []
    this.properties = {}
  }
}
