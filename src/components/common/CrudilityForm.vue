<template>
  <div class="crudiliy-form">
    <slot></slot>

    <div class="crudility-form__buttons">
      <crudility-button v-if="showSave" @click="$emit('save')">Сохранить</crudility-button>

      <confirmation-dialog
        v-if="showDelete"
        v-model="showDialog"
        @confirm="$emit('delete')"
      />
    </div>
  </div>
</template>

<script>
import CrudilityButton from '../ui/button/CrudilityButton'
import ConfirmationDialog from '../custom/ConfirmationDialog'
export default {
  name: 'CrudilityForm',
  components: {
    ConfirmationDialog,
    CrudilityButton
  },
  props: {
    showSave: Boolean,
    showDelete: Boolean
  },
  data () {
    return {
      showDialog: false
    }
  }
};
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
