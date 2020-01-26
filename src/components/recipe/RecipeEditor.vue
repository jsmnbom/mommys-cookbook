<template>
  <div class="quillWrapper">
    <v-card id="toolbar" class="px-3">
      <v-row class="align-center">
        <v-col class="py-1 col-auto">
          <v-btn
            icon
            class="ql-header"
            value="1"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatHeader1 }}</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-header"
            value="2"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatHeader2 }}</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-header"
            value="3"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatHeader3 }}</v-icon>
          </v-btn>
        </v-col>
        <v-col class="py-1 col-auto">
          <v-btn icon class="ql-bold" v-mutate.attr.class="onMutate">
            <v-icon>{{ mdiFormatBold }}</v-icon>
          </v-btn>
          <v-btn icon class="ql-italic" v-mutate.attr.class="onMutate">
            <v-icon>{{ mdiFormatItalic }}</v-icon>
          </v-btn>
          <v-btn icon class="ql-underline" v-mutate.attr.class="onMutate">
            <v-icon>{{ mdiFormatUnderline }}</v-icon>
          </v-btn>
          <v-btn icon class="ql-strike" v-mutate.attr.class="onMutate">
            <v-icon>{{ mdiFormatStrikethrough }}</v-icon>
          </v-btn>
        </v-col>
        <v-col class="py-1 col-auto">
          <v-btn
            icon
            class="ql-list"
            value="ordered"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatListNumbered }}</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-list"
            value="bullet"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatListBulleted }}</v-icon>
          </v-btn>
        </v-col>
        <v-col class="py-1 col-auto">
          <v-btn icon class="ql-align" value="" v-mutate.attr.class="onMutate">
            <v-icon>{{ mdiFormatAlignLeft }}</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-align"
            value="center"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatAlignCenter }}</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ql-align"
            value="right"
            v-mutate.attr.class="onMutate"
          >
            <v-icon>{{ mdiFormatAlignRight }}</v-icon>
          </v-btn>
        </v-col>
        <v-col class="py-0 col-auto">
          <v-btn icon class="ql-clean" v-mutate.attr.class="onMutate">
            <v-icon>{{ mdiFormatClear }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <div ref="quillContainer"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// @ts-ignore
import Quill from "quill/core";
// @ts-ignore
import { AlignClass, AlignStyle } from "quill/formats/align";

// @ts-ignore
import Header from "quill/formats/header";
// @ts-ignore
import List, { ListItem } from "quill/formats/list";

// @ts-ignore
import { SizeClass, SizeStyle } from "quill/formats/size";

// @ts-ignore
import Bold from "quill/formats/bold";
// @ts-ignore
import Italic from "quill/formats/italic";
// @ts-ignore
import Link from "quill/formats/link";
// @ts-ignore
import Script from "quill/formats/script";
// @ts-ignore
import Strike from "quill/formats/strike";
// @ts-ignore
import Underline from "quill/formats/underline";

// @ts-ignore
import Toolbar from "quill/modules/toolbar";

// @ts-ignore
import Tooltip from "quill/ui/tooltip";

Quill.register(
  {
    "attributors/class/align": AlignClass,
    "attributors/class/size": SizeClass,

    "attributors/style/align": AlignStyle,
    "attributors/style/size": SizeStyle
  },
  true
);

Quill.register(
  {
    "formats/align": AlignClass,
    "formats/size": SizeClass,
    "formats/header": Header,

    "formats/list": List,
    "formats/list/item": ListItem,

    "formats/bold": Bold,
    "formats/italic": Italic,
    "formats/link": Link,
    "formats/script": Script,
    "formats/strike": Strike,
    "formats/underline": Underline,

    "modules/toolbar": Toolbar
  },
  true
);

Quill.register(AlignStyle, true);

import {
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatUnderline,
  mdiFormatStrikethrough,
  mdiFormatListNumbered,
  mdiFormatListBulleted,
  mdiFormatAlignLeft,
  mdiFormatAlignCenter,
  mdiFormatAlignRight,
  mdiFormatAlignJustify,
  mdiFormatClear
} from "@mdi/js";

export default Vue.extend({
  name: "RecipeEditor",
  props: ["value"],
  data: () => ({
    mdiFormatHeader1,
    mdiFormatHeader2,
    mdiFormatHeader3,
    mdiFormatBold,
    mdiFormatItalic,
    mdiFormatUnderline,
    mdiFormatStrikethrough,
    mdiFormatListNumbered,
    mdiFormatListBulleted,
    mdiFormatAlignLeft,
    mdiFormatAlignCenter,
    mdiFormatAlignRight,
    mdiFormatAlignJustify,
    mdiFormatClear,
    editorOptions: {
      modules: {
        toolbar: {
          container: "#toolbar"
        }
      },
      placeholder: "Type or copy-paste your recipe here."
    },
    quill: null as null | Quill,
    placeholder: "Type your recipe here"
  }),
  watch: {
    value(val) {
      if (val != this.quill.root.innerHTML && !this.quill.hasFocus()) {
        //this.quill.root.innerHTML = val;
      }
    }
  },
  mounted() {
    this.registerPrototypes();
    this.initializeEditor();
  },
  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  },
  methods: {
    initializeEditor() {
      this.setupQuillEditor();
      this.handleInitialContent();
      this.registerEditorEventListeners();
      this.$emit("ready", this.quill);
    },
    setupQuillEditor() {
      let editorConfig = {
        debug: false,
        modules: {
          toolbar: "#toolbar"
        },
        placeholder: this.placeholder
      };
      this.quill = new Quill(this.$refs.quillContainer, editorConfig);
    },
    registerPrototypes() {
      Quill.prototype.getHTML = function() {
        return this.container.querySelector(".ql-editor").innerHTML;
      };
      Quill.prototype.getWordCount = function() {
        return this.container.querySelector(".ql-editor").innerHTML.length;
      };
    },
    registerEditorEventListeners() {
      this.quill.on("text-change", this.handleTextChange);
      this.quill.on("selection-change", this.handleSelectionChange);
      this.listenForEditorEvent("text-change");
      this.listenForEditorEvent("selection-change");
      this.listenForEditorEvent("editor-change");
    },
    listenForEditorEvent(type: any) {
      this.quill.on(type, (...args: any) => {
        this.$emit(type, ...args);
      });
    },
    handleInitialContent() {
      if (this.value) this.quill.root.innerHTML = this.value; // Set initial editor content
    },
    handleSelectionChange(range: any, oldRange: any) {
      if (!range && oldRange) this.$emit("blur", this.quill);
      else if (range && !oldRange) this.$emit("focus", this.quill);
    },
    handleTextChange(delta: any, oldContents: any) {
      let editorContent =
        this.quill.getHTML() === "<p><br></p>" ? "" : this.quill.getHTML();
      this.$emit("input", editorContent);
    },
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
.ql-hidden {
  display: none;
}
.ql-editor {
  padding: 16px 32px;
  white-space: pre-wrap;
}
</style>
