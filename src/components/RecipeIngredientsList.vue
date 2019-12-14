<template>
  <v-card :loading="saving">
    <v-data-table
      :items="items"
      :headers="headers"
      hide-default-footer
      show-select
      no-data-text="No ingredients added"
    >
      <template v-slot:header.ingredient="{ header }">
        <span v-text="header.text" class="subtitle-1"></span>
      </template>
      <template v-slot:item.ingredient="{ item }" v-if="editing">
        <v-edit-dialog>
          {{ item.ingredient }}
          <template v-slot:input>
            <v-text-field
              :value="item.ingredient"
              @input="editIngredient(ingredient, $event)"
              label="Edit"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="deleteItem(item)" v-if="editing">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-divider v-if="editing" />
    <v-textarea
      v-if="editing"
      label="Add ingredients"
      class="pr-4 pt-7 pb-3 pl-4"
      value=""
      auto-grow
      rows="1"
      clearable
      clear-icon="mdi-close"
      placeholder="2 cups of sugar"
      hint="One ingredient per line"
      @change="$emit('update:addIngredientsText', $event)"
    ></v-textarea>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "RecipeIngredientsList",
  props: ["ingredients", "saving"],
  data: () => ({
    headers: [
      {
        text: "Ingredients",
        value: "ingredient",
        align: "left",
        sortable: false
      },
      { text: "", value: "action", sortable: false, align: "right" }
    ]
  }),
  computed: {
    ...mapState({
      editing: "editingRecipe"
    }),
    items() {
      return this.ingredients.map((ingredient: string) => {
        return {
          ingredient: ingredient
        };
      });
    }
  },
  methods: {
    editIngredient(item: { ingredient: string }, newValue: string) {
      // This is probably horribly inefficient
      const index = this.ingredients.indexOf(item.ingredient);
      if (index !== -1) {
        const arr = [...this.ingredients];
        arr[index] = newValue;
        this.$emit("update:ingredients", arr);
      }
    },
    deleteItem(item: { ingredient: string }) {
      // This is probably horribly inefficient
      const index = this.ingredients.indexOf(item.ingredient);
      if (index !== -1) {
        const arr = [...this.ingredients];
        arr.splice(index, 1);
        this.$emit("update:ingredients", arr);
      }
    }
  }
});
</script>
