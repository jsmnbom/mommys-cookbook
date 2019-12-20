<template>
  <DefaultNavbar :extended="tabbed">
    <v-toolbar-title class="ml-0 pl-4">
      <span>Mommy's Cookbook</span>
    </v-toolbar-title>
    <v-spacer />

    <template v-slot:extension v-if="tabbed">
      <v-tabs
        v-model="activeTab"
        centered
        slider-color="accent"
        color="#fff"
        background-color="transparent"
      >
        <v-tab href="#content">
          Instructions
        </v-tab>
        <v-tab href="#ingredients">
          Ingredients
        </v-tab>
      </v-tabs>
    </template>
  </DefaultNavbar>
</template>

<script lang="ts">
import Vue from "vue";

import DefaultNavbar from "@/components/DefaultNavbar.vue";

export default Vue.extend({
  name: "RecipeNavbar",
  components: {
    DefaultNavbar
  },
  data: () => ({
    scroll: {} as { [key: string]: number }
  }),
  computed: {
    tabbed(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
    activeTab: {
      get() {
        return this.$store.state.recipeActiveTab;
      },
      set(recipeActiveTab) {
        this.$store.commit("setRecipeActiveTab", recipeActiveTab);
      }
    }
  },
});
</script>

<style scoped></style>
