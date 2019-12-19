<template>
  <v-fab-transition v-if="show">
    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="accent"
      :class="{ 'mb-12': bottomBarActive }"
      @click="onClick"
      ><v-icon>{{ icon }}</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "ActionButton",
  data: () => ({
    icon: "",
    show: false
  }),
  computed: {
    ...mapState(["actionButton"]),
    bottomBarActive(): boolean {
      return (
        !!this.$route.name &&
        this.$route.name.startsWith("recipe") &&
        this.$vuetify.breakpoint.smAndDown
      );
    }
  },
  created() {
    this.$store.watch(
      state => state.actionButton,
      actionButton => {
        if (!actionButton) {
          this.show = false;
          return;
        }
        if (actionButton) {
          if (this.show) {
            this.show = false;

            setTimeout(() => {
              this.icon = actionButton.icon;
              this.show = true;
            }, 200);
          } else {
            this.icon = actionButton.icon;
            this.show = true;
          }
        }
      }
    );
  },
  methods: {
    onClick() {
      if (this.actionButton.action) {
        this.$store.dispatch(this.actionButton.action);
      } else if (this.actionButton.mutation) {
        this.$store.commit(this.actionButton.mutation);
      }
    }
  }
});
</script>
