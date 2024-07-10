<template>
  <v-autocomplete
    class="crudility-autocomplete"
    hide-details
    single-line
    outlined
    dense
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'CrudilityAutocomplete',
  props: {},
};
</script>

<style lang="scss" scoped>
  .crudility-autocomplete {
    fieldset {
      border-color: gray !important;
    }
  }

  .crudility-autocomplete.v-input--is-focused {
    fieldset {
      border-color: var(--primary-color) !important;
    }
  }
</style>
