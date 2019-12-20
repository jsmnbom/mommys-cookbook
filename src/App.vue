<template>
  <v-app>
    <router-view name="navbar"> </router-view>
    <CookbooksDrawer v-if="!loading && loggedIn" />
    <v-content class="">
      <LoadingState v-if="loading" />
      <MissingLoginState v-if="!loading && !loggedIn" />
      <CookbookDialog />
      <transition
        :name="transitionName"
        mode="out-in"
        @before-enter="beforeEnter"
      >
        <router-view :key="routerKey"></router-view>
      </transition>
    </v-content>
    <ActionButton />
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
    titleTemplate: "%s - Mommy's Cookbook"
  },
  computed: {
    ...mapState("account", ["loggedIn"]),
    loading() {
      return !this.$store.state.account.loaded;
    },
    routerKey() {
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

      if (transitionName === "slide") {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
      }
      // @ts-ignore
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
  margin-bottom: 96px;
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
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
