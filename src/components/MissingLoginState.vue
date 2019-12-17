<template>
  <v-container class="fill-height">
    <v-row class="mb-6" justify="center" no-gutters>
      <v-col md="auto" class="text-center">
        <v-icon class="display-4">mdi-account-plus</v-icon>
        <h1 class="display-1">Please login!</h1>
        <p class="subtitle-1">
          Mommy's cookbook requires that you login using your Google Account
        </p>
        <v-btn large color="primary" @click="login">Login</v-btn>
        <!-- <md-empty-state
      md-icon="how_to_reg"
      md-label="Please login!"
      md-description="Mommy's cookbook requires that you login using your Google Account"
    >
      <md-button class="md-primary md-raised" @click="login">Login</md-button>
    </md-empty-state> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "MissingLoginState",
  methods: mapActions("account", ["login"])
});
</script>
