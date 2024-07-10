import cloneDeep from 'lodash/cloneDeep'
import concat from 'lodash/concat'
import PropertyFactory from '../properties/PropertyFactory'
import FormTemplate from './FormTemplate'

export default class FormController {
  constructor (fullSchema = {}) {
    this.fullSchema = fullSchema
    this.form = null
    this.initialProps = {}
    this.isVisible = false
    this.options = {
      disableAll: true,
      context: { entitySchema: fullSchema }
    }
  }

  get initialProperties () {
    return cloneDeep(this.initialProps)
  }

  async setSchema (entity, properties, metaFields) {
    if (properties.length === 0) {
      return
    }
    this.setMetaToProps(properties, metaFields)
    this.form = new FormTemplate(entity.title || entity.name)
    this.form.required = properties.filter(p => p.required && !p.generated).map(p => p.name)

    const props = {}
    const factory = new PropertyFactory(this.fullSchema)
    await Promise.all(properties.map(async (item) => {
      props[item.name] = await factory.create(item)
    }))
    this.form.properties = props

    this.isVisible = true
    this.initialProps = cloneDeep(this.form.properties)
  }

  filterProperties (input) {
    const newProperties = {}
    Object.entries(this.initialProperties).map(([key, value]) => {
      if (value.title.toUpperCase().includes(input.toUpperCase()) || key.toUpperCase().includes(input.toUpperCase())) {
        newProperties[key] = value
      }
    })
    this.form.properties = newProperties
  }

  getAllProperties ({ fields, medLnk = [], fk = [], revFk = [] }) {
    return concat(fields, medLnk, fk, revFk)
  }

  getMutableProperties ({ fields, fk = [] }) {
    return concat(fields, fk)
  }

  buildMetaQuery (props) {
    const meta = {}
    props.forEach((prop) => {
      meta[prop.name] = {
        query: `${prop.targetEntity}:`
      }
    })
    return meta
  }

  setMetaToProps (properties, metaFields) {
    properties.forEach((prop) => {
      prop.meta = metaFields[prop.name]
    })
  }
}
