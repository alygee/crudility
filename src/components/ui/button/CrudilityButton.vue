<template>
  <button
    class="crudility-button"
    depressed
    v-on="$listeners"
    v-bind="$attrs"
  >
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'CrudilityButton',
};
</script>

<style lang="scss" scoped>
  .crudility-button {
    border-radius: 5px;
    padding: 5px 19px 4px 20px;
    background-color: var(--primary-color) !important;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    line-height: 13px;
    text-transform: initial !important;
    height: 40px;
    align-self: center;

    &::first-letter {
      text-transform: uppercase !important;
    }

    &:focus {
      outline:0
    }
  }
</style>
