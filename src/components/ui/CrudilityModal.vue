<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #activator="props">
      <slot
        name="activator"
        v-bind="props"
      />
    </template>
    <div class="crudility">
      <slot/>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'CrudilityModal'
}
</script>

<style scoped>

</style>
