<template>
  <md-drawer
    md-permanent="full"
    md-swipeable
    :md-active="showDrawer"
    @update:mdActive="toggleDrawer"
  >
    <md-toolbar class="md-transparent" md-elevation="0">
      <span class="md-title">Your cookbooks</span>
    </md-toolbar>

    <md-list>
      <md-list-item
        :to="{ name: 'cookbook', params: { id: key } }"
        v-for="(cookbook, key) in cookbooks"
        :key="key"
        class="cookbook-item"
      >
        <md-avatar>
          <img :src="cookbook.thumbURL" alt="Avatar" />
        </md-avatar>
        <span class="md-list-item-text">
          <span class="title">{{ cookbook.title }}</span>
          <span class="description">{{ cookbook.description }}</span>
        </span>
        <md-button class="md-icon-button" @click="">
          <md-icon>more_vert</md-icon>
        </md-button>
      </md-list-item>

      <md-list-item @click="" class="create">
        <md-icon class="md-size-1x">add_circle</md-icon>
        <span class="md-list-item-text">Create new cookbook</span>
      </md-list-item>
    </md-list>
  </md-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { firestore } from "firebase";
import { db, CookbookValue } from "../firebase-config";

export default Vue.extend({
  name: "CookbooksDrawer",
  computed: mapState(["showDrawer", "cookbooks"]),
  methods: {
    ...mapMutations(["toggleDrawer"]),
    fetchCookbooks() {
      console.log("fetchCookbooks");
      this.$store.commit("clearCookbooks");
      const inner = (querySnapshot: firestore.QuerySnapshot) => {
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
