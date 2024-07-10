<template>
  <crudility-modal
    v-model="dialog"
    max-width="500px"
  >
    <template v-slot:activator="{ on }">
      <crudility-button v-on="on">{{ $t('delete')}}</crudility-button>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('text') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey darken-1"
          text
          @click="dialog = false"
        >
          {{ $t('no') }}
        </v-btn>
        <v-btn
          color="red darken-1"
          text
          @click="confirm"
        >
          {{ $t('yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </crudility-modal>
</template>

<script>
import CrudilityModal from '../ui/CrudilityModal'
import CrudilityButton from '../ui/button/CrudilityButton'
export default {
  name: 'ConfirmationDialog',
  components: {
    CrudilityButton,
    CrudilityModal
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
      this.dialog = false
    }
  }
}
</script>

<style scoped>
  .crudility-button {
    margin-right: 10px;
  }
</style>

<i18n>
{
  "ru": {
    "delete": "Удалить",
    "title": "Подтвердить удаление",
    "content": "Вы уверены, что хотите удалить этот объект?",
    "yes": "Да",
    "no": "Нет",
    "text": "Вы уверены, что хотите удалить этот объект?"
  },
  "en": {
    "delete": "Delete",
    "title": "Confirm deletion",
    "content": "Are you sure you want to delete this item?",
    "yes": "Yes",
    "no": "No",
    "text": "Are you sure you want to delete this item?"
  }
}
</i18n>