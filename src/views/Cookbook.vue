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
              :gradient="
                $vuetify.theme.dark
                  ? 'to bottom, rgba(0,0,0,.2), rgba(0,0,0,.7)'
                  : 'to bottom, rgba(0,0,0,.05), rgba(0,0,0,.4)'
              "
            >
              <v-container fill-height class="align-end pa-0">
                <v-col class="pa-0">
                  <v-card-title class="white--text">
                    <span
                      v-text="recipe.title"
                      :class="{
                        'display-1': $vuetify.breakpoint.smAndUp,
                        headline: $vuetify.breakpoint.xsOnly
                      }"
                    ></span>
                  </v-card-title>
                  <v-card-subtitle class="white--text pl-5">
                    <span v-text="recipe.subtitle" class="subtitle-1"></span>
                  </v-card-subtitle>
                </v-col>
              </v-container>
            </v-img>

            <div class="d-flex flex-no-wrap justify-space-between">
              <div></div>
            </div>
            <v-card-actions>
              <v-btn text @mousedown.stop="toRecipe(key)">Open</v-btn>
              <v-btn
                text
                class="red--text"
                @mousedown.stop
                @click.stop="deleteRecipe(key)"
              >
                Delete</v-btn
              >
              <v-divider />
              <v-list-item class="flex-column align-end pr-1 justify-center">
                <v-rating
                  dense
                  size="24"
                  readonly
                  color="red"
                  background-color="red lighten-1"
                  full-icon="mdi-heart"
                  :length="recipe.ratingTastiness"
                  :value="recipe.ratingTastiness"
                ></v-rating>
                <v-rating
                  dense
                  size="24"
                  readonly
                  color="green darken-1"
                  background-color="green lighten-4"
                  full-icon="mdi-currency-usd"
                  :length="recipe.ratingCost"
                  :value="recipe.ratingCost"
                ></v-rating>
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

import { randomImgSrc } from "@/utils";

import FastAverageColor from "fast-average-color";
import { Route } from "vue-router";

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
            const img = document.createElement("img");
            if (recipe.thumbURL) {
              img.src = recipe.thumbURL;
            } else {
              img.src = randomImgSrc(key, 2);
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
    },
    async deleteRecipe(recipeId: string) {
      await this.$dialog.confirm({
        text: `Do you really want to delete ${this.recipes[recipeId].title}?<br>This action cannot be undone.`,
        title: "",
        actions: {
          false: "No",
          true: {
            color: "red",
            text: "Yes I do",
            handle: () => {
              return this._deleteRecipe(recipeId);
            }
          }
        }
      });
    },
    async _deleteRecipe(recipeId: string) {
      return new Promise(resolve => {
        db.collection("recipes")
          .doc(recipeId)
          .delete()
          .then(() => {
            this.$dialog.message.info("Recipe deleted", {
              position: "bottom"
            });
            console.log("Recipe deleted!");
            resolve();
          })
          .catch(error => {
            this.$dialog.message.error("Error deleting recipe", {
              position: "bottom"
            });
            resolve();
            console.error(`Error deleting recipe:`, error);
          });
      });
    }
  },
  watch: {
    $route(to: Route, from: Route) {
      if (to.name && to.name == "cookbook") {
        this.fetchRecipes();
        this.$store.commit("setCurrentCookbookId", this.cookbookId);
      }
      if (from.name && from.name == "cookbook") {
        this.$store.commit("setCurrentCookbookId", null);
      }
    }
  },
  created() {
    this.fetchRecipes();
    this.$store.commit("setCurrentCookbookId", this.cookbookId);
  },
  mounted() {
    this.$store.commit("setActionButton", {
      icon: "mdi-plus",
      action: "createRecipe"
    });
  },
  beforeDestroy() {
    this.$store.commit("setActionButton", null);
  }
});
</script>
