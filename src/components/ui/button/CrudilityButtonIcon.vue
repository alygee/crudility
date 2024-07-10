<template>
  <button
    class="crudility-button-icon"
    icon
    v-on="$listeners"
    v-bind="$attrs"
  >
    <crudility-icon
      class="crudility-button-icon__icon"
      :name="iconName"
    />
  </button>
</template>

<script>
import CrudilityIcon from '../CrudilityIcon.vue';

export default {
  name: 'CrudilityButtonIcon',
  components: { CrudilityIcon },
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .crudility-button-icon {
    &__icon {
      border: 1px solid #dadada;
      border-radius: 25px;
      &:before {
        color: #dadada;
      }

      &:hover {
        border: 1px solid var(--primary-color);
        border-radius: 25px;
        &:before {
          color: var(--primary-color);
        }
      }
    }
  }
</style>
