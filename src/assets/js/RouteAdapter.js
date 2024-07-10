class RouteAdapter {
  constructor (route, router) {
    this.$route = route || { query: {} }
    this.$router = router
  }

  getRouteQuery () {
    return this.$route.query
  }

  getQuery () {
    return this.$route.query.query
  }

  getPage () {
    return this.$route.query.page
  }

  getEntity () {
    return this.$route.query.entity
  }

  getIdentity () {
    const query = this.getRouteQuery()
    if (!query) {
      return ''
    }
    return Object.keys(query)
      .filter(key => !['entity', 'page'].includes(key))
      .reduce((obj, key) => {
        obj[key] = query[key]
        return obj
      }, {})
  }

  switchPage (pageName, data) {
    this.$router.push({
      path: this.$route.path,
      query: {
        page: pageName,
        ...data
      }
    })
  }

  revertBack () {
    this.$router.go(1)
  }

  to404 () {
    this.$router.push({ name: '404' })
  }
}

export default RouteAdapter
