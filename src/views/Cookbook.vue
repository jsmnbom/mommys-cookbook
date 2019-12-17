<template>
  <v-container>
    <v-data-iterator
      :items="items"
      disable-pagination
      hide-default-footer
      :sort-by="cookbookSortBy"
      :sort-desc="cookbookSortByDesc"
      :custom-sort="sort"
      :custom-filter="filter"
      no-data-text="No recipes found in cookbook"
    >
      <template v-slot:default="props">
        <v-row>
          <template v-for="{ recipe, recipeId } in props.items">
            <RecipeListItem
              :key="recipeId"
              :cookbookId="cookbookId"
              :recipeId="recipeId"
              :recipe="recipe"
            />
          </template>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { db, RecipeList, RecipeValue, QuerySnapshot } from "@/firebase";

import RecipeListItem from "@/components/cookbook/RecipeListItem.vue";

import { Route } from "vue-router";
import { mapState } from "vuex";

type Items = { recipeId: string; recipe: RecipeValue }[];

function stringFilter(value: any, search: string | null) {
  return (
    value != null &&
    search != null &&
    typeof value !== "boolean" &&
    value
      .toString()
      .toLocaleLowerCase()
      .indexOf(search) !== -1
  );
}

export default Vue.extend({
  name: "Cookbook",
  props: ["cookbookId"],
  components: {
    RecipeListItem
  },
  data: () => ({
    items: [] as Items
  }),
  computed: {
    ...mapState([
      "recipes",
      "cookbookSortBy",
      "cookbookSortByDesc",
      "cookbookTagFilters",
      "cookbookTagFiltersAnd"
    ])
  },
  methods: {
    fetchRecipes() {
      this.$store.dispatch("fetchRecipes", this.cookbookId);
    },
    setRecipes() {
      this.items = Object.keys(this.recipes[this.cookbookId]).map(recipeId => {
        return {
          recipeId,
          recipe: this.recipes[this.cookbookId][recipeId]
        };
      });
    },
    setActionButton() {
      this.$store.commit("setActionButton", {
        icon: "mdi-plus",
        action: "createRecipe"
      });
    },
    sort(items: Items, sortBy: string[], sortDesc: boolean[]) {
      console.log(items, sortBy, sortDesc);
      items.sort((a, b) => {
        if (sortBy[0] === "lastEdited") {
          if (!sortDesc[0]) {
            return (
              (a.recipe.lastEdited ? a.recipe.lastEdited.getTime() : 0) -
              (b.recipe.lastEdited ? b.recipe.lastEdited.getTime() : 0)
            );
          } else {
            return (
              (b.recipe.lastEdited ? b.recipe.lastEdited.getTime() : 0) -
              (a.recipe.lastEdited ? a.recipe.lastEdited.getTime() : 0)
            );
          }
          // @ts-ignore
        } else if (sortBy[0] == "title") {
          if (!sortDesc[0]) {
            // @ts-ignore
            return (a.recipe[sortBy[0]] as string).localeCompare(
              // @ts-ignore
              b.recipe[sortBy[0]] as string
            );
          } else {
            // @ts-ignore
            return (b.recipe[sortBy[0]] as string).localeCompare(
              // @ts-ignore
              a.recipe[sortBy[0]] as string
            );
          }
        } else {
          if (!sortDesc[0]) {
            // @ts-ignore
            return a.recipe[sortBy[0]] - b.recipe[sortBy[0]];
          } else {
            // @ts-ignore
            return b.recipe[sortBy[0]] - a.recipe[sortBy[0]];
          }
        }
      });
      return items;
    },
    filter(items: Items, search: string | null) {
      if (this.cookbookTagFilters.length > 0) {
        items = items.filter(({ recipe }) => {
          if (this.cookbookTagFiltersAnd) {
            return this.cookbookTagFilters.every((tag: string) =>
              recipe.tags.includes(tag)
            );
          } else {
            return this.cookbookTagFilters.some((tag: string) =>
              recipe.tags.includes(tag)
            );
          }
        });
      }

      if (search) {
        search = search.toString().toLocaleLowerCase();
        items = items.filter(({ recipe }) => {
          return [recipe.title, recipe.subtitle].some(value => {
            return stringFilter(value, search);
          });
        });
      }

      return items;
    }
  },
  watch: {
    $route(to: Route, from: Route) {
      if (to.name && to.name == "cookbook") {
        this.fetchRecipes();
        this.$store.commit("setCurrentCookbookId", this.cookbookId);
        this.setActionButton();
      }
      if (from.name && from.name == "cookbook") {
        this.$store.commit("setCurrentCookbookId", null);
        this.$store.commit("setActionButton", null);
      }
    }
  },
  created() {
    this.fetchRecipes();
    this.$store.commit("setCurrentCookbookId", this.cookbookId);

    if (
      this.cookbookId in this.recipes &&
      this.recipes[this.cookbookId].length > 0
    ) {
      this.setRecipes();
    }

    this.$store.watch(
      state => state.recipes[this.cookbookId],
      recipes => {
        this.setRecipes();
      }
    );

    this.setActionButton();
  }
});
</script>
