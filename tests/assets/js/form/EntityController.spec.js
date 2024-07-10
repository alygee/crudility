import EntityController from 'assets/js/form/EntityController'
import DataParser from 'assets/js/form/DataParser'
import mockSchema from 'assets/mock/schema'
import mockData from 'assets/mock/entity_data'

const entitySchema = mockSchema.schema.entities[4]

describe('EntityController', () => {
  function getController () {
    const entityController = new EntityController()
    entityController.init('test', entitySchema)
    return entityController
  }

  test('sanity', () => {
    const entityController = new EntityController()
    expect(entityController).toBeDefined()
    expect(entityController.dataParser instanceof DataParser).toBeTruthy()
    expect(entityController.initialObject).toStrictEqual({})
    expect(entityController.object).toStrictEqual({})
    expect(entityController.fullObject).toStrictEqual({})
    expect(entityController.entityName).toBe('')
    expect(entityController.identity).toStrictEqual({})
  })

  test('init', () => {
    const entityController = getController()
    expect(entityController.entityName).toBe('test')
    expect(entityController.dataParser.schema).toStrictEqual(entitySchema)
  })

  test('setData', () => {
    const entityController = getController()
    entityController.setData(mockData.data, mockData.identity)
    expect(entityController.identity).toBe(mockData.identity)
  })

  test.skip('reset', () => {
    const entityController = new EntityController()
    entityController.initData('transaction', mockData.data, mockData.identity)
    entityController.dataParser.setSchema(entitySchema)
    entityController.reset()
    expect(entityController.line).toBe('')
    expect(entityController.object).toBe({})
    expect(entityController.entityName).toBe('')
  })

  test.skip('getObjectData', () => {

  })

  test.skip('fillInitialData', () => {

  })

  test.skip('getMetaFields', () => {

  })

  test.skip('updateLine', () => {

  })

  test.skip('updateObject', () => {

  })
})
