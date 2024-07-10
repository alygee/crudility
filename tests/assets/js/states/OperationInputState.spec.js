import OperationInputState from 'assets/js/states/OperationInputState'
import { Condition } from 'assets/js/filter/Condition'
import { Parser } from 'assets/js/filter/Parser'

describe('OperationInputState', () => {
  describe('isLastPartDeleted', () => {
    test('cdLine.operation and cdInput.operation are equals', () => {
      const state = new OperationInputState(null)
      const cdLine = new Condition('name', '=')
      const cdInput = new Condition('name', '=')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('does not have cdInput', () => {
      const state = new OperationInputState(null)
      const cdLine = new Condition('name', '=')

      expect(state.isLastPartDeleted(undefined, cdLine)).toBe(true)
    })

    test('has no cdLine', () => {
      const state = new OperationInputState(null)
      expect(state.isLastPartDeleted(undefined, undefined)).toBe(false)
    })

    test('have empty cdInput.operation', () => {
      const state = new OperationInputState(null)
      const cdLine = new Condition('name', '=')
      const cdInput = new Condition('name', undefined)

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 1', () => {
      const state = new OperationInputState(null)
      const cdLine = Parser.cdLast('Статус: name != ')
      const cdInput = Parser.cdLast('Статус: name')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 2', () => {
      const state = new OperationInputState(null)
      const cdLine = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ~ ` ')
      const cdInput = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 3', () => {
      const state = new OperationInputState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновик and status !=')
      const cdInput = Parser.cdLast('Статус: name = Черновик and status')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 4', () => {
      const state = new OperationInputState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновик and status =')
      const cdInput = Parser.cdLast('Статус: name = Черновик and status = 1')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('test 5', () => {
      const state = new OperationInputState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновик and status >=')
      const cdInput = Parser.cdLast('Статус: name = Черновик and status >')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })
  })
})
