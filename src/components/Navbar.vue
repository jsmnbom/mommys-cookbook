<template>
  <nav>
    <md-toolbar class="md-accent" md-elevation="2">
      <md-button class="md-icon-button menu-button" @click="toggleDrawer">
        <md-icon>menu</md-icon>
      </md-button>

      <h3 class="md-title" style="flex: 1">Mommy's Cookbook</h3>

      <md-menu v-if="loggedIn" md-align-trigger>
        <md-button class="md-icon-button" md-menu-trigger>
          <md-avatar>
            <img :src="userPhotoURL" alt="Avatar" />
          </md-avatar>
        </md-button>

        <md-menu-content>
          <div class="author-card">
            <md-avatar class="md-large">
              <img :src="userPhotoURL" alt="Avatar" />
            </md-avatar>
            <div class="author-card-info">
              <span>{{ userDisplayName }}</span>
            </div>
          </div>

          <md-menu-item>
            <md-button class="md-accent logout" @click="logout"
              >Sign out</md-button
            >
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <md-button v-else class="md-primary md-raised" @click="login"
        >Login</md-button
      >
    </md-toolbar>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

export default Vue.extend({
  name: "Navbar",
  methods: {
    ...mapMutations(["toggleDrawer"]),
    ...mapActions(["login", "logout"])
  },
  computed: {
    ...mapGetters(["userPhotoURL", "userDisplayName"]),
    ...mapState(["loggedIn"])
  }
});
</script>

<style lang="stylus" scoped>
h3 {
  text-align: start;
}
.author-card {
  padding: 8px 16px;
  display: flex;
  align-items: center;

  .md-avatar {
    margin-right: 16px;
  }

  .author-card-info {
    display: flex;
    flex-flow: column;
    flex: 1;
  }

  span {
    font-size: 16px;
  }
}
.logout {
  flex: 1;
}
@media (min-width:600px) {
 .menu-button {
  display: none;
 }
}
</style>
