import schema from 'assets/mock/schema'
import entityData from 'assets/mock/entity_data'
import TableController from 'assets/js/filter/TableController'

const defaultHeaders = [
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

describe('TableController', () => {
  test('sanity', () => {
    const tableController = new TableController()
    expect(tableController.offset).toBe(0)
    expect(tableController.itemsPerPage).toBe(10)
    expect(tableController.page).toBe(1)
    expect(tableController.serverItemsLength).toBe(-1)
    expect(tableController.hasFurtherData).toBe(false)
    expect(tableController.headers).toStrictEqual([])
    expect(tableController.items).toStrictEqual([])
    expect(tableController.dTemplate).toBe(null)
    expect(tableController.isEmpty()).toBe(true)
  })

  describe('headers', () => {
    test('default headers', () => {
      const tableController = new TableController()
      expect(tableController.defaultHeaders).toStrictEqual(defaultHeaders)
    })

    test('dynamic headers', () => {
      const tableController = new TableController()
      const entity = schema.schema.entities[0]
      expect(tableController.dynamicHeaders(entity.fields, tableController.getLinks(entity))).toStrictEqual([
        {
          text: 'code_alpha',
          value: 'code_alpha'
        }, {
          text: 'code_numeric',
          value: 'code_numeric'
        }, {
          text: 'Кошелёк',
          value: 'wallets'
        }
      ])
    })

    test('updateHeaders - with entity', () => {
      const tableController = new TableController()
      const entity = schema.schema.entities[0]
      tableController.updateHeaders(entity)
      expect(tableController.headers).toStrictEqual([
        {
          text: 'code_alpha',
          value: 'code_alpha'
        }, {
          text: 'code_numeric',
          value: 'code_numeric'
        }, {
          text: 'Кошелёк',
          value: 'wallets'
        }
      ])
    })

    test('updateHeaders - without entity', () => {
      const tableController = new TableController()
      tableController.dynamicHeaders = jest.fn()
      tableController.updateHeaders()
      expect(tableController.dynamicHeaders.mock.calls.length).toBe(0)
      expect(tableController.headers).toStrictEqual(defaultHeaders)
    })
  })

  test('updateTable', () => {
    const tableController = new TableController()
    tableController.updateHeaders = jest.fn()
    tableController.updateItems = jest.fn()
    tableController.updateTable([], {})
    expect(tableController.updateItems.mock.calls.length).toBe(1)
    expect(tableController.updateHeaders.mock.calls.length).toBe(1)
  })

  test('getApproximateCount', () => {
    const tableController = new TableController()
    tableController.offset = 10
    tableController.itemsPerPage = 5
    expect(tableController.getApproximateCount()).toBe(16)
  })

  test('getApproximateCount', () => {
    const tableController = new TableController()
    tableController.offset = 10
    tableController.page = 3
    tableController.resetPageAndOffset()
    expect(tableController.offset).toBe(0)
    expect(tableController.page).toBe(1)
  })

  test('getTextAreaFields', () => {
    const entity = schema.schema.entities[1]
    const fields = [
      { name: 'slug', title: null, type: 'text' },
      { name: 'description', title: null, type: 'text' },
      { name: 'contract', title: null, type: 'text' }
    ]
    const tableController = new TableController()
    expect(tableController.getTextAreaFields(entity)).toStrictEqual(fields)
  })

  test('getLinks', () => {
    const tableController = new TableController()
    const entity = schema.schema.entities[2]
    expect(tableController.getLinks(entity)).toStrictEqual([
      ...entity.medLnk,
      ...entity.revFk,
      ...entity.fk
    ])
  })

  describe('getMetaQuery', () => {
    test('getMetaQuery if hasMore false', () => {
      const tableController = new TableController()
      expect(tableController.getMetaQuery(entityData.data, 'currency_id')).toBe(undefined)
    })

    test('getMetaQuery if hasMore true', () => {
      const tableController = new TableController()
      const item = {
        testProp: {},
        testProp$meta: {
          hasMore: true,
          query: 'Test: '
        }
      }
      expect(tableController.getMetaQuery(item, 'testProp')).toBe('Test: ')
    })
  })
})
