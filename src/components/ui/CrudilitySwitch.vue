<template>
  <v-switch
    class="crudility-switch"
    :label="$t('edit')"
    v-bind="$attrs"
    v-on="$listeners"
    inset
    :false-value="true"
    hide-details
  >
    <template
      v-for="(_, slotKey) of $scopedSlots"
      v-slot:[slotKey]="scope"
    >
      <slot
        :name="slotKey"
        v-bind="scope"
      />
    </template>
  </v-switch>
</template>

<script>
export default {
  name: 'CrudilitySwitch',
  model: {
    prop: 'inputValue',
    event: 'change',
  },
  props: {},
};
</script>

<style lang="scss">
  .crudility-switch {
    color: red !important;

    label {
      margin-top: 2px;
      white-space: nowrap !important;
      color: black !important;
    }

    &.v-input--selection-controls {
      margin-top: 0;
    }

    .v-input--selection-controls__input {
      margin-right: 0px !important;
    }

    &.primary--text {
      color: var(--primary-color) !important;
    }

    .v-input--switch__thumb {
      box-shadow: 0 2px 4px rgba(120, 130, 162, 0.3);
      border: 1px solid white;
      color: red !important;

      &.primary--text {
        color: var(--primary-color) !important;
      }
    }

    .v-input--selection-controls__ripple {
      &.primary--text {
        color: var(--primary-color) !important;
      }
    }

    &.v-input--switch.v-input--is-dirty .v-input--selection-controls__ripple,
    &.v-input--switch.v-input--is-dirty .v-input--switch__thumb {
      transform: translate(27px, 0) !important;
    }

    .v-input--switch__track {
      width: 43px;
      box-shadow: 0 3px 6px rgba(120, 130, 162, 0.2);
      border: 2px solid red;
      background-image: linear-gradient(110deg, #f6f6f6 0%, white 100%);

      &.primary--text {
        border-color: var(--primary-color) !important;
      }
    }
  }
</style>

<i18n>
{
  "ru": {
    "edit": "Редактировать"
  },
  "en": {
    "edit": "Edit"
  }
}
</i18n>

