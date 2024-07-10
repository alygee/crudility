export default class TableModel {
  constructor () {
    this.offset = 0
    this.itemsPerPage = 10
    this.page = 1
    this.serverItemsLength = -1
    this.hasFurtherData = false
    this.headers = []
    this.items = []
    this.dTemplate = null
    this.defaultHeaders = [
      {
        text: 'name',
        value: 'name'
      }, {
        text: 'title',
        value: 'title'
      }, {
        text: 'description',
        value: 'description'
      }
    ]
  }

  isEmpty () {
    return this.headers.length === 0
  }

  resetPageAndOffset () {
    this.offset = 0
    this.page = 1
  }

  getApproximateCount () {
    return this.offset + this.itemsPerPage + 1
  }
}
