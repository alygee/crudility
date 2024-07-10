<template>
  <div class="crudility">
    <crudility-snackbar
      :snackbar="snackbar"
      @hide="snackbar.visible = false"
    />
    <div v-if="isVisible" class="crudility__content">
      <crudility-search-module
        v-if="pageController.isSearch()"
        :query-params="routeAdapter.getQuery()"
        :schema="schema"
        @push-query-params="pushQueryParams"
        @switch-page="switchPage"
        @operation-wrapper="operationWrapper"
      />
      <crudility-form-module
        v-if="pageController.isForm()"
        :full-schema="schema"
        :form="form"
        :route-adapter="routeAdapter"
        @switch-page="switchPage"
        @operation-wrapper="operationWrapper"
        @change="setUnsavedChanges"
      />
      <div v-if="pageController.isNotExist()">
        <h2>404 Not found</h2>
        <a @click="switchPage('search')">Back to search page</a>
      </div>
    </div>
  </div>
</template>

<script>
import CrudilityFormModule from './CrudilityFormModule.vue';
import CrudilitySearchModule from './CrudilitySearchModule.vue';
import api from '../api'
import PageController from '../assets/js/PageController'
import CrudilitySnackbar from "./ui/CrudilitySnackbar";

export default {
  name: 'Crudility',
  components: {
    CrudilitySnackbar,
    CrudilitySearchModule,
    CrudilityFormModule,
  },
  props: {
    routeAdapter: {
      type: Object,
      default: () => ({})
    },
    page: {
      type: String,
      default: 'search'
    }
  },
  data () {
    return {
      pageController: new PageController(this.routeAdapter.getPage()),
      searchLine: '',
      schema: {},
      isVisible: false,
      form: {
        schema: {},
        data: {}
      },
      snackbar: {
        visible: false,
        message: '',
        status: ''
      },
      unsavedChanges: false
    }
  },
  watch: {
    /**
     * Processing navigation through browser back/forward buttons
     */
    routeAdapter () {
      this.processPageChange(this.routeAdapter.getPage(), this.pageController.page)
    }
  },
  beforeMount () {
    window.addEventListener('beforeunload', this.preventBrowserNav)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.preventBrowserNav)
  },
  async mounted () {
    const response = await api.fetchSchema()
    this.schema = response.data.schema
    this.isVisible = true
  },
  methods: {
    pushQueryParams (line) {
      this.searchLine = line
      this.routeAdapter.switchPage(this.pageController.page, { query: line })
    },

    switchPage (pageName, queryData, entity) {
      if (pageName === 'search') {
        queryData = { query: this.searchLine }
      }
      if (pageName === 'edit') {
        this.form = {
          schema: entity.objectSchema,
          data: entity.objectData
        }
      }
      if (!this.shouldPreventNav()) {
        this.routeAdapter.switchPage(pageName, queryData)
        setTimeout(() => this.pageController.setPage(pageName), 500);
      }
    },

    to404 () {
      this.routeAdapter.to404()
    },

    operationWrapper (func, requestParams, newSearchLine) {
      return api[func](requestParams).then((response) => {
        this.snackbar.status = 'success'
        this.snackbar.message = this.$t(`message.${func}`)
        this.setUnsavedChanges(false)
        if (newSearchLine) {
          this.searchLine = this.searchLine || newSearchLine
          this.switchPage('search')
        }
        return response
      }).catch((e) => {
        this.snackbar.status = 'error'
        this.snackbar.message = `${this.$t('error')}: ${e.message}`
      }).finally(() => {
        this.snackbar.visible = true
      })
    },

    preventVueNav (backButtonPressed) {
      const answer = confirm(this.$t('leave'))
      if (answer) {
        this.setUnsavedChanges(false)
      } else if (backButtonPressed) {
        this.routeAdapter.revertBack()
      }
      return !answer
    },

    shouldPreventNav (fromPage) {
      return this.unsavedChanges && fromPage !== 'search' && this.preventVueNav(!!fromPage)
    },

    processPageChange (toPage, fromPage) {
      if (toPage !== fromPage && !this.shouldPreventNav(fromPage)) {
        this.pageController.setPage(toPage)
      }
    },

    preventBrowserNav (event) {
      if (this.unsavedChanges) {
        event.preventDefault()
        event.returnValue = ''
      }
    },

    setUnsavedChanges (value) {
      this.unsavedChanges = value
    }
  }
};
</script>

<style lang="scss">
  .container {
    background-color: #ffffff;
    border-radius: 5px;
    margin: 10px auto;
  }

  input, textarea {
    border-bottom: none !important;
    box-shadow: none !important;
  }

  fieldset legend {
    width: 0;
  }
</style>

<i18n>
{
  "ru": {
    "leave": "Вы уверены, что хотите покинуть страницу? На текущей странице могут быть несохраненные изменения.",
    "message": {
      "create": "Объект успешно создан",
      "delete": "Объект успешно удален",
      "update": "Изменения сохранены"
    },
    "error": "Ошибка: "
  },
  "en": {
    "leave": "Are you sure you want to leave the page? There may be unsaved changes on the current page.",
    "message": {
      "create": "Object successfully created",
      "delete": "Object successfully deleted",
      "update": "Changes saved"
    },
    "error": "Error: "
  }
}
</i18n>