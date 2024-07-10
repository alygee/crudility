<template>
  <div />
</template>

<script>
export default {
  name: 'KeyboardEvents',
  created () {
    const component = this
    this.handler = function (e) {
      component.$emit('keydown', e)
    }
    window.addEventListener('keydown', this.handler)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handler)
  }
}
</script>

<style scoped>
    div {
        display: none;
    }
</style>
