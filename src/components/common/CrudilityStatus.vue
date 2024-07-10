<template>
  <crudility-tooltip
    :value="show"
    :disabled="status"
    :color="statuses[value].color"
  >
    <template v-slot:activator="{ on }">
      <div class="crudility-status" v-on="on">
        <crudility-icon
          class="crudility-status__icon"
          :color="statuses[value].color"
          :name="statuses[value].name"
        />
      </div>
    </template>

    <span>
      {{ message }}
    </span>
  </crudility-tooltip>
</template>

<script>
import CrudilityIcon from "../ui/CrudilityIcon.vue";
import CrudilityTooltip from "../ui/CrudilityTooltip";

export default {
  name: "CrudilityStatus",
  components: {
    CrudilityTooltip,
    CrudilityIcon
  },
  props: {
    status: {
      type: Boolean
    },
    message: {
      type: String
    }
  },
  data() {
    return {
      show: false,
      statuses: {
        success: {
          name: "check-circle-outline",
          color: "#ff6347"
        },
        error: {
          name: "alert-circle-outline",
          color: "error"
        }
      }
    };
  },
  watch: {
    status(value) {
      this.show = !value;
      if (this.show) {
        setTimeout(() => {
          this.show = false;
        }, 3000);
      }
    }
  },
  computed: {
    value() {
      return this.status ? "success" : "error";
    }
  }
};
</script>

<style lang="scss">
.crudility-status {
  &__icon {
    font-size: 40px !important;
  }
}
</style>
