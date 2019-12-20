<template>
  <v-card
    :loading="saving"
    :tile="$vuetify.breakpoint.smAndDown"
    class="mb-actionbutton"
  >
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
        <v-row
          :class="{
            'justify-space-between': editing && !$vuetify.breakpoint.xsOnly,
            'justify-end': editing && $vuetify.breakpoint.xsOnly,
            start: !editing
          }"
        >
          <template v-for="tag in tags">
            <v-chip
              dark
              v-if="!editing"
              class="ma-2"
              color="#616161AA"
              v-text="tag"
              :key="tag"
            ></v-chip>
          </template>
          <v-col
            cols="12"
            sm="8"
            class="py-2 order-2 order-sm-0"
            v-if="editing"
          >
            <v-combobox
              dark
              multiple
              dense
              hide-selected
              deletable-chips
              clearable
              :value="tags"
              @input="$emit('update:tags', $event)"
              :items="tagItems"
              chips
              label="Tags"
            ></v-combobox>
          </v-col>
          <v-menu offset-y v-if="editing">
            <template v-slot:activator="{ attrs, on: menu }">
              <v-btn fab small v-on="menu" v-bind="attrs">
                <v-icon>{{ mdiCamera }}</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="$refs.imgUpload.click()">
                <v-list-item-icon>
                  <v-icon>{{ mdiFileFindOutline }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Browse files</v-list-item-title>
              </v-list-item>
              <v-list-item @click="fromURL">
                <v-list-item-icon>
                  <v-icon>{{ mdiEarth }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>From URL</v-list-item-title>
              </v-list-item>
              <v-list-item @click="clipboardDialogOpen = true">
                <v-list-item-icon>
                  <v-icon>{{ mdiClipboardOutline }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>From clipboard</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
            />
          </v-col>
          <v-col v-else cols="12" sm="6" class="py-0 order-2 order-sm-0">
            <v-card-title class="white--text pl-0 mb-2">
              <span
                :class="{
                  'display-1': $vuetify.breakpoint.smAndUp,
                  headline: $vuetify.breakpoint.xsOnly
                }"
                >{{ title || "(untitled recipe)" }}</span
              >
            </v-card-title>
            <v-card-subtitle class="white--text pl-1">
              <span v-text="subtitle" class="subtitle-1"></span>
            </v-card-subtitle>
          </v-col>
          <v-card-actions class="pa-2 pr-4">
            <v-row
              class="flex-column"
              :class="{
                'align-end': !$vuetify.breakpoint.xsOnly,
                'align-center': $vuetify.breakpoint.xsOnly
              }"
            >
              <v-rating
                v-if="editing"
                dense
                size="32"
                color="red"
                background-color="red lighten-1"
                :full-icon="mdiHeart"
                :empty-icon="mdiHeartOutline"
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
                :full-icon="mdiHeart"
                :length="ratingTastiness"
                :value="ratingTastiness"
              ></v-rating>
              <v-rating
                v-if="editing"
                dense
                size="32"
                color="green darken-1"
                background-color="green lighten-4"
                :full-icon="mdiCurrencyUsd"
                :empty-icon="mdiCurrencyUsd"
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
                :full-icon="mdiCurrencyUsd"
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
          v-dompurify-html="content"
        />
      </v-container>
      <v-container class="px-7">
        <v-text-field
          v-if="editing"
          dark
          label="Recipe source"
          class="title"
          placeholder="Url or book title + page"
          hint="Start with http:// or https:// to create a link."
          :value="source"
          @input="$emit('update:source', $event)"
        />
        <span v-else>
          <i>Source: </i>
          <a
            class="source"
            :href="source"
            v-if="isSourceURL"
            target="_blank"
            rel="noreferrer"
            >{{ source }}</a
          >
          <span v-else>{{ source || "unknown" }}</span>
        </span>
      </v-container>
    </v-card-text>
    <input v-show="false" ref="imgUpload" type="file" @change="onImgUpload" />
    <v-dialog width="500" v-model="clipboardDialogOpen">
      <v-card>
        <v-card-title>
          Upload from clipboard
        </v-card-title>

        <v-card-text>
          <span>Press CTRL+V to paste your image</span>
          <div
            class="clipboardDiv"
            contenteditable="true"
            @paste="paste"
            @blur="clipboardDialogOpen = false"
            v-text="clipboardDivText"
            ref="clipboardDiv"
          ></div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="clipboardDialogOpen = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import RecipeEditor from "@/components/recipe/RecipeEditor.vue";
import { randomImgSrc, compressImage } from "@/utils";

import {
  mdiCamera,
  mdiFileFindOutline,
  mdiEarth,
  mdiClipboardOutline,
  mdiClose,
  mdiHeart,
  mdiHeartOutline,
  mdiCurrencyUsd
} from "@mdi/js";

function isValidURL(url: string): boolean {
  var a = document.createElement("a");
  a.href = url;
  return !!a.host && a.host != window.location.host;
}

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
    "tags",
    "tagItems",
    "source",
    "saving"
  ],
  data: () => ({
    mdiCamera,
    mdiFileFindOutline,
    mdiEarth,
    mdiClipboardOutline,
    mdiClose,
    mdiHeart,
    mdiHeartOutline,
    mdiCurrencyUsd,
    rules: {
      max: (len: number) => (v: string) =>
        (v || "").length <= len || `Please type at most ${len} characters`,
      required: (v: string) => !!v || "This field is required"
    },
    imgFile: null as null | File,
    thumbURLpreview: "",
    clipboardDialogOpen: false,
    clipboardDivText: ""
  }),
  computed: {
    ...mapState({
      editing: "editingRecipe"
    }),
    img(): string {
      if (this.thumbURLpreview) {
        return this.thumbURLpreview;
      } else if (this.thumbURL) {
        return this.thumbURL;
      }
      return randomImgSrc(this.recipeId, 2);
    },
    isSourceURL(): boolean {
      return isValidURL(this.source);
    }
  },
  methods: {
    onImgUpload(
      event: any /* https://github.com/microsoft/TypeScript/issues/31816 */
    ) {
      const imgFile = event.target.files[0];
      this.thumbURLpreview = URL.createObjectURL(imgFile);
      this.$emit("update:imgFile", imgFile);
    },
    async fromURL() {
      let res = await this.$dialog.prompt({
        text: "Image URL",
        title: "Upload from URL"
      });
      if (res) {
        fetch(
          "https://mommys-cookbook-cors.jsmnbom.workers.dev/?" +
            encodeURIComponent(res)
        )
          .then(res => res.blob())
          .then(blob => {
            this.thumbURLpreview = URL.createObjectURL(blob);
            this.$emit("update:imgFile", blob);
          });
      }
    },
    paste(e: any) {
      if (e.clipboardData.files[0]) {
        this.thumbURLpreview = URL.createObjectURL(e.clipboardData.files[0]);
        this.$emit("update:imgFile", e.clipboardData.files[0]);
        this.clipboardDialogOpen = false;
      }
    }
  },
  watch: {
    clipboardDialogOpen(open: boolean) {
      if (open) {
        this.$nextTick(() => {
          this.clipboardDivText = "";
          setTimeout(() => {
            (this.$refs.clipboardDiv as any).focus();
          }, 0);
        });
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

<style>
.theme--light .recipeContent {
  color: black;
}
.theme--dark .recipeContent {
  color: white;
}
.theme--light a.source {
  color: var(--v-primary-darken2);
}
.theme--dark a.source {
  color: var(--v-primary-lighten2);
}
</style>

<style>
.clipboardDiv * {
  display: none;
}
</style>
