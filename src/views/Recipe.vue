<template>
  <v-form ref="form" lazy-validation v-model="valid" v-if="recipe">
    <v-container v-if="editedRecipe">
      <RecipeIngredientsList
        v-if="hasBottomNav && ingredients"
        v-bind.sync="editedRecipe"
        :saving="saving"
        @update:addIngredientsText="addIngredientsText = $event"
      />
      <RecipeContent
        v-else-if="hasBottomNav"
        :saving="saving"
        v-bind.sync="editedRecipe"
        :recipeId="recipeId"
        @update:imgFile="imgFile = $event"
      />

      <v-row align="start" justify="space-around" v-else>
        <v-col cols="8">
          <RecipeContent
            :saving="saving"
            v-bind.sync="editedRecipe"
            :recipeId="recipeId"
            @update:imgFile="imgFile = $event"
          />
        </v-col>
        <v-col cols="4">
          <RecipeIngredientsList
            v-bind.sync="editedRecipe"
            @update:addIngredientsText="addIngredientsText = $event"
            :saving="saving"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { Route } from "vue-router";
import { v4 as uuid } from "uuid";

import RecipeIngredientsList from "@/components/recipe/RecipeIngredientsList.vue";
import RecipeContent from "@/components/recipe/RecipeContent.vue";
import { RecipeValue, RecipeList, db } from "@/firebase";
import { compressImage, uploadFile } from "@/utils";

export default Vue.extend({
  name: "Recipe",
  props: ["cookbookId", "recipeId", "ingredients"],
  data: () => ({
    editedRecipe: null as RecipeValue | null,
    saving: false,
    valid: false,
    imgFile: null as File | null,
    uploadProgress: 0 as number | null,
    addIngredientsText: ""
  }),
  components: {
    RecipeIngredientsList,
    RecipeContent
  },
  computed: {
    hasBottomNav(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
    recipes(): RecipeList {
      return this.$store.state.recipes[this.cookbookId] || null;
    },
    recipe(): RecipeValue | null {
      return this.recipes && this.recipeId in this.recipes
        ? this.recipes[this.recipeId]
        : null;
    },
    ...mapState(["cookbooks", "bottomNavActive"])
  },
  mounted() {
    if (!this.recipe) {
      this.$store.dispatch("fetchRecipes", this.cookbookId);
    } else {
      (this.$refs.form as any).reset();
      this.imgFile = null;
      this.addIngredientsText = "";
      this.editedRecipe = RecipeValue.fromObject(this.recipe!.toObject());
    }
    this.updateActionButton();
    this.$store.watch(
      state => state.editingRecipe,
      async editingRecipe => {
        this.updateActionButton();
        if (!editingRecipe) {
          this.saving = true;

          const editedRecipeObject = this.editedRecipe!.toObject();

          if (this.imgFile) {
            editedRecipeObject.thumbURL = await this.handleImage();
          }

          if (this.addIngredientsText) {
            editedRecipeObject.ingredients = [
              ...editedRecipeObject.ingredients,
              ...this.addIngredientsText
                .split(/\r?\n/)
                .map(ingredient => ingredient.trim())
            ];
          }

          if (editedRecipeObject !== this.recipe!.toObject()) {
            editedRecipeObject.lastEdited = new Date();
            db.collection("recipes")
              .doc(this.recipeId)
              .update(editedRecipeObject)
              .then(() => {
                this.$dialog.message.info("Recipe updated", {
                  position: "bottom"
                });
                this.saving = false;
              })
              .catch(error => {
                this.$dialog.message.error("Error updating recipe", {
                  position: "bottom"
                });
                console.error(`Error updating recipe:`, error);
                this.saving = false;
              });
          }
        }
      }
    );
  },
  watch: {
    $route(to: Route, from: Route) {
      if (to.name && to.name.startsWith("recipe")) {
        this.updateActionButton();
      }
    },
    recipe() {
      if (this.recipe) {
        if (this.$refs.form) (this.$refs.form as any).reset();
        this.imgFile = null;
        this.addIngredientsText = "";
        this.editedRecipe = RecipeValue.fromObject(this.recipe!.toObject());
      }
    }
  },
  beforeDestroy() {
    this.$store.commit("setActionButton", null);
  },
  methods: {
    updateActionButton() {
      if (this.$store.state.editingRecipe) {
        this.$store.commit("setActionButton", {
          icon: "mdi-check",
          mutation: "saveRecipe"
        });
      } else {
        this.$store.commit("setActionButton", {
          icon: "mdi-pencil-outline",
          mutation: "editRecipe"
        });
      }
    },
    async handleImage(): Promise<string> {
      const blob = await compressImage(this.imgFile!, {
        width: 1280,
        height: 720
      }).catch(error => {
        this.$dialog.message.error("Error uplading image", {
          position: "bottom"
        });
        console.error(`Error compressing image: `, error);
      });
      if (blob) {
        const downloadURL = await uploadFile(
          blob,
          `images/recipe/${uuid()}.${this.imgFile!.name.split(".").pop()}`,
          progress => (this.uploadProgress = progress)
        ).catch(error => {
          this.$dialog.message.error("Error uplading image", {
            position: "bottom"
          });
          console.error(`Error uplading image:`, error);
        });
        this.uploadProgress = null;
        if (downloadURL) {
          return downloadURL;
        }
      }
      return "";
    }
  }
});
</script>
