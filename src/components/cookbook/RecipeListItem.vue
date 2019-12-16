<template>
  <v-col cols="12" sm="6" ref="recipe">
    <v-card :color="color" :dark="isDark" :light="!isDark" @click="toRecipe">
      <v-img-cross-origin
        :aspect-ratio="16 / 9"
        :src="img"
        @load="imgLoad"
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
                :class="{
                  'display-1': $vuetify.breakpoint.smAndUp,
                  headline: $vuetify.breakpoint.xsOnly
                }"
                >{{ recipe.title || "(untitled recipe)" }}</span
              >
            </v-card-title>
            <v-card-subtitle class="white--text pl-5">
              <span v-text="recipe.subtitle" class="subtitle-1"></span>
            </v-card-subtitle>
          </v-col>
        </v-container>
      </v-img-cross-origin>

      <div class="d-flex flex-no-wrap justify-space-between">
        <div></div>
      </div>
      <v-card-actions>
        <v-btn text @mousedown.stop="toRecipe">Open</v-btn>
        <v-btn
          text
          :class="{
            'text--darken-3': isDark,
            'text--lighten-1': !isDark
          }"
          color="error"
          @mousedown.stop
          @click.stop="deleteRecipe"
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

<script lang="ts">
import Vue from "vue";
import { db, RecipeList, RecipeValue, QuerySnapshot } from "@/firebase";

import { randomImgSrc } from "@/utils";
import CrossOriginVImg from "@/components/CrossOriginVImg";

import FastAverageColor from "fast-average-color";
import { Route } from "vue-router";

const fac = new FastAverageColor();

export default Vue.extend({
  name: "RecipeListItem",
  props: ["recipe", "cookbookId", "recipeId"],
  components: {
    CrossOriginVImg
  },
  data: () => ({
    color: "#fff",
    isDark: false
  }),
  computed: {
    img(): string {
      if (this.recipe.thumbURL) {
        return this.recipe.thumbURL;
      }
      return randomImgSrc(this.recipeId, 2);
    }
  },
  methods: {
    imgLoad(img: HTMLImageElement) {
      const result = fac.getColor(img);
      this.color = result.hex;
      this.isDark = !result.isDark;
    },

    async deleteRecipe() {
      await this.$dialog.confirm({
        text: `Do you really want to delete ${this.recipe.title}?<br>This action cannot be undone.`,
        title: "",
        actions: {
          false: "No",
          true: {
            color: "red",
            text: "Yes I do",
            handle: () => {
              return this._deleteRecipe;
            }
          }
        }
      });
    },
    async _deleteRecipe() {
      return new Promise(resolve => {
        db.collection("recipes")
          .doc(this.recipeId)
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
    },
    toRecipe() {
      this.$router.push({
        name: "recipe",
        params: { cookbookId: this.cookbookId, recipeId: this.recipeId }
      });
    }
  }
});
</script>
