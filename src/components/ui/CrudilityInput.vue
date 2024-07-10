<template>
  <v-text-field
    ref="textField"
    class="crudility-input"
    dense
    hide-details="auto"
    single-line
    outlined
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot
      v-for="(_, name) in $slots"
      :name="name"
      :slot="name"
    />
    <template
      v-for="(_, name) in $scopedSlots"
      :slot="name"
      slot-scope="slotData">
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'CrudilityInput'
}
</script>

<style lang="scss">
.crudility-input {
  fieldset {
    border-width: 1px !important;
    border-color: gray;
  }
}

.v-input--is-focused {
  fieldset {
    border-color: var(--primary-color) !important;
  }
}
</style>
