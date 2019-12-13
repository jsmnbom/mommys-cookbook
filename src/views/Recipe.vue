<template>
  <v-container v-if="recipe">
    <v-card v-if="hasBottomNav && ingredients">
      <IngredientsList :value="recipe.ingredients" />
    </v-card>
    <v-card v-else-if="hasBottomNav">
      <RecipeContent :value="recipe" />
    </v-card>

    <v-row align="start" justify="space-around" v-else>
      <v-col cols="8">
        <v-card class="pa-4">
          <RecipeContent :value="recipe" />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <IngredientsList :value="recipe.ingredients" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import IngredientsList from "@/components/IngredientsList.vue";
import RecipeContent from "@/components/RecipeContent.vue";
import { RecipeList } from "@/firebase";

export default Vue.extend({
  name: "Recipe",
  props: ["cookbookId", "recipeId", "ingredients"],
  components: {
    IngredientsList,
    RecipeContent
  },
  computed: {
    hasBottomNav() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    recipes(): RecipeList {
      return this.$store.state.recipes[this.cookbookId] || null;
    },
    recipe() {
      // @ts-ignore
      return this.recipes && this.recipeId in this.recipes
        ? //
          // @ts-ignore
          this.recipes[this.recipeId]
        : null;
    },
    ...mapState(["cookbooks", "bottomNavActive"])
  },
  mounted() {
    if (!this.recipes) {
      this.$store.dispatch("fetchRecipes", this.cookbookId);
    }
    this.$store.commit("setActionButton", "editRecipe");
  },
  beforeDestroy() {
    this.$store.commit("setActionButton", null);
  }
});
</script>
