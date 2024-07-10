<template>
  <v-container v-if="isFormVisible">
    <keyboard-events @keydown="keyboardEvent"/>

    <crudility-form-header>
      <crudility-button-back class="col-1" @click="back"/>
      <crudility-switch class="crudility-header__edit col-2" v-if="editPage" v-model="editMode"/>
      <div class="col-2" v-if="!editPage"></div>
      <div class="crudility-header__title col-6">{{ entityController.title }}</div>
      <crudility-search-input ref="search" class="col-2" @input="filterProps"/>
    </crudility-form-header>

    <div class="crudility-form">
      <crudility-form-generator
        ref="formGenerator"
        :schema="formController.form"
        :model="entityController.object"
        :options="formController.options"
        @input="unsavedChanges = true"
      />
      <div class="crudility-form__buttons">
        <crudility-button
                v-if="!editPage || editMode"
                @click.prevent="onSave"
        >{{ $t(editPage ? 'update' : 'create') }}</crudility-button>

        <confirmation-dialog
          v-if="editPage"
          @confirm="onDelete"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import CrudilityFormHeader from './common/CrudilityFormHeader.vue';
import CrudilityButtonBack from './ui/button/CrudilityButtonBack.vue';
import CrudilitySwitch from './ui/CrudilitySwitch.vue';
import CrudilitySearchInput from './common/CrudilitySearchInput.vue';
import CrudilityFormGenerator from './common/CrudilityFormGenerator.vue';
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import EntityController from '../assets/js/form/EntityController'
import FormController from '../assets/js/form/FormController'
import api from '../api'
import KeyboardEvents from './custom/KeyboardEvents'
import CrudilityButton from './ui/button/CrudilityButton'
import ConfirmationDialog from './custom/ConfirmationDialog'

/**
 * TODO
 * Divide to FormMode: EditMode, CreateMode
 */
export default {
  name: 'CrudilityFormModule',
  components: {
    ConfirmationDialog,
    CrudilityButton,
    KeyboardEvents,
    CrudilityFormGenerator,
    CrudilitySearchInput,
    CrudilitySwitch,
    CrudilityButtonBack,
    CrudilityFormHeader
  },
  props: {
    routeAdapter: {
      type: Object,
      default: () => ({})
    },
    form: {
      type: Object,
      default: () => {}
    },
    fullSchema: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      name: '',
      entityController: new EntityController(),
      formController: new FormController(),
      unsavedChanges: false,
      editPage: true,
      editMode: false
    }
  },
  computed: {
    isFormVisible () {
      return this.formController.isVisible
    }
  },
  async mounted () {
    this.editPage = !isEmpty(this.routeAdapter.getIdentity())
    const entitySchema = isEmpty(this.form.schema) || !this.editPage
            ? this.fullSchema.entities.find(item => item.name === this.routeAdapter.getEntity())
            : this.form.schema
    this.entityController.init(entitySchema)
    this.formController = new FormController(this.fullSchema)
    if (this.editPage) {
      await this.setFormData()
    } else {
      this.formController.options.disableAll = false
    }
    this.transformSchema(entitySchema)
  },
  watch: {
    editMode () {
      if (this.editPage && !this.editMode && this.unsavedChanges) {
        this.onCancel()
      }
      this.formController.options.disableAll = !this.editMode
    },
    unsavedChanges () {
      this.$emit('change', this.unsavedChanges)
    }
  },
  methods: {
    transformSchema (schema) {
      let props, meta
      if (this.editPage) {
        props = this.formController.getAllProperties(schema)
        meta = this.entityController.getMetaFields()
      } else {
        props = this.formController.getMutableProperties(schema)
        meta = this.formController.buildMetaQuery(schema.fk)
      }
      this.formController.setSchema(schema, props, meta)
    },

    onSave() {
      this.editPage ? this.update() : this.create()
    },

    /**
     * Fire on new entity creation
     * If entity form is valid, saves the entity and resets schema
     */
    create () {
      if (this.$refs.formGenerator.$refs.form.validate()) {
        const object = this.entityController.parseForApi()
        this.$emit('operation-wrapper', 'create', {
          entityName: this.entityController.entityName,
          data: object,
          useDefault: true
        }, `${this.entityController.entityName}: `)
      }
    },

    update() {
      const editedData = this.entityController.getEditedData()
      if (isEmpty(editedData)) {
        return
      }
      if (this.$refs.formGenerator.$refs.form.validate()) {
        this.$emit('operation-wrapper', 'update', {
          entityName: this.entityController.entityName,
          identity: this.entityController.identity,
          data: editedData
        }, `${this.entityController.entityName}: `)
      }
    },

    onDelete () {
      this.unsavedChanges = false
      this.$emit('operation-wrapper', 'delete', {
        entityName: this.entityController.entityName,
        identity: this.entityController.identity
      }, `${this.entityController.entityName}: `)
    },

    back () {
      this.$emit('switch-page', 'search')
    },

    async getEntityData () {
      if (isEmpty(this.form.data)) {
        try {
          const responseData = await api.fetchData({
            query: this.getQueryToLoadEntityData()
          })
          return responseData.data.entities[0]
        } catch (e) {
          this.$emit('switch-page', '404')
        }
      } else {
        return this.form.data
      }
    },

    async setFormData () {
      const data = await this.getEntityData()
      this.entityController.setData(data.data, data.identity)
      this.formController.options.context.initialData = cloneDeep(data.data)
    },

    filterProps (value) {
      this.formController.filterProperties(value || '')
      this.entityController.fillFilteredData()
    },

    getQueryToLoadEntityData () {
      let query = this.routeAdapter.getEntity() + ': '
      Object.entries(this.routeAdapter.getIdentity()).map((item) => {
        query += `${item[0]} = "${item[1]}" and `
      })
      return query.slice(0, -4)
    },

    onCancel () {
      this.unsavedChanges = false
      this.entityController.resetObject()
    },

    keyboardEvent (e) {
      if (e.which === 70 && e.ctrlKey) {
        e.preventDefault()
        window.scrollTo(0, 0)
        this.$refs.search.$refs.cInput.$refs.textField.focus()
      }
      if (e.which === 65 && e.ctrlKey) {
        e.preventDefault()
        this.back()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .crudility-form {
    &__buttons {
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;

      button {
        margin-right: 10px;
      }
    }
  }
</style>


<i18n>
{
  "ru": {
    "create": "Создать",
    "update": "Сохранить"
  },
  "en": {
    "create": "Create",
    "update": "Update"
  }
}
</i18n>