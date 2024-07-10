<template>
  <v-icon
    class="crudility-icon"
    v-bind="$attrs"
    v-on="$listeners"
  >
    mdi-{{name}}
  </v-icon>
</template>

<script>
export default {
  name: 'CrudilityIcon',
  props: {
    name: {
      type: String,
      required: true,
    }
  }
};
</script>
