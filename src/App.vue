<template>
  <v-app>
    <Navbar />
    <CookbooksDrawer v-if="!loading && loggedIn" />
    <v-content>
      <LoadingState v-if="loading" />
      <MissingLoginState v-if="!loading && !loggedIn" />
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import CookbooksDrawer from "./components/CookbooksDrawer.vue";
import Navbar from "./components/Navbar.vue";
import LoadingState from "./components/LoadingState.vue";
import MissingLoginState from "./components/MissingLoginState.vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "App",
  computed: {
    ...mapState(["loggedIn"]),
    loading() {
      return !this.$store.state.authLoaded;
    }
  },
  components: {
    CookbooksDrawer,
    Navbar,
    LoadingState,
    MissingLoginState
  }
});
</script>

<style>
.v-avatar > img {
  width: 100% !important;
  height: 100% !important;
}
</style>
