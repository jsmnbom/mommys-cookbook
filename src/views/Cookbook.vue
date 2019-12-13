<template>
  <v-container>
    <v-row>
      <template v-for="(recipe, key) in recipes" ref="recipes">
        <v-col cols="12" sm="6" :key="key">
          <v-card color="#952175" dark @click="toRecipe(key)">
            <v-img
              :aspect-ratio="16 / 9"
              :src="recipeImgs[key].src"
              @load="imgLoad(recipeImgs[key])"
              ref="img"
            ></v-img>

            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="recipe.title"
                ></v-card-title>
                <v-card-subtitle v-text="recipe.subtitle"></v-card-subtitle>
              </div>
            </div>
            <v-card-actions>
              <v-btn text @mousedown.stop="toRecipe(key)">Open</v-btn>
              <v-btn text class="red--text" @mousedown.stop>Delete</v-btn>
              <v-list-item>
                <v-row align="center" justify="end">
                  <v-icon class="mr-1">mdi-heart</v-icon>
                  <span class="subheading mr-2"
                    >{{ recipe.ratings.tastiness }}/10</span
                  >
                  <span class="mr-1">·</span>
                  <v-icon class="mr-1">mdi-currency-usd</v-icon>
                  <span class="subheading">{{ recipe.ratings.cost }}/10</span>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { db, RecipeList, RecipeValue, QuerySnapshot } from "@/firebase";

import FastAverageColor from "fast-average-color";

// @ts-ignore
const fac = new FastAverageColor();

export default Vue.extend({
  name: "Cookbook",
  props: ["cookbookId"],
  computed: {
    recipes(): RecipeList {
      return this.$store.state.recipes[this.cookbookId];
    },
    recipeImgs(): { [id: string]: HTMLImageElement } {
      return Object.fromEntries(
        Object.entries(this.recipes).map(
          ([key, recipe]: [string, RecipeValue]) => {
            const doc = new DOMParser().parseFromString(
              recipe.content,
              "text/html"
            );
            let docImg = doc.querySelector("img");
            const img = document.createElement("img");
            if (docImg) {
              img.src = docImg.src;
            } else {
              img.src = `https://avatars.dicebear.com/v2/bottts/${key}.svg`;
            }
            return [key, img];
          }
        )
      );
    }
  },
  methods: {
    fetchRecipes() {
      this.$store.dispatch("fetchRecipes", this.cookbookId);
    },
    imgLoad(img: HTMLImageElement) {
      //console.log(img.naturalHeight, img.naturalWidth)
      //console.log(fac.getColor(img));
    },
    toRecipe(recipeId: string) {
      this.$router.push({
        name: "recipe",
        params: { cookbookId: this.cookbookId, recipeId }
      });
    },
    createNew() {
      console.log("create");
    }
  },
  watch: {
    $route(to: any) {
      this.fetchRecipes();
    }
  },
  created() {
    this.fetchRecipes();
  },
  mounted() {
    this.$store.commit("setActionButton", "createRecipe");
  },
  beforeDestroy() {
    this.$store.commit("setActionButton", null);
  }
});
</script>
