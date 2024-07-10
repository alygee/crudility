import RouteAdapter from 'assets/js/RouteAdapter'

describe('RouteAdapter', () => {
  test('should set $route', () => {
    const route = 'super route'
    const routeAdapter = new RouteAdapter(route)
    expect(routeAdapter.$route).toBe(route)
  })

  test('getQuery method', () => {
    const route = { query: { query: 'query' } }
    const routeAdapter = new RouteAdapter(route)
    expect(routeAdapter.getQuery()).toEqual(routeAdapter.$route.query.query)
  })

  test('getQuery method', () => {
    const route = { query: { query: 'query' } }
    const routeAdapter = new RouteAdapter(route)
    expect(routeAdapter.getRouteQuery()).toEqual(routeAdapter.$route.query)
  })

  test('should have default query param', () => {
    const routeAdapter = new RouteAdapter()
    expect(routeAdapter.$route.query).toEqual({})
  })

  test('default page should be undefined', () => {
    const route = { query: {} }
    const routeAdapter = new RouteAdapter(route)
    expect(routeAdapter.getPage()).toBeUndefined()
  })

  test('create page should be "create"', () => {
    const route = { query: { page: 'create' } }
    const routeAdapter = new RouteAdapter(route)
    expect(routeAdapter.getPage()).toBe('create')
  })

  test('unregistered page should be set too', () => {
    const route = { query: { page: 'undefined' } }
    const routeAdapter = new RouteAdapter(route)
    expect(routeAdapter.getPage()).toBe('undefined')
  })

  test('switchPage call $router.push', () => {
    const route = { path: '/', query: { page: 'search' } }
    const router = { push: jest.fn() }
    const routeAdapter = new RouteAdapter(route, router)

    routeAdapter.switchPage('create', { entity: 'currency' })
    expect(routeAdapter.$router.push).toHaveBeenCalledWith({ path: '/', query: { page: 'create', entity: 'currency' } })
  })

  test('to404 method', () => {
    const router = { push: jest.fn() }
    const routeAdapter = new RouteAdapter({}, router)
    routeAdapter.to404()
    expect(routeAdapter.$router.push).toHaveBeenCalledWith({ name: '404' })
  })
})
