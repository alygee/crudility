import DateController from 'assets/js/form/DateTimeParser'
import mockSchema from 'assets/mock/schema'

describe('DateController', () => {
  function getSchema (name) {
    return mockSchema.schema.entities.find(en => en.name === name)
  }

  const vm = new DateController()

  describe('timestamp', () => {
    beforeEach(() => {
      vm.schema = getSchema('transaction')
    })

    test('is date field', () => {
      expect(vm.isDateField('created')).toBeTruthy()
    })

    test('is timestamp field', () => {
      expect(vm.isTimestampFields('created')).toBeTruthy()
    })

    describe('parseTimestampForAPI', () => {
      test('update timestamp by new values', () => {
        const lastValue = {
          date: '2019-10-02',
          time: '12:27:27'
        }
        const newValue = {
          date: '2020-10-02',
          time: '15:27:27'
        }
        expect(vm.parseTimestampForAPI(newValue, lastValue)).toBe('2020-10-02T15:27:27.000Z')
      })

      test('update timestamp - new date', () => {
        const lastValue = {
          date: '2019-10-02',
          time: '12:27:27'
        }
        const newValue = {
          date: '2020-10-02'
        }
        expect(vm.parseTimestampForAPI(newValue, lastValue)).toBe('2020-10-02T12:27:27.000Z')
      })

      test('update timestamp - empty new value', () => {
        const lastValue = {
          date: '2019-10-02',
          time: '12:27:27'
        }
        const newValue = {}
        expect(vm.parseTimestampForAPI(newValue, lastValue)).toBe('2019-10-02T12:27:27.000Z')
      })
    })

    describe('dateTimeToTimestamp', () => {
      test('converting date and time to timestamp', () => {
        const date = '2019-10-02'
        const time = '12:27:27'
        expect(vm.dateTimeToTimestamp(date, time)).toBe('2019-10-02T12:27:27.000Z')
      })

      test('converting date and time to timestamp - empty date', () => {
        const time = '12:27:27'
        expect(vm.dateTimeToTimestamp(null, time)).toBe('')
      })

      test('converting date and time to timestamp - empty time', () => {
        const date = '2019-10-02'
        expect(vm.dateTimeToTimestamp(date, null)).toBe('2019-10-01T21:00:00.000Z')
      })
    })

    describe('parseTimestampForTemplate', () => {
      test('extract date from iso string', () => {
        expect(vm.dateStringFromISO('2019-10-01T21:00:00.000Z')).toBe('2019-10-01')
      })

      test('extract time from iso string', () => {
        expect(vm.timeStringFormISO('2019-10-01T21:00:00.000Z')).toBe('21:00:00')
      })

      test('extract date and time object from iso string', () => {
        const expectedValue = {
          date: '2019-10-02',
          time: '12:27:27'
        }
        expect(vm.parseTimestampForTemplate('2019-10-02T12:27:27.000Z')).toStrictEqual(expectedValue)
      })
    })
  })

  describe('timerange', () => {
    beforeEach(() => {
      vm.schema = getSchema('account')
    })

    test('is date field', () => {
      expect(vm.isDateField('effective_range')).toBeTruthy()
    })

    test('is timerange field', () => {
      expect(vm.isTimerangeFields('effective_range')).toBeTruthy()
    })

    describe('parseTimerangeForAPI', () => {
      test('update timerange by new values', () => {
        const lastValue = {
          startDate: { date: '2019-09-04', time: '18:27:27' },
          finishDate: { date: '2020-10-02', time: '15:27:27' }
        }
        const newValue = {
          startDate: { date: '2017-10-05', time: '12:27:27' },
          finishDate: { date: '2021-12-02', time: '14:27:27' }
        }
        const expected = {
          startDate: '2017-10-05T12:27:27.000Z',
          finishDate: '2021-12-02T14:27:27.000Z'
        }
        expect(vm.parseTimerangeForAPI(newValue, lastValue)).toStrictEqual(expected)
      })

      test('update timerange - new finishDate', () => {
        const lastValue = {
          startDate: { date: '2019-09-04', time: '18:27:27' },
          finishDate: { date: '2020-10-02', time: '15:27:27' }
        }
        const newValue = {
          finishDate: { date: '2021-12-02', time: '14:27:27' }
        }
        const expected = {
          startDate: '2019-09-04T18:27:27.000Z',
          finishDate: '2021-12-02T14:27:27.000Z'
        }
        expect(vm.parseTimerangeForAPI(newValue, lastValue)).toStrictEqual(expected)
      })

      test('update timestamp - empty new value', () => {
        const lastValue = {
          startDate: { date: '2019-09-04', time: '18:27:27' },
          finishDate: { date: '2021-12-02', time: '14:27:27' }
        }
        const newValue = {}
        const expected = {
          startDate: '2019-09-04T18:27:27.000Z',
          finishDate: '2021-12-02T14:27:27.000Z'
        }
        expect(vm.parseTimerangeForAPI(newValue, lastValue)).toStrictEqual(expected)
      })
    })
    describe('parseTimerangeForTemplate', () => {
      test('parse timerange', () => {
        const timerangeFromApi = {
          startDate: '2019-10-02T12:27:27.000Z',
          finishDate: '2020-10-02T15:27:27.000Z'
        }
        const expectedValue = {
          startDate: {
            date: '2019-10-02',
            time: '12:27:27'
          },
          finishDate: {
            date: '2020-10-02',
            time: '15:27:27'
          }
        }
        expect(vm.parseTimerangeForTemplate(timerangeFromApi)).toStrictEqual(expectedValue)
      })

      test('parse timerange with null', () => {
        const timerangeFromApi = {
          startDate: '2019-10-02T12:27:27.000Z',
          finishDate: null
        }
        const expectedValue = {
          startDate: {
            date: '2019-10-02',
            time: '12:27:27'
          },
          finishDate: {
            date: '',
            time: ''
          }
        }
        expect(vm.parseTimerangeForTemplate(timerangeFromApi)).toStrictEqual(expectedValue)
      })
    })

    test('converting string to timerange', () => {
      const stringTimerange = '2019-10-02T12:27:27.000Z,2020-10-02T15:27:27.000Z'
      const expected = {
        startDate: '2019-10-02T12:27:27.000Z',
        finishDate: '2020-10-02T15:27:27.000Z'
      }
      expect(vm.stringToTimerange(stringTimerange)).toStrictEqual(expected)
    })

    test('converting timerange to string', () => {
      const timerange = {
        startDate: {
          date: '2019-10-02',
          time: '12:27:27'
        },
        finishDate: {
          date: '2020-10-02',
          time: '15:27:27'
        }
      }
      const expected = '2019-10-02T12:27:27.000Z,2020-10-02T15:27:27.000Z'
      expect(vm.timerangeToString(timerange)).toBe(expected)
    })
  })
})
