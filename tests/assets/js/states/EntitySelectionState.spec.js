import EntitySelectionState from 'assets/js/states/EntitySelectionState'
import QueryController from 'assets/js/filter/QueryController'

describe('EntitySelectionState', () => {
  test('isLastPartDeleted always returns false', () => {
    const state = new EntitySelectionState(null)
    expect(state.isLastPartDeleted()).toBe(false)
  })

  test('downgradeFilter', () => {
    const context = {
      query: new QueryController(),
      dOptions: { filter: jest.fn() }
    }
    context.query.line = 'entity: '
    const state = new EntitySelectionState(context)
    state.updateOptions = jest.fn()
    state.updateTable = jest.fn()
    state.downgradeFilter()
    expect(state.context.query.line).toBe('entity')
    expect(state.context.query.rootEntity).toBe(null)
  })

  test('appendOrReplacePart', () => {
    const context = {
      query: {
        addPart: jest.fn()
      }
    }
    const state = new EntitySelectionState(context)
    state.setRootEntityAndLinks = jest.fn()
    state.appendOrReplacePart('test')
    expect(state.context.query.addPart.mock.calls[0][0]).toBe('test')
    expect(state.context.query.addPart.mock.calls[0][1]).toBe(': ')
  })
})
