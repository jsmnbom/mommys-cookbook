<template>
  <v-form ref="form" lazy-validation v-model="valid" v-if="editedRecipe">
    <div ref="recipeTabs" v-if="tabbed" class="swiper-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          style="height: calc(100vh - 48px - 56px); overflow-y: scroll;"
        >
          <RecipeContent
            :saving="saving"
            v-bind.sync="editedRecipe"
            :recipeId="recipeId"
            :tagItems="tagItems"
            @update:imgFile="imgFile = $event"
          />
        </div>
        <div
          class="swiper-slide"
          style="height: calc(100vh - 48px - 56px); overflow-y: scroll;"
        >
          <RecipeIngredientsList
            v-bind.sync="editedRecipe"
            :saving="saving"
            @update:addIngredientsText="addIngredientsText = $event"
          />
        </div>
      </div>
    </div>

    <v-container v-else>
      <v-row align="start" justify="space-around">
        <v-col class="col-8">
          <RecipeContent
            :saving="saving"
            v-bind.sync="editedRecipe"
            :recipeId="recipeId"
            :tagItems="tagItems"
            @update:imgFile="imgFile = $event"
          />
        </v-col>
        <v-col class="col-4">
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
import { mapState, mapGetters } from "vuex";
import { Route } from "vue-router";
import { v4 as uuid } from "uuid";

import { Swiper } from "swiper/js/swiper.esm.js";
import "swiper/src/swiper.scss";

import RecipeIngredientsList from "@/components/recipe/RecipeIngredientsList.vue";
import RecipeContent from "@/components/recipe/RecipeContent.vue";
import { RecipeValue, RecipeList, db } from "@/firebase";
import { compressImage, uploadFile } from "@/utils";

import { mdiCheck, mdiPencilOutline } from "@mdi/js";

export default Vue.extend({
  name: "Recipe",
  props: ["cookbookId", "recipeId", "ingredients"],
  metaInfo() {
    const recipeTitle = this.recipe
      ? (this.recipe as RecipeValue).title || "(untitled recipe)"
      : "Recipe";
    return {
      title: recipeTitle
    };
  },
  data: () => ({
    editedRecipe: null as RecipeValue | null,
    saving: false,
    valid: false,
    imgFile: null as File | null,
    uploadProgress: 0 as number | null,
    addIngredientsText: "",
    tabsSwiper: null as any,
    tabs: ["content", "ingredients"]
  }),
  components: {
    RecipeIngredientsList,
    RecipeContent
  },
  computed: {
    tabbed(): boolean {
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
    ...mapState(["cookbooks", "bottomNavActive"]),
    ...mapGetters(["cookbookTags"]),
    tagItems(): string[] {
      return this.cookbookTags(this.cookbookId);
    },
    ...mapState({
      editing: "editingRecipe"
    }),
    activeTab: {
      get() {
        return this.$store.state.recipeActiveTab;
      },
      set(recipeActiveTab) {
        this.$store.commit("setRecipeActiveTab", recipeActiveTab);
      }
    }
  },
  mounted() {
    if (!this.recipe) {
      this.$store.dispatch("fetchRecipes", this.cookbookId);
    } else {
      if (this.$refs.form) (this.$refs.form as any).reset();
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
          if (this.$store.state.saveRecipe) {
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
            } else {
              (this.$refs.form as any).reset();
              this.imgFile = null;
              this.addIngredientsText = "";
              this.editedRecipe = RecipeValue.fromObject(
                this.recipe!.toObject()
              );
            }
          }
        }
      }
    );
  },
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      vm.updateActionButton();
    });
  },
  async beforeRouteLeave(to, from, next) {
    if (this.editing) {
      const res = await this.$dialog.confirm({
        text: "Are you sure you want to leave?<br>You have unsaved changes.",
        title: "Warning",
        actions: {
          false: "No",
          true: {
            text: "Yes",
            color: "red"
          }
        }
      });
      if (res) {
        this.$store.commit("discardRecipe");
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  watch: {
    recipe() {
      if (this.recipe) {
        if (this.$refs.form) (this.$refs.form as any).reset();
        this.imgFile = null;
        this.addIngredientsText = "";
        this.editedRecipe = RecipeValue.fromObject(this.recipe!.toObject());
      }
    },
    editedRecipe(newEditedRecipe, oldEditedRecipe) {
      this.$nextTick(() => {
        if (
          newEditedRecipe &&
          !oldEditedRecipe &&
          this.tabsSwiper === null &&
          this.tabbed
        ) {
          this.registerSwiper();
        }
      });
    },
    tabbed(newTabbed) {
      this.$nextTick(() => {
        if (newTabbed && this.tabsSwiper === null) {
          this.registerSwiper();
        }
      });
    },
    activeTab(newActiveTab) {
      if (this.tabsSwiper !== null) {
        this.tabsSwiper.slideTo(this.tabs.indexOf(newActiveTab));
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
          icon: mdiCheck,
          mutation: "saveRecipe"
        });
      } else {
        this.$store.commit("setActionButton", {
          icon: mdiPencilOutline,
          mutation: "editRecipe"
        });
      }
    },
    async handleImage(): Promise<string> {
      const blob = await compressImage(this.imgFile!, {
        width: 1280,
        height: 720
      }).catch(error => {
        this.$dialog.message.error("Error compressing image", {
          position: "bottom"
        });
        console.error(`Error compressing image: `, error);
      });
      if (blob) {
        const downloadURL = await uploadFile(
          blob,
          `images/recipe/${this.recipeId}.jpg`,
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
    },
    registerSwiper() {
      this.tabsSwiper = new Swiper(this.$refs.recipeTabs as HTMLElement);
      this.tabsSwiper.on("slideChange", () => {
        this.activeTab = this.tabs[this.tabsSwiper.realIndex];
      });
    }
  }
});
</script>

<style>
.swiper-container > * {
  box-sizing: border-box;
}
</style>
