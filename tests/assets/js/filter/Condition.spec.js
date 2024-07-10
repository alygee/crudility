import { Parser } from 'assets/js/filter/Parser'
import { Condition } from 'assets/js/filter/Condition'

describe('Condition', () => {
  describe('toLine', () => {
    test('toLine - condition with value', () => {
      const str = 'status = 1 '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toLine()).toBe(str + 'and ')
    })

    test('toLine - condition without value', () => {
      const str = 'status is not empty '
      const cd = Parser.cdSplit(str)
      expect(cd.conditionWithoutValue).toBeTruthy()
      expect(cd.toLine()).toBe(str)
    })
  })

  describe('toTechLine', () => {
    test('toTechLine - condition with value', () => {
      const str = 'column name = "1 2" '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toTechLine()).toBe('"column name" = "1 2" and ')
    })

    test('toTechLine - condition without value', () => {
      const str = 'column name is not empty '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeTruthy()
      expect(cd.toTechLine()).toBe('"column name" is not empty and ')
    })

    test('toTechLine - column with nested property', () => {
      const str = 'column name.prop = 123 '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toTechLine()).toBe('"column name".prop = "123" and ')
    })

    test('toTechLine - column with nested property', () => {
      const str = 'column name.nested prop = 123 '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toTechLine()).toBe('"column name"."nested prop" = "123" and ')
    })
  })

  describe('toTechLineWithoutKeyword', () => {
    test('toTechLineWithoutKeyword - condition with value', () => {
      const str = 'column name = "1 2" '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toTechLineWithoutKeyword()).toBe('"column name" = "1 2" ')
    })

    test('toTechLineWithoutKeyword - condition without value', () => {
      const str = 'column name is not empty '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeTruthy()
      expect(cd.toTechLineWithoutKeyword()).toBe('"column name" is not empty ')
    })

    test('toTechLineWithoutKeyword - column with nested property', () => {
      const str = 'column name.prop = 123 '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toTechLineWithoutKeyword()).toBe('"column name".prop = "123" ')
    })

    test('toTechLineWithoutKeyword - column with nested property', () => {
      const str = 'column name.nested prop = 123 '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.toTechLineWithoutKeyword()).toBe('"column name"."nested prop" = "123" ')
    })
  })

  describe('addQuotesToValue', () => {
    test('one word', () => {
      const cd = new Condition()
      expect(cd.addQuotesToValue('test')).toBe('"test"')
    })

    test('empty', () => {
      const cd = new Condition()
      expect(cd.addQuotesToValue('')).toBe('')
    })

    test('multiple words', () => {
      const cd = new Condition()
      expect(cd.addQuotesToValue('test test')).toBe('"test test"')
    })

    test('option in quotes', () => {
      const cd = new Condition()
      expect(cd.addQuotesToValue('"test test"')).toBe('"test test"')
    })

    test('option in brackets', () => {
      const cd = new Condition()
      expect(cd.addQuotesToValue('(test, test)')).toBe('(test, test)')
    })
  })

  describe('addQuotesToColumn', () => {
    test('one word', () => {
      const cd = new Condition()
      expect(cd.addQuotesToColumn('test')).toBe('test')
    })

    test('multiple words', () => {
      const cd = new Condition()
      expect(cd.addQuotesToColumn('test test')).toBe('"test test"')
    })

    test('long column name with prop', () => {
      const cd = new Condition()
      expect(cd.addQuotesToColumn('test test.prop')).toBe('"test test".prop')
    })

    test('column name with long prop', () => {
      const cd = new Condition()
      expect(cd.addQuotesToColumn('test.long prop')).toBe('test."long prop"')
    })

    test('long column name with long prop', () => {
      const cd = new Condition()
      expect(cd.addQuotesToColumn('test column.long prop')).toBe('"test column"."long prop"')
    })
  })

  describe('isCompleted', () => {
    test('completed condition with value', () => {
      const str = 'status = 1 '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.isCompleted()).toBeTruthy()
    })

    test('completed condition without value', () => {
      const str = 'status is not empty '
      const cd = Parser.cdSplit(str)
      expect(cd.conditionWithoutValue).toBeTruthy()
      expect(cd.isCompleted()).toBeTruthy()
    })

    test('not completed condition 1', () => {
      const str = 'status = '
      const cd = Parser.cdSplit(str, 'and')
      expect(cd.conditionWithoutValue).toBeFalsy()
      expect(cd.isCompleted()).toBeFalsy()
    })

    test('not completed condition 2', () => {
      const str = 'status'
      const cd = Parser.cdSplit(str)
      expect(cd.isCompleted()).toBeFalsy()
    })
  })

  describe('deleteLastOption', () => {
    test('"column name" = test', () => {
      const cd = new Condition('column name', '=', 'test')
      cd.deleteLastOption()
      expect(cd).toStrictEqual(new Condition('column name', '=', ''))
    })

    test('status is not empty', () => {
      const cd = Parser.cdSplit('status is not empty')
      cd.deleteLastOption()
      expect(cd.toLine()).toBe('status ')
    })

    test('status is not empty ', () => {
      const cd = Parser.cdSplit('status is not empty and', 'and')
      cd.deleteLastOption()
      expect(cd.toLine()).toBe('status is not empty ')
    })
  })

  describe('diff', () => {
    test('equal', () => {
      const lineCd = new Condition('column name', '=', 'test')
      const inputCd = new Condition('column name', '=', 'test')
      expect(lineCd.diff(inputCd)).toBe(0)
    })

    test('2 states deleted', () => {
      const lineCd = new Condition('column name', '=', 'test')
      const inputCd = new Condition('column name', '', '')
      expect(lineCd.diff(inputCd)).toBe(2)
    })

    test('changed one state', () => {
      const lineCd = new Condition('column name', '=', 'test')
      const inputCd = new Condition('column name', '=', 'tes')
      expect(lineCd.diff(inputCd)).toBe(1)
    })

    test('keyword changed', () => {
      const lineCd = new Condition('column name', '=', 'test', 'and')
      const inputCd = new Condition('column name', '=', 'test an')
      expect(lineCd.diff(inputCd)).toBe(1)
    })

    test('deleted 3 states', () => {
      const lineCd = new Condition('column name', '=', 'test', 'and')
      const inputCd = new Condition('column name', '', '')
      expect(lineCd.diff(inputCd)).toBe(3)
    })
  })
})
