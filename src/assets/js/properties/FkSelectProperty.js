import Vue from 'vue'
import Property from '../properties/Property'
import serverApi from '../../../api'
import DisplayTemplate from '../DisplayTemplate'
import api from '../../../api'

class FkSelectProperty extends Property {
  async init (item) {
    const totalCount = await this.getTotalCount(item)
    return totalCount > 100
      ? this.setDynamicItems(item)
      : this.setStaticItems(item)
  }

  /**
   * Getting select items based on meta data.
   * It is assumed that the number of elements is less than 100,
   * all elements are loaded when the property is declared.
   * Filtering of elements is implemented on the ui; no additional loading is provided
   * @param meta - object, that contain query to load select items: { query: 'entity: id = 4' }
   * @param displayTemplate - a string, is a template for displaying an object
   * @param targetEntity
   * @returns {Promise<{const: *, title: *}[]>}
   */
  async setStaticItems ({ meta, displayTemplate, targetEntity }) {
    this.oneOf = []
    const dTemplate = new DisplayTemplate(displayTemplate)
    let response
    try {
      response = await serverApi.fetchData(meta)
      this.oneOf = response.data.entities.map((item) => {
        return {
          const: Object.values(item.identity)[0],
          title: dTemplate.generate(item.data)
        }
      })
      const identityKey = Object.keys(response.data.entities[0].identity)[0]
      this.link = `${Vue.prototype.$path}?page=search&query=${targetEntity}: ${identityKey} = `
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Declaration property to render auto-complete field on an ajax response with query
   * Filtering elements is implemented by sending a 'query' request
   * @param targetEntity - entity name
   * @param displayTemplate - a string, is a template for displaying an object
   */
  async setDynamicItems ({ targetEntity, displayTemplate }) {
    /**
     * The presence of the symbol {q} in x-fromUrl is necessary to display the field as autocomplete
     * Without {q}, the vuetify-jsonschema-form library renders a regular select
     */
    this['x-fromUrl'] = `${targetEntity}: {q}`
    this['x-itemsProp'] = 'entities'
    this['x-itemTitle'] = 'title'
    this['x-itemKey'] = 'const'
    this.displayTemplate = displayTemplate
    this.entityName = targetEntity
    await this.setLinkTemplate(targetEntity)
  }

  async setLinkTemplate (targetEntity) {
    let response
    const meta = {
      query: `${targetEntity}: `,
      limit: 1
    }
    try {
      response = await serverApi.fetchData(meta)
      const identityKey = Object.keys(response.data.entities[0].identity)[0]
      this.link = `${Vue.prototype.$path}?page=search&query=${targetEntity}: ${identityKey} = `
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Checks if the total count of items is more than 100.
   * @param meta - object, that contain query to load select items: { query: 'entity: id = 4' }
   * @param targetEntity
   * @returns {*|boolean}
   */
  getTotalCount ({ meta, targetEntity }) {
    const query = meta ? meta.query : `${targetEntity}: `
    return api.fetchData({
      query: query,
      countTotal: true,
      returnEntries: false
    }).then((response) => {
      return response.data.totalCount
    })
  }
}

export default FkSelectProperty
