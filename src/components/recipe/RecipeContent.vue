<template>
  <v-card :loading="saving">
    <v-img
      :aspect-ratio="16 / 9"
      :src="img"
      :gradient="
        $vuetify.theme.dark
          ? 'to bottom, rgba(0,0,0,.4), rgba(0,0,0,.7)'
          : 'to bottom, rgba(0,0,0,.2), rgba(0,0,0,.4)'
      "
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
      <v-container
        fill-height
        class="align-content-space-between justify-center"
      >
        <v-row justify="end">
          <v-btn v-if="editing" fab small @click="$refs.imgUpload.click()">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </v-row>
        <v-row
          align="end"
          :class="{
            'justify-space-between': !$vuetify.breakpoint.xsOnly,
            'justify-center': $vuetify.breakpoint.xsOnly
          }"
        >
          <v-col
            v-if="editing"
            cols="12"
            sm="8"
            class="py-0 order-2 order-sm-0"
          >
            <v-text-field
              dark
              label="Recipe title"
              class="title"
              :rules="[rules.required, rules.max(40)]"
              counter="40"
              :value="title"
              @input="$emit('update:title', $event)"
              placeholder="Chocolate chip cookies"
            />
            <v-text-field
              class="subtitle-1"
              dark
              label="Recipe subtitle"
              placeholder="with extra chocolate chips"
              :rules="[rules.max(40)]"
              counter="40"
              clearable
              :value="subtitle"
              @input="$emit('update:subtitle', $event)"
              clear-icon="mdi-close"
            />
          </v-col>
          <v-col v-else cols="12" sm="6" class="py-0 order-2 order-sm-0">
            <v-card-title class="white--text pl-0 mb-2">
              <span
                :class="{
                  'display-1': $vuetify.breakpoint.smAndUp,
                  headline: $vuetify.breakpoint.xsOnly
                }"
              >{{ title || "(untitled recipe)" }}</span>
            </v-card-title>
            <v-card-subtitle class="white--text pl-1">
              <span v-text="subtitle" class="subtitle-1"></span>
            </v-card-subtitle>
          </v-col>
          <v-card-actions class="pa-2 pr-4">
            <v-row align="end" class="flex-column">
              <v-rating
                v-if="editing"
                dense
                size="32"
                color="red"
                background-color="red lighten-1"
                full-icon="mdi-heart"
                empty-icon="mdi-heart-outline"
                length="5"
                :value="ratingTastiness"
                @input="$emit('update:ratingTastiness', $event)"
                class="my-1"
              ></v-rating>
              <v-rating
                v-else
                dense
                size="32"
                readonly
                color="red"
                background-color="red lighten-1"
                full-icon="mdi-heart"
                :length="ratingTastiness"
                :value="ratingTastiness"
              ></v-rating>
              <v-rating
                v-if="editing"
                dense
                size="32"
                color="green darken-1"
                background-color="green lighten-4"
                full-icon="mdi-currency-usd"
                empty-icon="mdi-currency-usd"
                length="5"
                :value="ratingCost"
                @input="$emit('update:ratingCost', $event)"
                class="my-1"
              ></v-rating>
              <v-rating
                v-else
                dense
                size="32"
                readonly
                color="green darken-1"
                background-color="green lighten-4"
                full-icon="mdi-currency-usd"
                :length="ratingCost"
                :value="ratingCost"
              ></v-rating>
            </v-row>
          </v-card-actions>
        </v-row>
      </v-container>
    </v-img>
    <v-card-text class="pa-0">
      <RecipeEditor
        :value="content"
        @input="$emit('update:content', $event)"
        v-if="editing"
      />
      <v-container v-else>
        <div
          :class="{
            'body-1': true,
            'pa-4': true,
            recipeContent: true,
            'black--text': !$vuetify.theme.dark,
            'white--text': $vuetify.theme.dark
          }"
          v-html="content"
        />
      </v-container>
    </v-card-text>
    <input v-show="false" ref="imgUpload" type="file" @change="onImgUpload" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import RecipeEditor from "@/components/recipe/RecipeEditor.vue";
import { randomImgSrc } from "@/utils";

export default Vue.extend({
  name: "RecipeContent",
  components: {
    RecipeEditor
  },
  props: [
    "title",
    "subtitle",
    "ratingTastiness",
    "ratingCost",
    "recipeId",
    "thumbURL",
    "content",
    "saving"
  ],
  data: () => ({
    rules: {
      max: (len: number) => (v: string) =>
        (v || "").length <= len || `Please type at most ${len} characters`,
      required: (v: string) => !!v || "This field is required"
    },
    imgFile: null as null | File,
    thumbURLpreview: ""
  }),
  computed: {
    ...mapState({
      editing: "editingRecipe"
    }),
    img() {
      if (this.thumbURLpreview) {
        return this.thumbURLpreview;
      } else if (this.thumbURL) {
        return this.thumbURL;
      }
      return randomImgSrc(this.recipeId, 2);
    }
  },
  methods: {
    onImgUpload(
      event: any /* https://github.com/microsoft/TypeScript/issues/31816 */
    ) {
      const imgFile = event.target.files[0];
      this.thumbURLpreview = URL.createObjectURL(imgFile);
      this.$emit("update:imgFile", imgFile);
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

<style>
.theme--light .recipeContent {
  color: black;
}
.theme--dark .recipeContent {
  color: white;
}
</style>