<template>
  <crudility-input
    ref="cInput"
    class="crudility-search-input"
    :placeholder="$t('find') + ' (Ctrl + F)'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #prepend-inner>
      <crudility-icon name="magnify"/>
    </template>
  </crudility-input>
</template>

<script>
import CrudilityInput from '../ui/CrudilityInput.vue';
import CrudilityIcon from '../ui/CrudilityIcon.vue';

export default {
  name: 'CrudilitySearchInput',
  components: {
    CrudilityIcon,
    CrudilityInput,
  }
};
</script>

<style lang="scss">
  .crudility-search-input {
    margin-left: auto !important;

    .crudility-icon:before {
      color: gray;
    }
  }

  .crudility-search-input.v-input--is-focused {
    .crudility-icon:before {
      color: var(--primary-color);
    }
  }
</style>

<i18n>
{
  "ru": {
    "find": "Найти"
  },
  "en": {
    "find": "Find"
  }
}
</i18n>
