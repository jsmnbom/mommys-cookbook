<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    color="blue darken-3"
    dark
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer" v-if="loggedIn" />
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      <span>Mommy's Cookbook</span>
    </v-toolbar-title>

    <v-spacer />

    <v-btn icon @click.stop>
      <v-icon>mdi-github-circle</v-icon>
    </v-btn>

    <v-btn icon @click="toggleDarkTheme">
      <v-icon>mdi-brightness-4</v-icon>
    </v-btn>

    <v-menu offset-y close-on-click v-if="loggedIn">
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on" class="ml-2">
          <v-avatar size="40">
            <img :src="userInfo.photoURL" alt="Avatar" />
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="userInfo.photoURL"></v-img>
          </v-list-item-avatar>
          <div>
            <v-list-item-subtitle>Logged in as</v-list-item-subtitle>
            <v-list-item-title class="subtitle-1">{{
              userInfo.displayName
            }}</v-list-item-title>
          </div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-title class="text-center red--text"
            >Sign out</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

export default Vue.extend({
  name: "Navbar",
  methods: {
    ...mapMutations(["toggleDrawer"]),
    ...mapActions("account", ["login", "logout"]),
    ...mapMutations(["toggleDarkTheme"])
  },
  computed: {
    ...mapState("account", ["loggedIn", "userInfo"])
  }
});
</script>
