import KeywordInputState from 'assets/js/states/KeywordInputState'
import { Condition } from 'assets/js/filter/Condition'
import { Parser } from 'assets/js/filter/Parser'

describe('KeywordInputState', () => {
  describe('isLastPartDeleted', () => {
    test('cdLine.keyword and cdInput.keyword are equals', () => {
      const state = new KeywordInputState(null)
      const cdLine = new Condition('name', '=', 'Обычный черновик', 'and')
      const cdInput = new Condition('name', '=', 'Обычный черновик', 'and')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('does not have cdInput', () => {
      const state = new KeywordInputState(null)
      const cdLine = new Condition('name', '=', 'Обычный черновик', 'and')

      expect(state.isLastPartDeleted(undefined, cdLine)).toBe(true)
    })

    test('has no cdLine', () => {
      const state = new KeywordInputState(null)
      expect(state.isLastPartDeleted(undefined, undefined)).toBe(false)
    })

    test('have empty cdInput.keyword', () => {
      const state = new KeywordInputState(null)
      const cdLine = new Condition('name', '=', 'Обычный черновик', 'and')
      const cdInput = new Condition('name', '=', 'Обычный черновик', undefined)

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 1', () => {
      const state = new KeywordInputState(null)
      const cdLine = Parser.cdLast('Статус: name != Обычный черновик or')
      const cdInput = Parser.cdLast('Статус: name != Обычный черновик ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 2', () => {
      const state = new KeywordInputState(null)
      const cdLine = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ~ Обычный черновик and ')
      const cdInput = Parser.cdLast('Шаг предоставления услуги: vasp_scheme_id.name ~ Обычный черновик ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 3', () => {
      const state = new KeywordInputState(null)
      const cdLine = Parser.cdLast('Статус: name = Обычный черновик and status is not empty and')
      const cdInput = Parser.cdLast('Статус: name = Обычный черновик and status is not empty ')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(true)
    })

    test('test 4', () => {
      const state = new KeywordInputState(null)
      const cdLine = Parser.cdLast('Статус: name = Обычный черновик and status = 100500 order by')
      const cdInput = Parser.cdLast('Статус: name = Обычный черновик and status = 100500 order by something')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })

    test('test 5', () => {
      const state = new KeywordInputState(null)
      const cdLine = Parser.cdLast('Статус: name = Обычный черновик and status is empty or ')
      const cdInput = Parser.cdLast('Статус: name = Обычный черновик and status is empty o')

      expect(state.isLastPartDeleted(cdInput, cdLine)).toBe(false)
    })
  })
})
