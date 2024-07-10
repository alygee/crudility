import CellValueSelectionState from 'assets/js/states/CellValueSelectionState'
import { Condition } from 'assets/js/filter/Condition'
import { Parser } from 'assets/js/filter/Parser'

describe('CellValueSelectionState', () => {
  describe('isLastPartDeleted', () => {
    test('cdLine.value and cdInput.value are equals', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = new Condition('name', '=', 'Черновой черновик')
      const cdInput = new Condition('name', '=', 'Черновой черновик')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('does not have cdInput', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = new Condition('name', '=', 'Черновой черновик')

      expect(state.isLastPartDeleted(undefined, cdLine)).toBe(true)
    })

    test('has no cdLine', () => {
      const state = new CellValueSelectionState(null)
      expect(state.isLastPartDeleted(undefined, undefined)).toBe(false)
    })

    test('have empty cdInput.value', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = new Condition('name', '=', 'Черновой черновик')
      const cdInput = new Condition('name', '=', undefined)

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 1', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name != Черновой черновик')
      const cdInput = Parser.cdLast('Статус: name != ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 2', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ~ Черновой черновик` ')
      const cdInput = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ~ ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 3', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновой черновик and status != 100500')
      const cdInput = Parser.cdLast('Статус: name = Черновой черновик and status != ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 4', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновой черновик and status = 100500')
      const cdInput = Parser.cdLast('Статус: name = Черновой черновик and status = 100500 or something')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('test 5', () => {
      const state = new CellValueSelectionState(null)
      const cdLine = Parser.cdLast('Статус: name = Черновой черновик and status >= 100500')
      const cdInput = Parser.cdLast('Статус: name = Черновой черновик and status >= 100')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })
  })
})
