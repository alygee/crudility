<template>
  <v-app id="inspire">
    <nav class="crudility">
      <div class="upper" />
      <div class="lower" />
    </nav>
    <v-main>
      <crudility
        :route-adapter="routeAdapter"
        :style="{
          '--primary-color': 'tomato',
          '--wrapper-margin': '0px'
        }"
      />
    </v-main>
  </v-app>
</template>

<script>
/**
 * Run crudility as library
 */
// import 'crudility/Crudility.css'
// import { Crudility } from 'crudility'
/**
 * Run crudility project for development
 */
import Crudility from "./components/Crudility.vue";

import RouteAdapter from "./assets/js/RouteAdapter";

export default {
  name: "App",
  components: { Crudility },
  computed: {
    routeAdapter() {
      return new RouteAdapter(this.$route, this.$router);
    }
  }
};
</script>

<style lang="scss">
.upper {
  height: 50px;
  background-color: tomato;
}

.lower {
  height: 35px;
  background-color: #ffffff;
}

.v-main {
  background-color: #f1f2f2;
}
</style>
