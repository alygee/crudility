<template>
  <v-container class="crudility-search-module" fluid>
    <div class="crudility-search-module__filter">
      <crudility-jql-filter
        id="search"
        ref="filter"
        :d-options="dOptions"
        :loading="loading"
        :line="query ? query.line : ''"
        :class="!query.validation.status ? 'filter-error' : ''"
        @option-click="onOptionClick"
        @input-field-change="onInputSearchField"
        @search="onSearch"
      >
        <template #prepend>
          <crudility-status
            :status="query.validation.status"
            :message="query.validation.message"
          />
        </template>

        <template #append>
          <crudility-hint-content/>
        </template>

        <template #append-outer>
          <crudility-button @click="onSearch(query.input)">
            {{ $t('search') }}
          </crudility-button>
        </template>
      </crudility-jql-filter>
    </div>

    <div
      class="crudility-search-module__create-btn"
      v-if="query.rootEntity"
    >
      <crudility-button
        @click="onCreate"
      >
        {{ $t('add') }}
      </crudility-button>
    </div>

    <crudility-table
      class="crudility-search-module__table"
      :table="table"
      :service="tableService"
      @search="onSearch"
      @action="executeAction"
    />
  </v-container>
</template>

<script>
import debounce from 'lodash/debounce'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import map from 'lodash/map'

import CrudilityJqlFilter from './common/CrudilityJqlFilter.vue';
import CrudilityStatus from './common/CrudilityStatus.vue';
import CrudilityTable from './ui/CrudilityTable.vue';
import CrudilityButton from './ui/button/CrudilityButton.vue';
import TableModel from '../assets/js/table/TableModel'
import QueryController from '../assets/js/filter/QueryController'
import OptionsController from '../assets/js/filter/OptionsController'
import EntitySelectionState from '../assets/js/states/EntitySelectionState'
import { Parser } from '../assets/js/filter/Parser'
import Line from '../assets/js/filter/Line'
import CrudilityHintContent from './custom/CrudilityHintContent'
import TableService from '../assets/js/table/TableService'

export default {
  name: 'CrudilitySearchModule',
  components: {
    CrudilityHintContent,
    CrudilityButton,
    CrudilityTable,
    CrudilityStatus,
    CrudilityJqlFilter,
  },
  props: {
    queryParams: {
      type: String,
      default: ''
    },
    schema: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dOptions: new OptionsController(),
      loading: false,
      state: new EntitySelectionState(this),
      query: new QueryController(this),
      table: new TableModel(),
      tableService: new TableService(this)
    }
  },
  watch: {
    queryParams () {
      if (!this.queryParams) {
        this.resetFilter()
      } else if (this.queryParams !== this.query.input) {
        this.parseQueryParams(this.queryParams)
      }
    }
  },
  mounted () {
    this.debouncedClick = debounce(this.onOptionClick, 50)
    this.queryParams ? this.parseQueryParams(this.queryParams) : this.resetFilter()
  },
  methods: {
    onSearch (query) {
      if (query.trim()){
        this.setQueryToUrl(query)
        this.parseQueryParams(query)
      }
      this.dOptions.isVisible = false
    },

    onCreate () {
      const queryData = { entity: this.query.rootEntity.name }
      this.$emit('switch-page', 'create', queryData)
    },

    parseQueryParams (query) {
      this.query.reset()
      this.query.setState(query)
      this.state.forwardFilter()
      /**
       * In some states table data updates in forwardFilter() function
       * It is necessary to update table for states, where it's not done and if rootEntity is empty (query is incorrect)
       */
      if (!this.state.isTableUpdated || !this.query.rootEntity) {
        this.tableService.updateTable(new Line(this.query.line).techLine())
      }
    },

    onInputSearchField (input) {
      this.setQueryToUrl(input)
      this.query.input = input

      const trimmedInput = input ? input.trim() : input
      if (!trimmedInput) {
        this.resetFilter()
        return
      }
      if (this.state.isLastPartDeleted(Parser.cdLast(input), Parser.cdLast(this.query.line))) {
        this.query.deletePart()
      } else if (this.state.shouldDowngrade(input)) {
        this.downgradeFilter(input)
        return
      }

      const lastChars = this.query.getChanges(input).trim()
      if (lastChars) {
        this.dOptions.isVisible = true
      }
      this.state.onInputHandler(input, lastChars)
    },

    downgradeFilter (input) {
      this.query.downgraded = true
      this.state = this.state.prev()
      const lastChars = this.query.getStringDiff(input, new Line(this.query.line).truncatedQueryLine()).trim()
      this.state.downgradeFilter(lastChars)
    },

    /**
     * @param lastChars
     */
    filterOptions (lastChars) {
      this.dOptions.filter(lastChars)
    },

    /**
     * Сброс параметров запроса и переход к начальному состоянию
     */
    resetFilter () {
      this.query.reset()
      this.dOptions.reset()
      this.state = new EntitySelectionState(this)
      this.state.forwardFilter('')
    },

    /**
     * Обработка клика на динамическую опцию
     * @param {string} option слово или комбинация слов
     */
    async onOptionClick (option) {
      await this.state.appendOrReplacePart(option)
      if (this.state.link) {
        this.state.updateLinkOptions()
      } else {
        this.state = this.state.next()
        this.state.forwardFilter(option)
      }
      this.setQueryToUrl(this.query.line)
      this.query.input = this.query.line
    },

    setQueryToUrl (line) {
      if (line !== this.queryParams) {
        this.$emit('push-query-params', line)
      }
    },

    async executeAction (action, identity) {
      const response = await this.$listeners['operation-wrapper']( action, {
        entityName: this.query.rootEntity.name,
        identity: identity
      })
      if (response) {
        this.tableService.updateTable(new Line(this.query.line).techLine())
      }
    },

    getNamesAndTitles (items) {
      const names = filter(map(items, 'name'), null)
      const titles = filter(map(items, 'title'), null)
      const namesAndTitles = concat(names, titles)
      return [...new Set(namesAndTitles)]
    }
  }
}
</script>

<style lang="scss">
  .crudility-search-module {

    &__create-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }

    .crudility-table-select {
      width: 250px;

      fieldset {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }

  .v-input > * {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
  }
</style>

<i18n>
  {
    "ru": {
      "search": "Найти",
      "add": "Добавить новый элемент"
    },
  "en": {
    "search": "Search",
    "add": "Add new item"
    }
  }
</i18n>