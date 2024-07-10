import escapeRegExp from 'lodash/escapeRegExp'

export default class OptionsController {
  constructor () {
    this.reset()
  }

  reset () {
    this.initialItems = []
    this.items = []
    this._isVisible = false
    /**
     * 'Strict' flag for displaying the list of options.
     * Unlike isVisible, it can only be installed and removed by the user on purpose.
     * Allows user to completely disable the drop-down list, and enable it if necessary.
     * @type {boolean}
     */
    this.hidden = false
  }

  /**
   * The value depends on certain actions in the interface.
   * For example, sets 'true' on search field click and input some letter.
   * @param value
   */
  set isVisible (value) {
    this._isVisible = value
  }

  /**
   * The result of combining all conditions to display the options list.
   * @returns {boolean|*}
   */
  get isVisible () {
    return this._isVisible && !!this.items.length && !this.hidden
  }

  /**
   * Поиск совпадения `option` в отфильтрованном списке `items`.
   * Запускает поиск точного совпадения (ввод `:`) или отфильтровывает список, пока не останется одно точное значение
   * @param {string} option
   * @param {boolean} eager отвечает за тип поиска
   * @param endsWithSpace
   * @returns {boolean} `true`, если совпадение найдено
   */
  findMatch (option, eager, endsWithSpace) {
    option = option.toLowerCase()
    if (eager) {
      return this.searchExactMatch(option)
    }

    if (endsWithSpace) {
      return this.searchExactMatch(option) && !this.searchSingleAndComplete(option + ' ')
    }

    return this.searchSingleAndComplete(option)
  }

  /**
   * Поиск элемента списка, который точно совпадает с введённым значением
   * @param {string} option
   * @returns {boolean}
   */
  searchExactMatch (option) {
    return !!this.items.find(item => item.toString().toLowerCase() === option)
  }

  /**
   * Отфильтровывает список, пока не останется одно точное значение
   * @param {string} option слово или комбинация слов
   * @returns {boolean} `true` если совпадение будет единственным и полным
   */
  searchSingleAndComplete (option) {
    const coincidences = []
    this.items.map((item) => {
      if (item.toLowerCase().startsWith(option)) {
        coincidences.push(item)
      }
    })
    return coincidences.length === 1 && coincidences[0] === option
  }

  /**
   * @param options
   */
  update (options) {
    this.initialItems = options
    this.items = options
  }

  filter (option) {
    this.items = this.initialItems.filter(
      item =>
        ~item.toString().toLowerCase().search(escapeRegExp(option.toLowerCase()))
    )
  }
}
