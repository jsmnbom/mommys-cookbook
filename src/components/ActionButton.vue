<template>
  <v-fab-transition v-if="actionButton != null">
    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="pink"
      :class="{ 'mb-12': bottomBarActive }"
      @click="onClick"
      ><v-icon>{{icon}}</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "ActionButton",
  computed: {
    ...mapState(["actionButton"]),
    icon() {
      if (this.actionButton == 'editRecipe') {
        return 'mdi-pencil-outline'
      } else if (this.actionButton == 'createRecipe') {
        return 'mdi-plus'
      }
    },
    bottomBarActive() {
      return (
        this.$route.name &&
        this.$route.name.startsWith("recipe") &&
        this.$vuetify.breakpoint.smAndDown
      );
    }
  },
  methods: {
    onClick() {
      this.$store.commit(this.actionButton)
    }
  }
});
</script>
