<template>
  <v-tooltip
    class="crudility-tooltip"
    top
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"/>
    </template>
    <slot/>
  </v-tooltip>
</template>

<script>
export default {
  name: 'CrudilityTooltip'
};
</script>
