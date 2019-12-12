<template>
  <div class="home">
    <md-empty-state
      md-icon="how_to_reg"
      md-label="No cookbook selected"
      md-description="Please select a cookbook or create a new one."
    >
      <md-button
        class="md-primary md-raised choose-button"
        @click="toggleDrawer"
        >Select cookbook</md-button
      >
      <md-button class="md-primary md-raised">Create new cookbook</md-button>
    </md-empty-state>
  </div>
</template>

<script>
import CookbooksDrawer from "@/components/CookbooksDrawer.vue";
import { mapMutations } from "vuex";

export default {
  name: "home",
  components: {
    CookbooksDrawer
  },
  methods: mapMutations(["toggleDrawer"])
};
</script>

<style scoped>
@media (min-width: 600px) {
  .choose-button {
    display: none;
  }
}
</style>
