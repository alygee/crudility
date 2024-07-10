<template>
  <div class="col crudility-jql-filter">
    <keyboard-events @keydown="keyboardEvent"/>
    <crudility-textarea
      ref="cTextarea"
      v-custom-click-outside="''"
      v-model="inputValue"
      @input="onInputChange"
      @click="dOptions.isVisible = true"
      @keydown="onKeyDown"
    >
      <!-- Pass on all named slots -->
      <slot
        v-for="slot in Object.keys($slots)"
        :name="slot"
        :slot="slot"
      />

      <!-- Pass on all scoped slots -->
      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />
      </template>
    </crudility-textarea>
    <crudility-options
      v-if="dOptions.isVisible && !loading"
      ref="cOptions"
      v-custom-click-outside="'textarea'"
      :items="dOptions.items"
      @keydown="onKeyDown"
      @click="onOptionClick"
    ></crudility-options>
  </div>
</template>

<script>
import CrudilityTextarea from '../ui/CrudilityTextarea.vue'
import CrudilityOptions from './CrudilityOptions'
import FocusState from '../../assets/js/enum/FocusState'
import KeyboardEvents from "../custom/KeyboardEvents";

export default {
  name: 'CrudilityJqlFilter',
  components: {
    KeyboardEvents,
    CrudilityOptions,
    CrudilityTextarea
  },
  directives: {
    'custom-click-outside': {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = (event) => {
          const target = event.target
          if (!el.contains(target) && binding.value !== target.id) {
            vnode.context.dOptions.isVisible = false
          }
        }
        document.documentElement.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.documentElement.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
  props: {
    dOptions: {
      type: Object,
      default: () => {}
    },
    loading: Boolean,
    line: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputValue: '',
      focusPosition: FocusState.initialState
    }
  },
  watch: {
    dOptions () {
      if (this.dOptions.isVisible) {
        this.focusPosition = -1
      }
    },
    line () {
      this.inputValue = this.line
    }
  },
  methods: {
    onFocusChange (keyCode) {
      if (!this.dOptions.isVisible) { return }
      const lastIndex = this.dOptions.items.length - 1
      const currentIndex = this.focusPosition
      this.focusPosition = FocusState.getNextState(currentIndex, keyCode, lastIndex)
      if (this.focusPosition === FocusState.initialState) {
        this.focusOnInput()
        return
      }
      this.focusOnListItem(this.focusPosition)
    },

    focusOnInput () {
      this.$refs.cTextarea.$refs.textarea.focus()
    },

    focusOnListItem (index) {
      this.$refs.cOptions.$el.getElementsByClassName('v-list-item')[index].focus()
    },

    onOptionClick (value) {
      this.$emit('option-click', value)
      setTimeout(() => {
        this.focusOnInput()
        this.focusPosition = FocusState.initialState
      }, 200)
    },

    onInputChange (value) {
      this.$emit('input-field-change', value)
    },

    onKeyDown (event) {
      // disable new line in textarea when pressed ENTER
      if (event.keyCode === 13 && this.$refs.cTextarea.$refs.textarea.isFocused) {
        event.preventDefault()
        this.$emit('search', this.inputValue + ' ')
      }
      // catch arrow or tab click
      if (FocusState.isArrowOrTab(event.keyCode)) {
        event.preventDefault()
        this.onFocusChange(event.keyCode)
      }
    },

    /**
     * Short keys:
     *    Ctrl+Space, textarea focused   show options
     *    Esc                            hide options
     *    Ctrl+X                         clear input
     * @param e
     */
    keyboardEvent (e) {
      if (e.which === 27) {
        e.preventDefault()
        this.dOptions.hidden = !this.dOptions.hidden
      }
      if (e.which === 32 && e.ctrlKey && this.$refs.cTextarea.$refs.textarea.isFocused) {
        e.preventDefault()
        this.dOptions.isVisible = true
        this.dOptions.hidden = false
      }
      if (e.which === 88 && e.ctrlKey) {
        e.preventDefault()
        this.onInputChange('')
      }
    }
  }
};
</script>

<style lang="scss">
  .crudility-jql-filter {
    padding: 0 !important;
    position: relative;
    margin-bottom: 10px;

    .v-input__append-outer {
      margin-top: 0 !important;
      position: relative;
      display: block;
      height: 100% !important;
    }
  }
</style>

