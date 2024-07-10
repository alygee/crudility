import PageController from 'assets/js/PageController'

describe('PageController', () => {
  test('should set page when initializing', () => {
    const pageController = new PageController('update')
    expect(pageController.page).toBe('update')
  })

  test('default page should be "search"', () => {
    const pageController = new PageController()
    expect(pageController.page).toBe('search')
  })
})
