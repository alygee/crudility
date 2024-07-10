import OptionsController from 'assets/js/filter/OptionsController'
import Keyword from 'assets/js/enum/Keyword'
import Operation from 'assets/js/enum/Operation'

const items = ['test', 'test item', 'another item', 'tes', 'te', 'items', 'item']

describe('OptionsController', () => {
  test('sanity', () => {
    const dOptions = new OptionsController()
    expect(dOptions.initialItems).toStrictEqual([])
    expect(dOptions.items).toStrictEqual([])
    expect(dOptions.isVisible).toBe(false)
  })

  test('update', () => {
    const dOptions = new OptionsController()
    dOptions.update(items)
    expect(dOptions.initialItems).toBe(items)
    expect(dOptions.items).toBe(items)
    expect(dOptions.isVisible).toBe(false)
  })

  test('isVisible', () => {
    const dOptions = new OptionsController()
    expect(dOptions.isVisible).toBe(false)
    dOptions.isVisible = true
    expect(dOptions.isVisible).toBe(false)
    dOptions.update(items)
    expect(dOptions.isVisible).toBe(true)
  })

  test('filter - 1', () => {
    const dOptions = new OptionsController()
    dOptions.update(items)
    dOptions.filter('It')
    expect(dOptions.items).toStrictEqual(['test item', 'another item', 'items', 'item'])
  })

  test('filter - 2', () => {
    const dOptions = new OptionsController()
    dOptions.update(items)
    dOptions.filter('Any')
    expect(dOptions.items).toStrictEqual([])
  })

  describe('findMatch', () => {
    test('findMatch 1', () => {
      const dOptions = new OptionsController()
      dOptions.update(items)
      expect(dOptions.findMatch('test', true)).toBeTruthy()
    })

    test('findMatch 2', () => {
      const dOptions = new OptionsController()
      dOptions.update(items)
      expect(dOptions.findMatch('test', false)).toBeFalsy()
    })

    test('findMatch 3', () => {
      const dOptions = new OptionsController()
      dOptions.update(items)
      expect(dOptions.findMatch('item', false)).toBeFalsy()
    })

    test('findMatch 4', () => {
      const dOptions = new OptionsController()
      dOptions.update(items)
      expect(dOptions.findMatch('test ite', true)).toBeFalsy()
    })

    test('findMatch 5', () => {
      const dOptions = new OptionsController()
      dOptions.update(items)
      expect(dOptions.findMatch('test item', false)).toBeTruthy()
    })

    test('findMatch 6', () => {
      const dOptions = new OptionsController()
      dOptions.update(Keyword.getList())
      expect(dOptions.findMatch('an')).toBeFalsy()
    })

    test('findMatch 7', () => {
      const dOptions = new OptionsController()
      dOptions.update(Keyword.getList())
      expect(dOptions.findMatch('and')).toBeTruthy()
    })

    test('findMatch 8', () => {
      const dOptions = new OptionsController()
      dOptions.update(Operation.getList())
      expect(dOptions.findMatch('>=', false)).toBeTruthy()
    })

    test('findMatch 9', () => {
      const dOptions = new OptionsController()
      dOptions.update(Operation.getList())
      expect(dOptions.findMatch('=', false)).toBeTruthy()
    })

    test('findMatch 10', () => {
      const dOptions = new OptionsController()
      dOptions.update(Operation.getList())
      expect(dOptions.findMatch('=', true)).toBeTruthy()
    })
  })
})
