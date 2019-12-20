<template>
  <v-col cols="12" sm="6" ref="recipe">
    <v-card dark @click="toRecipe">
      <v-img
        :aspect-ratio="16 / 9"
        :src="img"
        ref="img"
        :gradient="
          $vuetify.theme.dark
            ? 'to bottom, rgba(0,0,0,.2), rgba(0,0,0,.7)'
            : 'to bottom, rgba(0,0,0,.05), rgba(0,0,0,.4)'
        "
      >
        <v-container
          fill-height
          class="align-content-space-between justify-center"
        >
          <v-row justify="space-between">
            <v-col cols="auto" class="pa-0">
              <template v-for="tag in recipe.tags">
                <v-chip
                  class="ma-2"
                  color="#616161AA"
                  v-text="tag"
                  :key="tag"
                ></v-chip>
              </template>
            </v-col>
            <v-spacer />
            <v-col cols="auto" class="pa-0">
              <v-menu close-on-click offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click.stop @mousedown.stop touchstart.stop>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="deleteRecipe">
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>Delete recipe</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
          <v-row
            align="end"
            :class="{
              'justify-space-between': !$vuetify.breakpoint.xsOnly,
              'justify-center': $vuetify.breakpoint.xsOnly
            }"
          >
            <v-col class="pa-0">
              <v-card-title>
                <span
                  :class="{
                    'display-1': $vuetify.breakpoint.mdAndUp,
                    headline: $vuetify.breakpoint.smAndDown
                  }"
                  >{{ recipe.title || "(untitled recipe)" }}</span
                >
              </v-card-title>
              <v-card-subtitle class="pl-5">
                <span v-text="recipe.subtitle" class="subtitle-1"></span>
              </v-card-subtitle>
            </v-col>
            <v-card-actions>
              <v-row align="end" class="flex-column">
                <v-rating
                  class="elevated-rating"
                  :size="$vuetify.breakpoint.lgAndUp ? 32 : 24"
                  dense
                  readonly
                  color="red"
                  background-color="red lighten-1"
                  full-icon="mdi-heart"
                  :length="recipe.ratingTastiness"
                  :value="recipe.ratingTastiness"
                >
                </v-rating>
                <v-rating
                  class="elevated-rating"
                  :size="$vuetify.breakpoint.lgAndUp ? 32 : 24"
                  dense
                  readonly
                  color="green darken-1"
                  background-color="green lighten-4"
                  full-icon="mdi-currency-usd"
                  :length="recipe.ratingCost"
                  :value="recipe.ratingCost"
                ></v-rating>
              </v-row>
            </v-card-actions>
          </v-row>
        </v-container>
      </v-img>

      <div class="d-flex flex-no-wrap justify-space-between">
        <div></div>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import { db, RecipeList, RecipeValue, QuerySnapshot } from "@/firebase";

import { randomImgSrc } from "@/utils";

import { Route } from "vue-router";

export default Vue.extend({
  name: "RecipeListItem",
  props: ["recipe", "cookbookId", "recipeId"],
  computed: {
    img(): string {
      if (this.recipe.thumbURL) {
        return this.recipe.thumbURL;
      }
      return randomImgSrc(this.recipeId, 2);
    }
  },
  methods: {
    async deleteRecipe() {
      await this.$dialog.confirm({
        text: `Do you really want to delete ${this.recipe.title || "(untitled recipe)"}?<br>This action cannot be undone.`,
        title: "",
        actions: {
          false: "No",
          true: {
            color: "red",
            text: "Yes I do",
            handle: this._deleteRecipe
          }
        }
      });
    },
    _deleteRecipe() {
      return new Promise(resolve => {
        console.log("about to delete", this.recipeId)
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

<style scoped>
.elevated-rating .v-icon {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>
