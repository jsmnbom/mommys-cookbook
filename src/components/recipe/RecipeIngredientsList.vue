<template>
  <v-card :loading="saving" class="card">
    <v-data-table
      v-model="selectedItems"
      :items="items"
      :headers="headers"
      hide-default-footer
      :show-select="!editing"
      item-key="key"
      no-data-text="No ingredients added"
      disable-pagination
    >
      <template v-slot:header.ingredient="{ header }">
        <span v-text="header.text" class="subtitle-1"></span>
      </template>
      <template v-slot:item.ingredient="props" v-if="editing">
        <v-edit-dialog
          @open="editIngredient = props.item.ingredient"
          @cancel="cancelEdit(props.item)"
          @save="saveIngredient(props.item)"
        >
          {{ props.item.ingredient }}
          <template v-slot:input>
            <v-text-field
              v-model="editIngredient"
              label="Edit"
              single-line
              autofocus
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
    ],
    currentEditIngredient: null as any,
    editIngredient: "",
    selectedItems: []
  }),
  computed: {
    ...mapState({
      editing: "editingRecipe"
    }),
    items() {
      return this.ingredients.map((ingredient: string, index: number) => {
        return {
          key: index,
          ingredient: ingredient
        };
      });
    }
  },
  methods: {
    saveIngredient({ ingredient }: { ingredient: string }) {
      setTimeout(() => {
        // This is probably horribly inefficient
        const index = this.ingredients.indexOf(ingredient);
        if (index !== -1) {
          const arr = [...this.ingredients];
          arr[index] = this.editIngredient;
          this.$emit("update:ingredients", arr);
        }
        this.selectedItems = [];
      });
    },
    deleteItem(item: { ingredient: string }) {
      // This is probably horribly inefficient
      const index = this.ingredients.indexOf(item.ingredient);
      if (index !== -1) {
        const arr = [...this.ingredients];
        arr.splice(index, 1);
        this.$emit("update:ingredients", arr);
        this.selectedItems = [];
      }
    },
    cancelEdit({ ingredient }: { ingredient: string }) {
      this.editIngredient = ingredient;
    }
  }
});
</script>
