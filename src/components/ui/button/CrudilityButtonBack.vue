<template>
  <button
    class="crudility-button-back"
    depressed
    v-on="$listeners"
    v-bind="$attrs"
  >
    <crudility-icon
      class="crudility-button-back__icon"
      name="chevron-left"
    />
    {{ $t('back') }}
  </button>
</template>

<script>
import CrudilityIcon from '../CrudilityIcon.vue';

export default {
  name: 'CrudilityButtonBack',
  components: { CrudilityIcon },
};
</script>

<style lang="scss" scoped>
  .crudility-button-back {
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 1px 4px 0px 5px;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: #000000;

    &::first-letter {
      text-transform: uppercase;
    }

    &:focus {
      outline:0
    }

    &__icon {
      color: var(--primary-color) !important;
      font-size: 22px;
    }
  }
</style>

<i18n>
{
  "ru": {
    "back": "Назад"
  },
  "en": {
    "back": "Back"
  }
}
</i18n>
