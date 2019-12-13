<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="subtitle-1">Ingredients</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <template v-for="item in items">
      <v-list-item :key="item.ingredient" v-if="'ingredient' in item">
        <v-list-item-content>
          <v-list-item-subtitle v-text="item.ingredient"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="'divider' in item" :key="item.divider" />
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "IngredientsList",
  props: ["value"],
  computed: {
    items() {
      const arr: { ingredient?: string; divider?: string }[] = [];
      this.value.forEach((ingredient: string, i: number) => {
        arr.push({ ingredient });
        if (i != this.value.length - 1) {
          arr.push({ divider: ingredient + "_div" });
        }
      });
      return arr;
    }
  }
});
</script>
