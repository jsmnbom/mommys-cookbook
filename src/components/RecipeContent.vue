<template>
  <v-container>
    <v-row align="start" justify="center">
      <v-col cols="12" md="6" class="order-1 order-md-0" align-self="center">
        <h1 class="headline" v-text="value.title" />
        <h2 class="subtitle-1" v-text="value.description" />
        <v-divider />
        <v-row align-self="end" justify="start" class="ms-0 mt-2">
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">{{ value.ratings.tastiness }}/10</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-currency-usd</v-icon>
          <span class="subheading">{{ value.ratings.cost }}/10</span>
        </v-row>
      </v-col>
      <v-col cols="8" md="6" class="order-0 order-md-1">
        <img v-if="img" class="responsive-img" :src="img" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="recipeContent" v-html="value.content" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "RecipeContent",
  props: ["value"],
  computed: {
    img() {
      const doc = new DOMParser().parseFromString(
        this.value.content,
        "text/html"
      );
      let img = doc.querySelector("img");
      if (img) {
        return img.src;
      } else {
        return null;
      }
    }
  }
});
</script>

<style scoped>
.responsive-img {
  width: 100%;
  height: auto;
}
.recipeContent >>> img {
    max-width: 100%;
}
</style>
