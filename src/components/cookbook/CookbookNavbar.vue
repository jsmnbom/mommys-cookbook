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
    ></v-text-field>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-spacer />
      <v-select
        dense
        flat
        solo-inverted
        hide-details
        :items="tags"
        multiple
        prepend-inner-icon="mdi-tag-outline"
        label="Filter tags"
        class="flex-basis-20"
      ></v-select>
      <v-spacer />
      <v-select
        v-model="sortBy"
        dense
        flat
        solo-inverted
        hide-details
        :items="sortByItems"
        prepend-inner-icon="mdi-sort"
        label="Sort by"
        class="sort-by flex-basis-20"
      >
        <template v-slot:append-outer class="ma-0">
          <v-btn icon>
            <v-icon>mdi-sort-ascending</v-icon>
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
        dense
        flat
        solo-inverted
        small
        hide-details
        :items="tags"
        multiple
        prepend-inner-icon="mdi-tag-outline"
        label="Filter tags"
        class="flex-basis-45"
      ></v-select>
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
        prepend-inner-icon="mdi-sort"
        label="Sort by"
        class="flex-basis-45"
      >
        <template v-slot:append-outer class="ma-0">
          <v-btn icon small>
            <v-icon>mdi-sort-ascending</v-icon>
          </v-btn>
        </template>
      </v-select>
    </template>
  </DefaultNavbar>
</template>

<script lang="ts">
import Vue from "vue";

import DefaultNavbar from "@/components/DefaultNavbar.vue";

export default Vue.extend({
  name: "CookbookNavbar",
  components: {
    DefaultNavbar
  },
  data: () => ({
    sortByItems: [
      { text: "Recent", value: "lastEdited" },
      { text: "Tastiness", value: "ratingTastiness" },
      { text: "Cost", value: "ratingCost" },
      { text: "Title", value: "title" }
    ],
    extensionSort: false,
    extensionFilter: false
  }),
  computed: {
    sortBy: {
      get() {
        var value = this.$store.state.cookbookSortBy;
        console.log("Getting tags value", value);
        return value;
      },
      set(value) {
        console.log("Setting tags value", value);
        this.$store.commit("setCookbookSortBy", value);
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
</style>
