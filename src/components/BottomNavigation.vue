<template>
  <v-bottom-navigation app v-if="show" color="deep-purple" horizontal>
    <v-btn :to="{ name: 'recipe', params: btnToParams }" exact replace>
      <span>Instructions</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn
      :to="{ name: 'recipe/ingredients', params: btnToParams }"
      exact
      replace
    >
      <span>Ingredients</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "BottomNavigation",
  data: function(): {
    scrollPositions: { [key: string]: { y: number; x: number } };
  } {
    return {
      scrollPositions: {}
    };
  },
  computed: {
    show() {
      return (
        this.$route.name &&
        this.$route.name.startsWith("recipe") &&
        this.$vuetify.breakpoint.smAndDown
      );
    },
    btnToParams() {
      return {
        cookbookId: this.$route.params.cookbookId,
        recipeId: this.$route.params.recipeId
      };
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      if (
        from.name &&
        to.name &&
        from.name == "recipe" &&
        to.name == "recipe/ingredients"
      ) {
        this.scrollPositions["recipe"] = {
          x: window.scrollX,
          y: window.scrollY
        };
        if ("recipe/ingredients" in this.scrollPositions) {
          to.meta.scroll = this.scrollPositions["recipe/ingredients"];
        }
      } else if (
        from.name &&
        to.name &&
        from.name == "recipe/ingredients" &&
        to.name == "recipe"
      ) {
        this.scrollPositions["recipe/ingredients"] = {
          x: window.scrollX,
          y: window.scrollY
        };
        if ("recipe" in this.scrollPositions) {
          to.meta.scroll = this.scrollPositions["recipe"];
        }
      } else if (
        from.name &&
        (from.name == "recipe" || from.name == "recipe/ingredients")
      ) {
        console.log("from recipe", window.scrollY);
        this.scrollPositions = {};
      }

      next();
    });
  }
});
</script>
