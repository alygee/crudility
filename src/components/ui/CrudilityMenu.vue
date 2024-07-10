<template>
  <v-menu>
    <template #activator="props">
      <slot
        name="activator"
        v-bind="props"
      />
    </template>
    <slot/>
  </v-menu>
</template>

<script>
export default {
  name: 'CrudilityMenu',
  props: {},
};
</script>

<style scoped>

</style>
