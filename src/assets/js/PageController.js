const pages = Object.freeze({
  SEARCH: 'search',
  CREATE: 'create',
  EDIT: 'edit',
  NOT_FOUND: '404'
})

export default class PageController {
  constructor (page) {
    this.setPage(page)
  }

  setPage (page) {
    this.page = page || pages.SEARCH
  }

  isSearch () {
    return pages.SEARCH === this.page
  }

  isForm () {
    return this.isCreate() || this.isEdit()
  }

  isCreate () {
    return pages.CREATE === this.page
  }

  isEdit () {
    return pages.EDIT === this.page
  }

  isNotFound () {
    return pages.NOT_FOUND === this.page
  }

  isNotExist () {
    return !Object.values(pages).includes(this.page) || this.isNotFound()
  }
}
