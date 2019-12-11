<template>
  <div id="app">
    <Navbar class='header' />
    <LoadingState v-if="!authLoaded" />
    <MissingLoginState v-if="!loggedIn && authLoaded" />
    <div class="page-container md-layout-columns">
      <CookbooksDrawer v-if="loggedIn && authLoaded" />
      <main
        v-if="loggedIn && authLoaded"
      >
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "./components/Navbar.vue";
import MissingLoginState from "./components/MissingLoginState.vue";
import LoadingState from "./components/LoadingState.vue";
import CookbooksDrawer from "./components/CookbooksDrawer.vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "app",
  components: {
    Navbar,
    MissingLoginState,
    LoadingState,
    CookbooksDrawer
  },
  computed: {
    ...mapState(["loggedIn", "authLoaded"])
  }
});
</script>

<style>
html,
body {
  height: 100%;
  margin: 0
}

#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  height: 100%;
  flex-flow: column;
}
.header {
  flex: 0 1 auto;
}
.page-container {
  min-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
}
.page-container .md-drawer {
  flex: 1;
  max-width: 400px;
}
.page-container main {
  flex: 1;
  flex-grow: 1;
}
</style>
