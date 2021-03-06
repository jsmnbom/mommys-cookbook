<template>
  <v-app>
    <router-view name="navbar"> </router-view>
    <CookbooksDrawer v-if="!loading && loggedIn" />
    <v-content class="">
      <LoadingState v-if="loading" />
      <MissingLoginState v-if="!loading && !loggedIn" />
      <CookbookDialog />
      <transition
        v-if="!loading && loggedIn"
        :name="transitionName"
        mode="out-in"
        @before-enter="beforeEnter"
      >
        <router-view :key="routerKey"></router-view>
      </transition>
    </v-content>
    <ActionButton v-if="!loading && loggedIn" />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import CookbooksDrawer from "./components/CookbooksDrawer.vue";
import LoadingState from "./components/LoadingState.vue";
import MissingLoginState from "./components/MissingLoginState.vue";
import ActionButton from "./components/ActionButton.vue";
import CookbookDialog from "./components/CookbookDialog.vue";
import { mapState } from "vuex";

const DEFAULT_TRANSITION = "fade";

export default Vue.extend({
  name: "App",
  metaInfo: {
    title: "Home",
    titleTemplate: "%s - Mommy's Cookbook",
    meta: [
      { name: "description", content: "The app for all your cookbook needs." }
    ]
  },
  computed: {
    ...mapState("account", ["loggedIn"]),
    loading(): boolean {
      return !this.$store.state.account.loaded;
    },
    routerKey(): string {
      let key = "";
      if (this.$route.name) {
        key += this.$route.name;
        if (this.$route.params.cookbookId) {
          key += this.$route.params.cookbookId;
        }
      }
      return key;
    }
  },
  data() {
    return {
      transitionName: DEFAULT_TRANSITION
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName = to.meta.transitionName || from.meta.transitionName;

      this.transitionName = transitionName || DEFAULT_TRANSITION;

      next();
    });
    this.$store.watch(
      state => state.darkTheme,
      darkTheme => {
        this.$vuetify.theme.dark = darkTheme;
      },
      {
        immediate: true
      }
    );
  },
  components: {
    CookbooksDrawer,
    LoadingState,
    MissingLoginState,
    ActionButton,
    CookbookDialog
  },
  mounted() {
    if (this.$vuetify.breakpoint.lgAndUp) {
      this.$store.commit("setDrawer", true);
    }
  },
  methods: {
    beforeEnter() {
      this.$root.$emit("scrollBeforeEnter");
    }
  }
});
</script>

<style>
.mb-actionbutton {
  margin-bottom: 88px;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

body {
  overscroll-behavior-y: contain;
}

</style>
