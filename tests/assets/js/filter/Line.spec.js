import Line from 'assets/js/filter/Line'
import { Parser } from 'assets/js/filter/Parser'

describe('Line', () => {
  describe('techLine', () => {
    test('Ex.1 Entity: column -> Entity: ', () => {
      const line = 'Entity: column '
      expect(new Line(line).techLine()).toBe('Entity: ')
    })

    test('Ex.2 Entity: column = -> Entity: ', () => {
      const line = 'Entity: column = '
      expect(new Line(line).techLine()).toBe('Entity: ')
    })

    test('Ex.3 Entity: column = test and -> Entity: column = test', () => {
      const line = 'Entity: column = test and'
      expect(new Line(line).techLine()).toBe('Entity: column = "test" ')
    })

    test('Ex.4 Entity: column = test and name =  -> Entity: column = test ', () => {
      const line = 'Entity: column = test and name'
      expect(new Line(line).techLine()).toBe('Entity: column = "test" ')
    })

    test('Ex.5 Entity: -> Entity: ', () => {
      const line = 'Entity: '
      expect(new Line(line).techLine()).toBe('Entity: ')
    })

    test('Ex.5 Entity: id in (1, 2) and -> Entity: id in (1, 2) ', () => {
      const line = 'Entity: id in (1, 2) and '
      expect(new Line(line).techLine()).toBe('Entity: id in (1, 2) ')
    })

    test('Entity: id in (1, 2) -> Entity: ', () => {
      const line = 'Entity: id in (1, 2) and '
      expect(new Line(line).techLine(true)).toBe('Entity: ')
    })

    test('Entity name: id in (1, 2) -> "Entity name": id in (1, 2)', () => {
      const line = 'Entity name: id in (1, 2) and '
      expect(new Line(line).techLine()).toBe('"Entity name": id in (1, 2) ')
    })

    test('Entity name:  -> "Entity name": ', () => {
      const line = 'Entity name: '
      expect(new Line(line).techLine()).toBe('"Entity name": ')
    })

    test('Entity name: column name.property = test -> "Entity name": "column name".property = "test"', () => {
      const line = 'Entity name: column name.property = test '
      expect(new Line(line).techLine()).toBe('"Entity name": "column name".property = "test" ')
    })

    test('Entity name: column name.property name = test -> "Entity name": "column name"."property name" = "test"', () => {
      const line = 'Entity name: column name.property name = test '
      expect(new Line(line).techLine()).toBe('"Entity name": "column name"."property name" = "test" ')
    })
  })

  describe('truncatedLine', () => {
    test('Ex.1 Entity: column -> Entity: ', () => {
      const line = 'Entity: column '
      expect(new Line(line).truncatedQueryLine()).toBe('Entity: ')
    })

    test('Ex.2 Entity: column.link -> Entity: ', () => {
      const line = 'Entity: column.link '
      expect(new Line(line).truncatedQueryLine()).toBe('Entity: ')
    })

    test('Ex.3 Entity: "column name" -> Entity: ', () => {
      const line = 'Entity: "column name" '
      expect(new Line(line).truncatedQueryLine()).toBe('Entity: ')
    })

    test('Ex.4 Entity: "column name".link -> Entity: ', () => {
      const line = 'Entity: "column name".link '
      expect(new Line(line).truncatedQueryLine()).toBe('Entity: ')
    })

    test('Ex.5 Entity: "column name"."link name" -> Entity: ', () => {
      const line = 'Entity: "column name"."link name" '
      expect(new Line(line).truncatedQueryLine()).toBe('Entity: ')
    })

    test('Ex.6 Entity: id in (1, 2) -> Entity: id in ', () => {
      const line = 'Entity: id in (1, 2) '
      expect(new Line(line).truncatedQueryLine(line)).toBe('Entity: id in ')
    })
  })

  describe('build', () => {
    test('Сборка пустой строки', () => {
      const cds = Parser.conditions('')
      expect(new Line().buildQueryLine('', cds)).toBe(': ')
    })

    test('Сборка строки, содержащей только rootEntity', () => {
      const str = 'Статус: '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildQueryLine(root, cds)).toBe(str)
    })

    test('Сборка обычной строки', () => {
      const str = 'Статус: status = 1 and name = Черновик order by '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildQueryLine(root, cds)).toBe(str)
    })

    test('Другая сборка обычной строки', () => {
      const str = 'Статус: status = 1 and name '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildQueryLine(root, cds)).toBe(str)
    })
  })

  describe('buildTech', () => {
    test('Empty line', () => {
      const cds = Parser.conditions('')
      expect(new Line().buildTechLine('', cds)).toBe(': ')
    })

    test('Build a string containing only rootEntity', () => {
      const str = 'Статус: '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildTechLine(root, cds)).toBe(str)
    })

    test('Build a string containing long (multiple word) rootEntity', () => {
      const str = 'Статус транзакции: '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildTechLine(root, cds)).toBe('"Статус транзакции": ')
    })

    test('Build a string without multiple word values', () => {
      const str = 'Статус: status = 1 and column is empty '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildTechLine(root, cds)).toBe('Статус: status = "1" and column is empty ')
    })

    test('Build a string with multiple word values', () => {
      const str = 'Статус: status = "1 2 3" and column name is empty '
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildTechLine(root, cds)).toBe('Статус: status = "1 2 3" and "column name" is empty ')
    })

    test('Should delete last keyword', () => {
      const str = 'Статус: status = 1 and column is empty or'
      const root = Parser.root(str)
      const cds = Parser.conditions(str)

      expect(new Line().buildTechLine(root, cds)).toBe('Статус: status = "1" and column is empty ')
    })
  })
})
