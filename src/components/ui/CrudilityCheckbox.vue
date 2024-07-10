<template>
  <div class="va-checkbox">
    <label class="va-checkbox__content">
      <input
        ref="checkbox"
        type="checkbox"
        class="va-checkbox__input"
        :checked="modelValue"
        :disabled="disabled"
        @change="updateInput"
      >
      <span class="va-checkbox__span"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'CrudilityCheckbox',
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    disabled: Boolean,
    modelValue: {
      default: () => false,
    }
  },
  methods: {
    updateInput(event) {
      this.$emit('change', event.target.checked);
    },
  },
};
</script>

<style lang="scss" scoped>
  .va-checkbox {
    &__content {
      padding-left: 28px;
      color: gray;

      cursor: pointer;
      margin-bottom: 5px;
    }

    &__input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    &__span {
      position: absolute;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      margin-left: -28px;
      border-radius: 3px;
      border: 1px solid var(--primary-color);
    }

    /*Checked*/
    &__input:checked + &__span {
      background-color: var(--primary-color);
    }

    /*Focused*/
    &__input:hover, &__input:focus {
      + &__span {
        border: 1px solid var(--primary-color);
        box-shadow: 0 0 5px 1px var(--primary-color);
      }
    }

    /*Disabled*/
    &__input:disabled + &__span {
      border: 1px solid gray;
    }

    &__input:checked:disabled + &__span {
      background-color: gray;
    }

    &--error &__input + &__span {
      border: 1px solid red;
    }

    &--error &__error {
      color: red;
    }

    &--error &__content {
      color: red;
    }
  }
</style>
