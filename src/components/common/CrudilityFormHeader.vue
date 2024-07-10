<template>
  <div class="crudility-header">
    <div class="crudility-header__content">
      <slot></slot>
    </div>
    <v-divider class="crudility-header__divider"/>
  </div>
</template>

<script>
export default {
  name: 'CrudilityHeader',
};
</script>

<style scoped lang="scss">
  .crudility-header {
    &__content {
      display: flex;
      align-items: baseline;
      padding: 10px 10px 10px 5px;
    }

    &__title {
      color: var(--primary-color);
      text-transform: uppercase;
      font-weight: bold;
      text-align: center;
    }

    &__title, &__edit {
      padding: 0;
    }

    &__divider {
      border-top: 2px solid;
      margin: 10px 0 10px -12px !important;
      width: calc(100% + 24px) !important;
      max-width: none;
    }
  }
</style>
