<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    color="blue darken-3"
    dark
    elevate-on-scroll
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer" v-if="loggedIn" />

    <slot>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span>Mommy's Cookbook</span>
      </v-toolbar-title>
    </slot>

    <v-spacer v-if="$vuetify.breakpoint.smAndUp"/>

    <template v-if="$vuetify.breakpoint.smAndUp">
        <div>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-github-circle</v-icon>
          </v-btn>
        </template>
        <span>View project on github</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="toggleDarkTheme">
            <v-icon>mdi-brightness-4</v-icon>
          </v-btn>
        </template>
        <span>Toggle dark theme</span>
      </v-tooltip>

      <v-menu offset-y close-on-click v-if="loggedIn">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="ml-2">
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
          <v-divider />
          <v-list-item @click="logout">
            <v-list-item-title class="text-center red--text"
              >Sign out</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
        </div>
    </template>
    <v-menu offset-y close-on-click v-else>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-if="loggedIn">
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
        <v-divider />
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-github-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-title>View project on github</v-list-item-title>
        </v-list-item>
        <v-list-item @click="toggleDarkTheme">
          <v-list-item-icon><v-icon>mdi-brightness-4</v-icon></v-list-item-icon>
          <v-list-item-title>Toggle dark theme</v-list-item-title>
        </v-list-item>

        <v-divider />
        <v-list-item @click="logout" v-if="loggedIn">
          <v-list-item-title class="text-center red--text"
            >Sign out</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
    <template #extension v-if="extended">
        <slot name="extension"></slot>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

export default Vue.extend({
  name: "DefaultNavbar",
  props: { extended: { type: Boolean, default: () => false } },
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
