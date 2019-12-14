<template>
  <v-app>
    <Navbar />
    <CookbooksDrawer v-if="!loading && loggedIn" />
    <BottomNavigation v-if="!loading && loggedIn" />
    <v-content>
      <LoadingState v-if="loading" />
      <MissingLoginState v-if="!loading && !loggedIn" />
      <CookbookDialog />
      <transition
        :name="transitionName"
        mode="out-in"
        @before-enter="beforeEnter"
      >
        <keep-alive>
          <router-view :key="routerKey"></router-view>
        </keep-alive>
      </transition>
    </v-content>
    <ActionButton />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import CookbooksDrawer from "./components/CookbooksDrawer.vue";
import Navbar from "./components/Navbar.vue";
import LoadingState from "./components/LoadingState.vue";
import MissingLoginState from "./components/MissingLoginState.vue";
import BottomNavigation from "./components/BottomNavigation.vue";
import ActionButton from "./components/ActionButton.vue";
import CookbookDialog from "./components/CookbookDialog.vue";
import { mapState } from "vuex";

const DEFAULT_TRANSITION = "fade";

export default Vue.extend({
  name: "App",
  computed: {
    ...mapState(["loggedIn"]),
    loading() {
      return !this.$store.state.authLoaded;
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
  },
  components: {
    CookbooksDrawer,
    Navbar,
    LoadingState,
    MissingLoginState,
    BottomNavigation,
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
