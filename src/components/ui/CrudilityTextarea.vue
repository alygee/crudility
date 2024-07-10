<template>
  <v-textarea
    id="textarea"
    class="crudility-textarea"
    ref="textarea"
    hide-details
    dense
    outlined
    auto-grow
    rows="1"
    autofocus
    spellcheck="false"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #prepend>
      <slot name="prepend"/>
    </template>

    <template #prepend-inner>
      <slot name="prepend-inner"/>
    </template>

    <template #append>
      <slot name="append"/>
    </template>

    <template #append-outer>
      <slot name="append-outer"/>
    </template>
  </v-textarea>
</template>

<script>

export default {
  name: 'CrudilityTextarea'
}
</script>

<style lang="scss">
  .crudility-textarea fieldset {
    border-color: gray !important;
  }

  .crudility-textarea.v-input--is-focused fieldset {
    border-color: var(--primary-color) !important;
  }

  .filter-error .crudility-textarea fieldset {
    border-color: #ff5252 !important;
  }
</style>
