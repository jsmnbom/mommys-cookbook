<template>
  <v-container>
    <v-row dense>
      <template v-for="(recipe, key) in recipes" ref="recipes">
        <v-col cols="6" :key="key">
          <v-card color="#385F73" dark>
            <v-img
              height="250"
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
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { db, RecipeList, RecipeValue, QuerySnapshot } from "@/firebase";

import FastAverageColor from 'fast-average-color';

// @ts-ignore
const fac = new FastAverageColor();

export default Vue.extend({
  name: "Cookbook",
  computed: {
    recipes(): RecipeList {
      const cookbookId = this.$route.params.id;
      return this.$store.state.recipes[cookbookId];
    },
    recipeImgs(): {[id: string]: HTMLImageElement} {
      console.log("computing");
      return Object.fromEntries(
        Object.entries(this.recipes).map(([key, recipe]: [string, RecipeValue]) => {
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
        })
      );
    }
  },
  methods: {
    fetchRecipes() {
      const cookbookId = this.$route.params.id;
      this.$store.commit("clearRecipes", cookbookId);
      const inner = (querySnapshot: QuerySnapshot) => {
        this.$store.commit("setRecipes", {
          cookbookId,
          recipes: querySnapshot.docs.reduce((map: RecipeList, doc) => {
            const data = doc.data();
            const cookbook = RecipeValue.fromObject(data);
            map[doc.id] = cookbook;
            return map;
          }, {})
        });
      };
      db.collection("recipes")
        .where("cookbookId", "==", cookbookId)
        .onSnapshot(inner);
    },
    imgLoad(img: HTMLImageElement) {
      //console.log(img.naturalHeight, img.naturalWidth)
      //console.log(fac.getColor(img));
    }
  },
  watch: {
    $route(to: any) {
      this.fetchRecipes();
    }
  },
  created() {
    this.fetchRecipes();
  }
});
</script>
