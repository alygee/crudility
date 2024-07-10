import ColumnSelectionState from 'assets/js/states/ColumnSelectionState'
import { Condition } from 'assets/js/filter/Condition'
import { Parser } from 'assets/js/filter/Parser'
import EntitySelectionState from 'assets/js/states/EntitySelectionState'
import KeywordInputState from 'assets/js/states/KeywordInputState'

describe('ColumnSelectionState', () => {
  describe('isLastPartDeleted', () => {
    test.skip('cdLine.column and cdInput.column are equals', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = new Condition('name')
      const cdInput = new Condition('name')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('does not have cdLine and cdInput', () => {
      const state = new ColumnSelectionState(null)
      expect(state.isLastPartDeleted(undefined, undefined)).toBe(false)
    })

    test.skip('test 1', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = new Condition('name')
      const cdInput = new Condition('')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 2', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name')
      const cdInput = Parser.cdLast('Статус: ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 3', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ')
      const cdInput = Parser.cdLast('Шаг предоставления услуги: ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 4', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновик and status')
      const cdInput = Parser.cdLast('Статус: name = Черновик and ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test.skip('test 5', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновик and status')
      const cdInput = Parser.cdLast('Статус: name = Черновик and status = 1')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test.skip('test 6', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновик and status')
      const cdInput = Parser.cdLast('Статус: name = Черновик and sta')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('test 7', () => {
      const state = new ColumnSelectionState(null)
      const cdLine = Parser.cdLast('Статус: super duper name')
      const cdInput = Parser.cdLast('Статус: ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })
  })

  describe('prev', () => {
    test('should be entity selection state', () => {
      const context = {
        query: {
          line: 'Статус: '
        }
      }
      const state = new ColumnSelectionState(context)
      const prev = state.prev()
      expect(prev instanceof EntitySelectionState).toBeTruthy()
    })

    test('should be keyword input state', () => {
      const context = {
        query: {
          line: 'Статус: name = Черновой черновик and '
        }
      }
      const state = new ColumnSelectionState(context)
      const prev = state.prev()
      expect(prev instanceof KeywordInputState).toBeTruthy()
    })
  })

  describe('onInputHandler', () => {
    test('deleted link value', () => {
      const context = {
        query: {
          line: 'Статус: name.link '
        },
        filterOptions: jest.fn(),
        dOptions: {
          findMatch: jest.fn()
        }
      }
      const state = new ColumnSelectionState(context)
      state.onInputHandler('Статус: name.', 'name.')
      expect(state.context.query.downgraded).toBeFalsy()
    })

    test('deleted link value and dot', () => {
      const context = {
        query: {
          line: 'Статус: name.link '
        }
      }
      const state = new ColumnSelectionState(context)
      state.updateOptions = jest.fn()
      state.onInputHandler('Статус: name', 'name')
      expect(state.context.query.downgraded).toBeTruthy()
    })
  })

  describe('forwardFilter', () => {
    test('empty conditions', () => {
      const state = new ColumnSelectionState({
        query: {
          line: 'Entity: '
        },
        updateTable: jest.fn()
      })
      state.updateOptions = jest.fn()
      state.forwardFilter()
      expect(state.context.tableService.updateTable.mock.calls.length).toBe(1)
      expect(state.updateOptions.mock.calls.length).toBe(1)
    })

    test('not empty conditions', () => {
      const state = new ColumnSelectionState({
        query: {
          line: 'Entity: name = test and '
        },
        updateTable: jest.fn()
      })
      state.updateOptions = jest.fn()
      state.forwardFilter()
      expect(state.context.tableService.updateTable.mock.calls.length).toBe(0)
      expect(state.updateOptions.mock.calls.length).toBe(1)
    })
  })

  describe('downgradeFilter', () => {
    test('should update link option if column with link', () => {
      const context = {
        query: {
          line: 'entity: column.link ',
          findLinkByOption: () => { return { name: 'transaction' } },
          getTechLineWithoutLastPart: jest.fn()
        },
        dOptions: {
          filter: jest.fn()
        }
      }
      const state = new ColumnSelectionState(context)
      state.updateLinkOptions = jest.fn()
      state.downgradeFilter('column.link')
      expect(state.updateLinkOptions.mock.calls.length).toBe(1)
    })

    test('should update options', () => {
      const context = {
        query: {
          line: 'entity: column ',
          getTechLineWithoutLastPart: jest.fn()
        },
        dOptions: {
          filter: jest.fn()
        }
      }
      const state = new ColumnSelectionState(context)
      state.updateOptions = jest.fn()
      state.downgradeFilter('column')
      expect(state.updateOptions.mock.calls.length).toBe(1)
    })
  })

  describe('appendOrReplacePart', () => {
    test('simple column', () => {
      const context = {
        query: {
          line: 'entity: ',
          findLinkByOption: jest.fn(),
          addPart: jest.fn()
        }
      }
      const state = new ColumnSelectionState(context)
      state.appendOrReplacePart('test')
      expect(state.context.query.addPart.mock.calls[0][0]).toBe('test')
      expect(state.context.query.addPart.mock.calls[0][1]).toBe(' ')
    })

    test('link', () => {
      const context = {
        query: {
          line: 'entity: ',
          findLinkByOption: () => { return { name: 'transaction' } },
          addPart: jest.fn()
        }
      }
      const state = new ColumnSelectionState(context)
      state.appendOrReplacePart('test')
      expect(state.context.query.addPart.mock.calls[0][0]).toBe('test')
      expect(state.context.query.addPart.mock.calls[0][1]).toBe('.')
    })
  })
})
