<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, RecipeList, RecipeValue, QuerySnapshot } from "@/firebase";

export default Vue.extend({
  name: "Cookbook",
  methods: {
    fetchRecipes() {
      const id = this.$route.params.id;
      this.$store.commit("clearRecipes", id);
      const inner = (querySnapshot: QuerySnapshot) => {
        this.$store.commit("setRecipes", id, {
          ...querySnapshot.docs.reduce((map: RecipeList, doc) => {
            const data = doc.data();
            const cookbook = RecipeValue.fromObject(data);
            map[doc.id] = cookbook;
            return map;
          }, {})
        });
      };
      db.collection("recipes")
        .where("cookbookId", "==", id)
        .onSnapshot(inner);
    }
  },
  watch: {
    $route(to: any) {
      this.fetchRecipes();
    }
  }
});
</script>
