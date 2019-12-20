<template>
  <v-navigation-drawer
    :value="showDrawer"
    @input="setDrawer"
    :clipped="$vuetify.breakpoint.lgAndUp"
    app
    :width="$vuetify.breakpoint.smAndUp ? 350 : '75vw'"
  >
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="subtitle-1"
            >Your cookbooks</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <template v-for="item in items">
        <v-list-item
          :key="item.key"
          v-if="item.type == 'recipe'"
          link
          @click.stop
          :input-value="recipeActive(item.key)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.recipe.title || "(untitled recipe)" }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :key="item.key"
          v-if="item.type == 'cookbook'"
          link
          @click="toCookbook(item.key)"
          :input-value="cookbookActive(item.key)"
        >
          <v-list-item-avatar
            :class="{
              grey: !item.cookbook.thumbURL,
              'lighten-3': !item.cookbook.thumbURL
            }"
          >
            <v-img
              v-if="item.cookbook.thumbURL"
              :src="item.cookbook.thumbURL"
            />
            <v-icon v-else>mdi-image</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.cookbook.title }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="onEditCookbook(item.key)" @mousedown.stop @touchstart.stop>
              <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
      <v-list-item @click="$store.commit('createCookbook')">
        <v-list-item-icon class="ml-2">
          <v-icon>mdi-plus-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            Create new cookbook
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { db, CookbookValue, QuerySnapshot } from "@/firebase";

export default Vue.extend({
  name: "CookbooksDrawer",
  computed: {
    ...mapState(["showDrawer", "cookbooks", "recipes"]),
    items() {
      const arr = [];
      for (const [cookbookId, cookbook] of Object.entries(this.cookbooks)) {
        arr.push({
          type: "cookbook",
          key: cookbookId,
          cookbook
        });
        if (
          this.$route.name &&
          this.$route.name.startsWith("recipe") &&
          cookbookId == this.$route.params.cookbookId &&
          cookbookId in this.recipes
        ) {
          const recipeId = this.$route.params.recipeId;
          const recipe = this.recipes[cookbookId][recipeId];
          arr.push({
            type: "recipe",
            key: recipeId,
            recipe
          });
        }
      }
      return arr;
    }
  },
  methods: {
    ...mapMutations(["setDrawer"]),
    fetchCookbooks() {
      this.$store.commit("clearCookbooks");
      this.$store.dispatch("fetchCookbooks");
    },
    toCookbook(cookbookId: string) {
      if (
        cookbookId != this.$route.params.cookbookId ||
        this.$route.name != "cookbook"
      ) {
        this.$router.push({ name: "cookbook", params: { cookbookId } });
      }
    },
    cookbookActive(cookbookId: string) {
      return (
        cookbookId == this.$route.params.cookbookId &&
        this.$route.name == "cookbook"
      );
    },
    recipeActive(recipeId: string) {
      return (
        recipeId == this.$route.params.recipeId &&
        this.$route.name &&
        this.$route.name.startsWith("recipe")
      );
    },
    onEditCookbook(cookbookId: string) {
      this.$store.commit("editCookbook", cookbookId);
    }
  },
  created() {
    this.$store.watch(
      state => state.account.loggedIn,
      loggedIn => {
        if (loggedIn) {
          // @ts-ignore
          this.fetchCookbooks();
        }
      }
    );
    if (this.$store.state.account.loggedIn) {
      // @ts-ignore
      this.fetchCookbooks();
    }
  }
});
</script>

<style scoped>
.create >>> .md-icon:first-child {
  margin-left: 8px;
  margin-right: 24px;
}
.cookbook-item >>> .title {
  font-weight: 700;
}
.cookbook-item >>> .description {
  font-weight: 100;
}
</style>
