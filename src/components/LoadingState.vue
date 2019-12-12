<template>
  <v-container class="fill-height">
    <v-row class="mb-6" justify="center" no-gutters>
      <v-col md="auto">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LoadingState"
});
</script>
