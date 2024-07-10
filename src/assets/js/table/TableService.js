import cloneDeep from 'lodash/cloneDeep'
import concat from 'lodash/concat'
import api from '../../../api'
import TableDataProcessor from './TableDataProcessor'
import Line from '../filter/Line'

export default class TableService {
  constructor (context) {
    this.context = context
    this.items = []
    this.dataProcessor = new TableDataProcessor()
  }

  async updateTable (newQuery, resetOptions = true) {
    if (resetOptions) {
      this.context.table.resetPageAndOffset()
    }
    const data = await this.loadData(newQuery)
    if (data) {
      this.context.table.serverItemsLength = data.hasFurtherData ? this.context.table.getApproximateCount() : Number(data.totalCount)
      this.context.table.hasFurtherData = data.hasFurtherData
      this.items = cloneDeep(data.entities)
    }
    this.updateItems(data ? data.entities : [], this.context.query.rootEntity)
    this.updateHeaders(this.context.query.rootEntity)
  }

  loadData (query) {
    return api.fetchData({
      query: query,
      limit: this.context.table.itemsPerPage,
      offset: this.context.table.offset
    })
    .then((response) => {
      this.context.query.validation.status = true
      return response.data
    })
    .catch((error) => {
      this.context.query.validation.status = false
      this.context.query.validation.message = error.message
    })
  }

  updateItems (tableData, entitySchema) {
    if (entitySchema) {
      tableData = this.dataProcessor.transformData(tableData, entitySchema)
    }
    this.context.table.items = tableData
  }

  updateHeaders (entity) {
    this.context.table.headers = entity
      ? this.dynamicHeaders(entity.fields, this.getLinks(entity))
      : this.context.table.defaultHeaders
  }

  dynamicHeaders (fields, links) {
    return [...fields, ...links]
    .map(({ title, name }) => ({
      text: title || name,
      value: name
    })).concat({ value: 'actions' })
  }

  getTotalCount () {
    api.fetchData({
      query: new Line(this.context.query.line).techLine(),
      countTotal: true,
      returnEntries: false
    }).then((response) => {
      this.context.table.hasFurtherData = false
      this.context.table.serverItemsLength = Number(response.data.totalCount)
    })
  }

  /**
   * @vuese
   * Processing table row click: opens object view page or selects root entity
   * @arg table row item
   */
  handleRowClick (item) {
    this.context.state.tableRowClick(item)
  }

  handleOptionsChange () {
    this.context.state.reloadTableOnOptionChange(new Line(this.context.query.line).techLine())
  }

  getLinks ({ medLnk = [], revFk = [], fk = [] }) {
    return concat(medLnk, revFk, fk)
  }
}
