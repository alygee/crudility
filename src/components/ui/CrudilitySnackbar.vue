<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="-1"
    :color="snackbar.status"
    style="opacity: 0.9"
    top
    right
  >
    <div @click="$emit('hide')">
      {{ snackbar.message }}
    </div>
  </v-snackbar></template>
<script>
export default {
  name: 'CrudilitySnackbar',
  props: {
    snackbar: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'snackbar.visible' (value) {
      if (value) {
        setTimeout(() => { this.$emit('hide') }, 6000)
      }
    }
  }
}
</script>

<style scoped>

</style>