import { Parser } from 'assets/js/filter/Parser'
import { Condition } from 'assets/js/filter/Condition'

describe('Parser', () => {
  describe('getting rootEntity and remaining query', () => {
    test('Словарь: is_mandatory = true and value = WAP and status = 1', () => {
      const { root, trail } = Parser.parse('Словарь: is_mandatory = true and value = WAP and status = 1')
      expect(root).toBe('Словарь')
      expect(trail).toBe('is_mandatory = true and value = WAP and status = 1')
    })

    test('something wrong', () => {
      const { root, trail } = Parser.parse('something wrong')
      expect(root).toBe('')
      expect(trail).toBe('')
    })

    test('Словарь: is_mandatory = true and value = W:A:P and status = 1:0', () => {
      const { root, trail } = Parser.parse('Словарь: is_mandatory = true and value = W:A:P and status = 1:0')
      expect(root).toBe('Словарь')
      expect(trail).toBe('is_mandatory = true and value = W:A:P and status = 1:0')
    })
  })

  describe('divide query into conditions', () => {
    test('test 1', () => {
      const str = 'Словарь по умолчанию: name = чернее черной черноты бесконечности and is_mandatory = true and value = WAP and status = 1'
      const result = Parser.conditions(str)
      expect(result).toEqual([
        new Condition('name', '=', 'чернее черной черноты бесконечности', 'and', 0),
        new Condition('is_mandatory', '=', 'true', 'and', 1),
        new Condition('value', '=', 'WAP', 'and', 2),
        new Condition('status', '=', '1', undefined, 3)
      ])
    })

    test('test 2', () => {
      expect(Parser.conditions('Статус: name = Черновик and')).toHaveLength(1)
    })
  })

  describe('cdSplit - Converting a string to a Condition object', () => {
    test('condition with value', () => {
      const str = 'column name ~ test'
      expect(Parser.cdSplit(str, 'and')).toEqual(new Condition('column name', '~', 'test', 'and', undefined, false))
    })

    test('condition without value', () => {
      const str = 'column name is empty'
      expect(Parser.cdSplit(str, 'and', 2)).toEqual(new Condition('column name', 'is empty', undefined, 'and', 2, true))
    })
  })
})
