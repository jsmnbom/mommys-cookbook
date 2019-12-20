<template>
  <v-container class="fill-height">
    <v-row class="mb-6" justify="center" no-gutters>
      <v-col md="auto" class="text-center">
        <v-icon style="height: 96px; width: 96px;">{{ mdiBookOpen }}</v-icon>
        <h1 class="display-1">No cookbook selected!</h1>
        <p class="subtitle-1">Please select a cookbook or create a new one.</p>
        <v-row class="hidden-sm-and-up">
          <v-col>
            <v-btn large color="primary" @click="toggleDrawer"
              >Select Cookbook</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              large
              color="primary"
              @click="$store.commit('createCookbook')"
              >Create new cookbook</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import CookbooksDrawer from "@/components/CookbooksDrawer.vue";
import { mapMutations } from "vuex";

import { mdiBookOpen } from "@mdi/js";

export default Vue.extend({
  name: "home",
  data: () => ({
    mdiBookOpen
  }),
  components: {
    CookbooksDrawer
  },
  methods: mapMutations(["toggleDrawer"])
});
</script>
