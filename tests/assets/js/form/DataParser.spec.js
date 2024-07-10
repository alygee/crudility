import DataParser from 'assets/js/form/DataParser'
import mockSchema from 'assets/mock/schema'
import mockEntity from 'assets/mock/entity_data'
import mockForm from 'assets/mock/form_data'

const entitySchema = mockSchema.schema.entities[4]

describe('DataParser', () => {
  test('sanity', () => {
    const parser = new DataParser()
    expect(parser).toBeDefined()
    expect(parser.dateController).toBeDefined()
  })

  test('setSchema', () => {
    const parser = new DataParser()
    parser.setSchema(entitySchema)
    expect(parser.dateController.schema).toBe(entitySchema)
  })

  describe('parseObjectForTemplate', () => {
    test('parse simple values', () => {
      const parser = new DataParser()
      parser.setSchema(entitySchema)
      const dataForTemplate = parser.parseObjectForTemplate(mockEntity.data)
      expect(dataForTemplate.amount).toBe(99)
      expect(dataForTemplate.id).toBe(12429667368697866)
      expect(dataForTemplate.idempotency_key).toBe('nBKMkPoJGy')
    })

    test('parse timestamp', () => {
      const parser = new DataParser()
      parser.setSchema(entitySchema)
      const dataForTemplate = parser.parseObjectForTemplate(mockEntity.data)
      const expectedDate = {
        date: '2019-10-02',
        time: '12:12:10'
      }
      expect(dataForTemplate.created).toStrictEqual(expectedDate)
    })

    test('parse fr nested objects', () => {
      const parser = new DataParser()
      parser.setSchema(entitySchema)
      const dataForTemplate = parser.parseObjectForTemplate(mockEntity.data)
      expect(dataForTemplate.currency_id).toBe('RUB')
      expect(dataForTemplate.wallet_from_id).toBe(15)
      expect(dataForTemplate.currency_id).toBe('RUB')
    })
  })

  test('parseObjectForAPI', () => {
    const parser = new DataParser()
    parser.setSchema(entitySchema)
    const dataForApi = parser.parseObjectForAPI(mockForm)
    expect(dataForApi.created).toBe('2019-10-02T12:12:10.000Z')
  })

  describe('parseObjectToLine', () => {
    test('empty object', () => {
      const parser = new DataParser()
      parser.setSchema(entitySchema)
      expect(parser.parseObjectToLine({})).toBe('')
    })

    test('object with empty property', () => {
      const parser = new DataParser()
      parser.setSchema(entitySchema)
      const data = {
        amount: 99,
        currency_id: 'RUB',
        test_empty: ''
      }
      expect(parser.parseObjectToLine(data)).toBe('amount = 99, currency_id = RUB, ')
    })

    test('object with timerange field', () => {
      const parser = new DataParser()
      parser.setSchema(entitySchema)
      const data = {
        created: {
          date: '2019-10-02',
          time: '12:12:10'
        }
      }
      expect(parser.parseObjectToLine(data)).toBe('created = 2019-10-02T12:12:10.000Z, ')
    })
  })

  describe('parseLineToObject', () => {
    test('empty line', () => {

    })
  })

  test('getFkValueKey', () => {
    const parser = new DataParser()
    expect(parser.getFkValueKey('currency_id')).toBe('currency_id$value')
  })

  test('isFkProperty', () => {
    const parser = new DataParser()
    parser.setSchema(entitySchema)
    expect(parser.isFkProperty('currency_id')).toBeTruthy()
    expect(parser.isFkProperty('id')).toBeFalsy()
  })
})
