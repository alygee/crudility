<template>
  <div class="crudility-options">
    <v-card
      class="mx-auto"
      elevation="6"
      tile
    >
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            v-on="{
              ...$listeners,
              click: () => $emit('click', item)
            }"
          >
            {{ item }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "CrudilityOptions",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
  .crudility-options {
    position: absolute;
    left: 55px;
    z-index: 1;
    width: 300px;
  }

  .v-card {
    max-height: 70vh;
    overflow: auto;
  }
</style>
