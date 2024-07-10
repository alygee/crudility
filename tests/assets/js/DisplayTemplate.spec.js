import DisplayTemplate from 'assets/js/DisplayTemplate'
import mockForm from 'assets/mock/form_data'

describe('DisplayTemplate', () => {
  test('sanity', () => {
    const dTemplate = new DisplayTemplate()
    expect(dTemplate).toBeDefined()
    expect(dTemplate.template).toBe('')
    expect(dTemplate.fields).toStrictEqual([])
  })

  test('init - without template', () => {
    const dTemplate = new DisplayTemplate(null)
    expect(dTemplate.template).toBe('')
    expect(dTemplate.fields).toStrictEqual([])
  })

  test('init - with template', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const template = 'id: ${id}, amount: ${amount}, type: ${type}'
    const dTemplate = new DisplayTemplate(template)
    expect(dTemplate.template).toBe(template)
    expect(dTemplate.fields).toStrictEqual(['id', 'amount', 'type'])
  })

  test('parseTemplate', () => {
    const dTemplate = new DisplayTemplate()
    // eslint-disable-next-line no-template-curly-in-string
    const template = 'id: ${id}, amount: ${amount}, type: ${type}, test: ${test}'
    const expectedFields = ['id', 'amount', 'type', 'test']
    expect(dTemplate.parseTemplate(template)).toStrictEqual(expectedFields)
  })

  test('generate - without template', () => {
    const expectedResult = '{"amount":99,"currency_id":"RUB","id":12429667368...'
    const dTemplate = new DisplayTemplate(null)
    expect(dTemplate.generate(mockForm)).toBe(expectedResult)
  })

  test('generate - with template', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const template = 'id: ${id}, amount: ${amount}, type: ${type}'
    const dTemplate = new DisplayTemplate(template)
    const expectedResult = 'id: 12429667368697866, amount: 99, type: hold'
    expect(dTemplate.generate(mockForm)).toBe(expectedResult)
  })

  test('fillTemplate', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const template = 'id: ${id}, amount: ${amount}, type: ${type}'
    const dTemplate = new DisplayTemplate(template)
    const expectedResult = 'id: 12429667368697866, amount: 99, type: hold'
    expect(dTemplate.fillTemplate(mockForm)).toBe(expectedResult)
  })

  test('convertToString', () => {
    const dTemplate = new DisplayTemplate()
    const expectedString = '{"amount":99,"currency_id":"RUB","id":12429667368697866,"idempotency_key":"nBKMkPoJGy","payment_id":"1570008508911","type":"hold","wallet_from_id":15,"wallet_to_id":"4"}'
    expect(dTemplate.convertToString(mockForm)).toBe(expectedString)
  })

  test('truncateLine - length < LINE_LENGTH', () => {
    const dTemplate = new DisplayTemplate()
    const line = '{"amount":99,"currency_id":"RUB"'
    expect(dTemplate.truncateLine(line)).toBe(line)
  })

  test('truncateLine - length > LINE_LENGTH', () => {
    const dTemplate = new DisplayTemplate()
    const line = '{"amount":99,"currency_id":"RUB","id":12429667368697866,"idempotency_key":"nBKMkPoJGy"'
    const truncatedLine = '{"amount":99,"currency_id":"RUB","id":12429667368...'
    expect(dTemplate.truncateLine(line)).toBe(truncatedLine)
  })
})
