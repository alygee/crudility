<template lang="html">
  <property
    v-if="!!resolvedSchema"
    :schema="resolvedSchema"
    :model-root="modelWrapper.root"
    :model-wrapper="modelWrapper"
    :options="fullOptions"
    model-key="root"
    parent-key=""
    @error="e => $emit('error', e)"
    @change="e => $emit('change', e)"
    @input="e => $emit('input', e)"
  >
    <!-- propagate slots to children, see https://gist.github.com/Loilo/73c55ed04917ecf5d682ec70a2a1b8e2 -->
    <slot v-for="(_, name) in $slots" :slot="name" :name="name" />
    <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </property>
</template>

<script>
import jrefs from '../../assets/js/vuetify-jsonschema-form/json-refs'
import colors from '../../assets/js/vuetify-jsonschema-form/colors'
import Property from './components/Property.vue'
export default {
  name: 'VJsonschemaForm',
  components: { Property },
  // eslint-disable-next-line vue/require-prop-types
  props: ['schema', 'model', 'options'],
  data () {
    return { modelWrapper: { root: this.model } }
  },
  computed: {
    resolvedSchema () {
      return jrefs.resolve(this.schema)
    },
    fullOptions () {
      const httpLib = this.axios || this.$http || this.$axios
      // we use the multi-themes functionality of vuetify2 as a clue of the version
      const vuetifyVersion = !this.$vuetify.theme.themes ? 1 : 2
      // icons font is only variable in vuetify 2
      const iconfont = vuetifyVersion === 1 ? 'md' : ((this.$vuetify.icons && this.$vuetify.icons.iconfont) || 'mdi')
      const icons = {
        md: {
          calendar: 'event',
          clock: 'schedule',
          info: 'info',
          dropdown: 'arrow_drop_down',
          dropup: 'arrow_drop_up',
          add: 'add',
          reorder: 'reorder',
          delete: 'delete'
        },
        mdi: {
          calendar: 'mdi-calendar',
          clock: 'mdi-clock',
          info: 'mdi-information',
          dropdown: 'mdi-menu-down',
          dropup: 'mdi-menu-up',
          add: 'mdi-plus',
          reorder: 'mdi-reorder-horizontal',
          delete: 'mdi-delete'
        }
      }[iconfont]

      const defaultOptions = {
        debug: false,
        httpLib,
        disableAll: false,
        colors,
        autoFoldObjects: false,
        allOfTabs: true,
        requiredMessage: this.$t('required'),
        noDataMessage: this.$t('no_data'),
        searchMessage: this.$t('search'),
        vuetifyVersion,
        tabsMode: 'grow',
        locale: 'en',
        accordionMode: 'normal'
      }
      const fullOptions = Object.assign({}, defaultOptions, this.resolvedSchema['x-options'] || {}, this.options || {})
      fullOptions.icons = Object.assign(icons, fullOptions.icons || {})
      return fullOptions
    }
  },
  watch: {
    model (newModel) {
      this.modelWrapper.root = newModel
    }
  }
}
</script>

<style>
  .vjsf-property-root div div p {
    display: none;
  }
</style>

<i18n>
{
  "ru": {
    "required": "Эта информация обязательна",
    "search": "Найти...",
    "no_data": "Соответствующее значение не найдено"
  },
  "en": {
    "required": "This information is required",
    "search": "Search...",
    "no_data": "No matching value found"
  }
}
</i18n>