<template>
  <v-navigation-drawer
    :value="showDrawer"
    @input="setDrawer"
    :clipped="$vuetify.breakpoint.lgAndUp"
    app
  >
    <v-list dense>
       <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">Your cookbooks</v-list-item-title>
          </v-list-item-content>
       </v-list-item>
      <template v-for="(cookbook, key) in cookbooks">
        <v-list-item :key="key" :to="{ name: 'cookbook', params: { id: key } }">
          <v-list-item-avatar>
            <img :src="cookbook.thumbURL" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ cookbook.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item @click="">
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
  computed: mapState(["showDrawer", "cookbooks"]),
  methods: {
    ...mapMutations(["setDrawer"]),
    fetchCookbooks() {
      console.log("fetchCookbooks");
      this.$store.commit("clearCookbooks");
      const inner = (querySnapshot: QuerySnapshot) => {
        this.$store.commit(
          "addCookbooks",
          querySnapshot.docs.reduce(
            (map: { [id: string]: CookbookValue }, doc) => {
              const data = doc.data();
              const cookbook = CookbookValue.fromObject(data);
              map[doc.id] = cookbook;
              return map;
            },
            {}
          )
        );
      };
      db.collection("cookbooks")
        .where("authorUid", "==", this.$store.state.userInfo.uid)
        .onSnapshot(inner);
      db.collection("cookbooks")
        .where("sharedWith", "array-contains", this.$store.state.userInfo.email)
        .onSnapshot(inner);
    }
  },
  created() {
    this.$store.watch(
      state => state.loggedIn,
      loggedIn => {
        if (loggedIn) {
          this.fetchCookbooks();
        }
      }
    );
    if (this.$store.state.loggedIn) {
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
