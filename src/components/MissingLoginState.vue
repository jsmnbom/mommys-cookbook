<template>
  <div>
    <md-empty-state
      md-icon="how_to_reg"
      md-label="Please login!"
      md-description="Mommy's cookbook requires that you login using your Google Account"
    >
      <md-button class="md-primary md-raised" @click="login">Login</md-button>
    </md-empty-state>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from 'vuex';

export default Vue.extend({
  name: "MissingLoginState",
  methods: mapActions([
    'login'
  ])
});
</script>
