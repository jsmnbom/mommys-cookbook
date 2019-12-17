<template>
  <DefaultNavbar :extended="extensionFilter || extensionSort">
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4 hidden-md-and-down">
      <span>Mommy's Cookbook</span>
    </v-toolbar-title>

    <v-spacer v-if="$vuetify.breakpoint.smAndUp" />

    <v-text-field
      clearable
      dense
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="mdi-magnify"
      label="Search"
      class="flex-basis-20"
      v-model="search"
    ></v-text-field>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-spacer />
      <v-select
        dense
        flat
        solo-inverted
        hide-details
        :items="tagItems"
        clearable
        multiple
        label="Filter tags"
        class="flex-basis-20"
        v-model="tags"
      >
        <template v-slot:prepend-inner class="ma-0">
          <v-icon>mdi-tag-outline</v-icon>
          <v-btn
            icon
            small
            @click.stop="toggleTagFiltersAnd"
            @mouseup.stop
            v-if="tags.length > 1"
          >
            <span>{{ tagFiltersAnd ? "AND" : "OR" }}</span>
          </v-btn>
        </template>
      </v-select>
      <v-spacer />
      <v-select
        v-model="sortBy"
        dense
        flat
        solo-inverted
        hide-details
        :items="sortByItems"
        label="Sort by"
        class="flex-basis-20 tags"
      >
        <template v-slot:prepend-inner class="ma-0">
          <v-btn icon small @click.stop="toggleSortByDesc" @mouseup.stop>
            <v-icon>{{
              sortByDesc ? "mdi-sort-descending" : "mdi-sort-ascending"
            }}</v-icon>
          </v-btn>
        </template>
      </v-select>
    </template>
    <template v-else>
      <v-btn
        icon
        @click="extensionFilter = !extensionFilter"
        :input-value="extensionFilter"
        class="ms-1"
      >
        <v-icon>mdi-tag</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="extensionSort = !extensionSort"
        :input-value="extensionSort"
        class="ms-1"
      >
        <v-icon>mdi-sort</v-icon>
      </v-btn>
    </template>

    <template v-slot:extension v-if="extensionFilter || extensionSort">
      <v-select
        v-if="extensionFilter"
        v-model="tags"
        dense
        flat
        solo-inverted
        small
        clearable
        hide-details
        :items="tagItems"
        multiple
        label="Filter tags"
        class="flex-basis-45 tags"
      >
        <template v-slot:prepend-inner class="ma-0">
          <v-icon>mdi-tag-outline</v-icon>
          <v-btn
            icon
            small
            @click.stop="toggleTagFiltersAnd"
            @mouseup.stop
            v-if="tags.length > 1"
          >
            <span>{{ tagFiltersAnd ? "AND" : "OR" }}</span>
          </v-btn>
        </template>
      </v-select>
      <div v-if="extensionFilter && extensionSort" class="ms-4" />

      <v-select
        v-if="extensionSort"
        v-model="sortBy"
        dense
        flat
        small
        solo-inverted
        hide-details
        :items="sortByItems"
        label="Sort by"
        class="flex-basis-45"
      >
        <template v-slot:prepend-inner class="ma-0">
          <v-btn icon small @click.stop="toggleSortByDesc" @mouseup.stop>
            <v-icon>{{
              sortByDesc ? "mdi-sort-descending" : "mdi-sort-ascending"
            }}</v-icon>
          </v-btn>
        </template>
      </v-select>
    </template>
  </DefaultNavbar>
</template>

<script lang="ts">
import Vue from "vue";

import DefaultNavbar from "@/components/DefaultNavbar.vue";
import { mapGetters, mapMutations, mapState } from "vuex";

export default Vue.extend({
  name: "CookbookNavbar",
  props: ["cookbookId"],
  components: {
    DefaultNavbar
  },
  data: () => ({
    sortByItems: [
      { text: "Recent", value: "lastEdited" },
      { text: "Tastiness", value: "ratingTastiness" },
      { text: "Cost", value: "ratingCost" },
      { text: "Title", value: "title" }
    ] as { text: string; value: string }[],
    extensionSort: false as boolean,
    extensionFilter: false as boolean
  }),
  methods: {
    ...mapMutations({
      setSortBy: "setCookbookSortBy",
      setSortByDesc: "setCookbookSortByDesc",
      setTagFilters: "setCookbookTagFilters",
      setTagFiltersAnd: "setCookbookTagFiltersAnd",
      setSearch: "setCookbookSearch"
    }),
    toggleTagFiltersAnd() {
      this.setTagFiltersAnd(!this.tagFiltersAnd);
    },
    toggleSortByDesc() {
      this.setSortByDesc(!this.sortByDesc);
    }
  },
  computed: {
    ...mapState([
      "cookbookSortBy",
      "cookbookSortByDesc",
      "cookbookTagFilters",
      "cookbookTagFiltersAnd",
      "cookbookSearch"
    ]),
    ...mapGetters(["cookbookTags"]),
    sortBy: {
      get(): string[] {
        return this.cookbookSortBy;
      },
      set(value): void {
        this.setSortBy(value);
      }
    },
    sortByDesc(): boolean {
      return this.cookbookSortByDesc;
    },
    tags: {
      get(): string[] {
        return this.cookbookTagFilters;
      },
      set(value): void {
        this.setTagFilters(value);
      }
    },
    tagFiltersAnd(): boolean {
      return this.cookbookTagFiltersAnd;
    },
    tagItems(): string[] {
      return this.cookbookTags(this.cookbookId);
    },
    search: {
      get(): string[] {
        return this.cookbookSearch;
      },
      set(value): void {
        this.setSearch(value);
      }
    }
  }
});
</script>

<style scoped>
.sort-by >>> .v-input__append-outer {
  margin: -5px 0 0 7px !important;
}
.sort-by {
  margin-top: 5px;
}
.flex-basis-20 {
  flex-basis: 20%;
}
.flex-basis-45 {
  flex-basis: 45%;
}
.tags >>> .v-select__selections {
  flex-wrap: nowrap;
}
</style>
