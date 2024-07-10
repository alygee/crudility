<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-tooltip
    v-if="htmlDescription"
    v-model="show"
    left
    content-class="vjsf-tooltip"
  >
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-btn icon>
          <v-icon> {{ options.icons.info }} </v-icon>
        </v-btn>
      </div>
    </template>
    <div :style="`max-width: ${maxWidth}px`" v-html="htmlDescription" />
  </v-tooltip>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['htmlDescription', 'options'],
  data () {
    return {
      show: false,
      maxWidth: 200
    }
  },
  mounted () {
    if (!this.htmlDescription) { return }
    this.maxWidth = this.$el.getBoundingClientRect().left - 80
  }
}
</script>

<style lang="css" scoped>
  .vjsf-tooltip {
    margin: auto 9px !important;
  }
</style>
