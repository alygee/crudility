<template>
  <div>
    <v-form ref="form" v-model="formValid" class="entity-form__form">
      <v-jsonschema-form
        v-bind="$attrs"
        v-on="$listeners"
      >
      </v-jsonschema-form>
    </v-form>
  </div>
</template>

<script>
import VJsonschemaForm from '../vuetify-jsonschema-form/index'

export default {
  name: 'CrudilityFormGenerator',
  components: { VJsonschemaForm },
  data () {
    return {
      formValid: false
    }
  }
};
</script>

<style scoped>

</style>
