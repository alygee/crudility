import mockSchema from 'assets/mock/schema'
import mockTemplate from 'assets/mock/template'
import FormController from 'assets/js/form/FormController'

const entity = mockSchema.schema.entities[2]

describe('FormController', () => {
  function getFormController () {
    return new FormController()
  }

  test('sanity', () => {
    const formController = getFormController()
    expect(formController).toBeDefined()
    expect(formController.fullSchema).toEqual({})
    expect(formController.form).toEqual(null)
    expect(formController.initialProps).toEqual({})
    expect(formController.isVisible).toEqual(false)
  })

  test('should be invisible', () => {
    const formController = getFormController()
    expect(formController.isVisible).toBe(false)
  })

  describe('filterProperties', () => {
    test.skip('filterProperties should filter schema properties by title', () => {
      const templateController = getFormController()
      const props = templateController.getAllProperties(entity)
      const meta = templateController.buildMetaQuery(entity.fk)
      templateController.setSchema(entity, props, meta)
      templateController.filterProperties('Бал')
      expect(templateController.form.properties).toEqual([mockTemplate.properties.balance])
    })

    test.skip('filterProperties should filter schema properties by key', () => {
      const dateController = getFormController()
      dateController.setViewAndEditSchema(entity)
      dateController.filterProperties('bal')
      expect(dateController.schema.properties).toEqual([mockTemplate.properties.balance])
    })

    test.skip('filterProperties should return initial properties if search input is empty', () => {
      const schemaController = getFormController()
      schemaController.setViewAndEditSchema(entity)
      schemaController.filterProperties('')
      expect(schemaController.schema.properties).toEqual(schemaController.initialProperties)
    })
  })
  describe('schema properties', () => {
    test('getAllProperties should concat entity\'s fields, fk, revFk and medLnk', () => {
      const formController = getFormController()
      const unionData = formController.getAllProperties(entity)
      const concatData = entity.fields.concat(entity.medLnk, entity.revFk, entity.fk)
      expect(unionData).toEqual(concatData)
    })

    test('getMutableProperties should concat entity\'s fields and fk', () => {
      const formController = getFormController()
      const unionData = formController.getMutableProperties(entity)
      const concatData = entity.fields.concat(entity.fk)
      expect(unionData).toEqual(concatData)
    })

    test('should have empty initialProperties', () => {
      const formController = getFormController()
      expect(formController.initialProperties).toEqual({})
    })
  })
})
