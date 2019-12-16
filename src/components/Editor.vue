<template>
  <div>
    <v-card id="toolbar" class="px-3">
      <v-row class="align-center">
        <v-col cols="auto" class="py-1">
          <v-btn
            icon
            class="ql-header"
            value="1"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>mdi-format-header-1</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-header"
            value="2"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>mdi-format-header-2</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-header"
            value="3"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>mdi-format-header-3</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="py-1">
          <v-btn icon class="ql-bold" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn icon class="ql-italic" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn icon class="ql-underline" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-underline</v-icon>
          </v-btn>
          <v-btn icon class="ql-strike" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-strikethrough</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="py-1">
          <v-btn
            icon
            class="ql-list"
            value="ordered"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-list"
            value="bullet"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="py-1">
          <v-btn icon class="ql-align" value="" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-align-left</v-icon>
          </v-btn>
          <v-btn icon class="ql-align" value="center" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-align-center</v-icon>
          </v-btn>
          <v-btn icon class="ql-align" value="right" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-align-right</v-icon>
          </v-btn>
          <!-- <v-btn icon class="ql-align" value="justify" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-align-justify</v-icon>
          </v-btn> -->
        </v-col>
        <v-col cols="auto" class="py-0">
          <v-btn icon class="ql-clean" v-mutate.attr.class="onMutate">
            <v-icon>mdi-format-clear</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <vue-editor class="body-1 recipeContent" v-model="content" :editorOptions="editorOptions" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// @ts-ignore
import { VueEditor, Quill } from "vue2-editor/dist/vue2-editor.core.js";

const icons = Quill.import("ui/icons");

delete icons.header["1"];
delete icons.header["2"];
delete icons.bold;
delete icons.italic;
delete icons.underline;
delete icons.strike;
delete icons.list.ordered;
delete icons.list.bullet;
delete icons.align[""];
delete icons.align.center;
delete icons.align.right;
delete icons.align.justify;
delete icons.clean;

const AlignStyle = Quill.import("attributors/style/align");
Quill.register(AlignStyle, true);

export default Vue.extend({
  components: {
    VueEditor
  },
  props: ["value"],
  data: () => ({
    toolbar: [
      [{ header: [false, 1, 2, 3] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" }
      ],
      ["clean"]
    ],
    editorOptions: {
      modules: {
        toolbar: {
          container: "#toolbar"
        }
      },
      placeholder: "Type or copy-paste your recipe here."
    },
    toolbarButtonActive: {
      header1: false
    }
  }),
  computed: {
    content: {
      get() {
        // @ts-ignore
        return this.value;
      },
      set(value) {
        // @ts-ignore
        this.$emit("input", value);
      }
    }
  },
  methods: {
    onMutate(mutationsList: MutationRecord[]) {
      for (const mutation of mutationsList) {
        if (
          mutation.type == "attributes" &&
          mutation.attributeName == "class"
        ) {
          const target = mutation.target as any;
          if (
            target.classList.contains("ql-active") &&
            !target.classList.contains("v-btn--active")
          ) {
            target.classList.add("v-btn--active");
          } else if (
            !target.classList.contains("ql-active") &&
            target.classList.contains("v-btn--active")
          ) {
            target.classList.remove("v-btn--active");
          }
        }
      }
    }
  }
});
</script>

<style lang="css">
@import "~vue2-editor/dist/vue2-editor.css";

@import "~quill/dist/quill.core.css";

.ql-editor {
	padding: 16px 32px;
}
.ql-container {
  font-family: inherit !important;
}
.ql-editor.ql-blank::before {
  left: 32px
}
.theme--light .ql-editor.ql-blank::before {
  color: #444;
}
.theme--dark .ql-editor.ql-blank::before {
  color: #aaa;
}
.ql-editor.ql-blank::before {
  left: 32px
}
</style>
