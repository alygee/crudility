import QueryController from 'assets/js/filter/QueryController'
import EntitySelectionState from 'assets/js/states/EntitySelectionState'
import ColumnSelectionState from 'assets/js/states/ColumnSelectionState'
import OperationInputState from 'assets/js/states/OperationInputState'
import CellValueSelectionState from 'assets/js/states/CellValueSelectionState'
import KeywordInputState from 'assets/js/states/KeywordInputState'

function createQuery () {
  const qCtrl = new QueryController({})
  Object.assign(qCtrl.context, { schema: { entities: [] } })
  qCtrl.context.$findValue = jest.fn()
  qCtrl.context.$findValue.mockImplementation(() => {
    return {
      'name': 'flow_status_list',
      'title': 'Статус',
      'description': '',
      'fields': [],
      'fk': [],
      'revFk': [],
      'medLnk': []
    }
  })
  return qCtrl
}

describe('QueryController', () => {
  test('sanity', () => {
    const qCtrl = new QueryController()
    expect(qCtrl.line).toBe('')
  })

  describe('getState', () => {
    test('EntitySelectionState', () => {
      const qCtrl = new QueryController()
      expect(qCtrl.getState()).toBeInstanceOf(EntitySelectionState)
    })

    test('ColumnSelectionState', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'RootEntity: '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(ColumnSelectionState)
    })

    test('EntitySelectionState without colon', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'RootEntity '
      expect(qCtrl.getState()).toBeInstanceOf(EntitySelectionState)
    })

    test('OperationInputState', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус: name '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(OperationInputState)
    })

    test('CellValueSelectionState', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус:  name  !=  '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(CellValueSelectionState)
    })

    test('KeywordInputState', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус:  name  !=  Черновой черновик  '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(KeywordInputState)
    })

    test('ColumnSelectionState', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус:  name   !=  Черновой черновик    and     '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(ColumnSelectionState)
    })

    test('Undetermined state', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус:  something wrong    and     '
      qCtrl.rootEntity = {}

      function getStateError () {
        qCtrl.getState()
      }

      expect(getStateError).toThrowError('Failed to determine state by query line')
    })

    test('OperationInputState with long line', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус: name != Черновой черновик and  status.id   '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(OperationInputState)
    })

    test('CellValueSelectionState with long line', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус: name != Черновой черновик and  status.id  >=   '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(CellValueSelectionState)
    })

    test('KeywordInputState with long line', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус: name != Черновой черновик and  status.id  >=  100500 '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(KeywordInputState)
    })

    test('ColumnSelectionState with long line', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус: name != Черновой черновик and  status.id  >=  100500  or'
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(ColumnSelectionState)
    })

    test('KeywordInputState in condition without value', () => {
      const qCtrl = new QueryController()
      qCtrl.line = 'Статус: name != Черновой черновик and  status.id  is not empty '
      qCtrl.rootEntity = {}
      expect(qCtrl.getState()).toBeInstanceOf(KeywordInputState)
    })
  })

  describe('setState', () => {
    test('set EntitySelectionState', () => {
      const qCtrl = createQuery()
      qCtrl.context.$findValue.mockImplementation(() => undefined)
      qCtrl.setState('Статус')
      expect(qCtrl.context.state).toBeInstanceOf(EntitySelectionState)
    })

    test('set OperationInputState', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус: name')
      expect(qCtrl.context.state).toBeInstanceOf(OperationInputState)
    })

    test('set OperationInputState', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус:   name  ')
      expect(qCtrl.context.state).toBeInstanceOf(OperationInputState)
    })

    test('set CellValueSelectionState', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус:   name  !=  ')
      expect(qCtrl.context.state).toBeInstanceOf(CellValueSelectionState)
    })

    test('set KeywordInputState', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус:   name  !=   Черновой черновик  ')
      expect(qCtrl.context.state).toBeInstanceOf(KeywordInputState)
    })

    test('set KeywordInputState', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус:   name  is not empty  ')
      expect(qCtrl.context.state).toBeInstanceOf(KeywordInputState)
    })

    test('set ColumnSelectionState', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус:   name  !=   Черновой черновик  and')
      expect(qCtrl.context.state).toBeInstanceOf(ColumnSelectionState)
    })

    test('set OperationInputState with long line', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус: name != Черновой черновик and  status.id ')
      expect(qCtrl.context.state).toBeInstanceOf(OperationInputState)
    })

    test('set CellValueSelectionState with long line', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус: name != Черновой черновик and  status.id  >=  ')
      expect(qCtrl.context.state).toBeInstanceOf(CellValueSelectionState)
    })

    test('set KeywordInputState with long line', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус: name != Черновой черновик and  status.id  >=  100500  ')
      expect(qCtrl.context.state).toBeInstanceOf(KeywordInputState)
    })

    test('set ColumnSelectionState with long line', () => {
      const qCtrl = createQuery()
      qCtrl.setState('Статус: name != Черновой черновик and  status.id  >=  100500 or ')
      expect(qCtrl.context.state).toBeInstanceOf(ColumnSelectionState)
    })
  })

  test('getStringDiff', () => {
    //
  })
})
