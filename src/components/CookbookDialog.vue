<template>
  <v-dialog
    :value="cookbookDialogActive"
    persistent
    max-width="500px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :hide-overlay="$vuetify.breakpoint.xsOnly"
    transition="dialog-bottom-transition"
  >
    <v-form ref="form" lazy-validation v-model="valid">
      <v-toolbar dark color="primary" v-if="$vuetify.breakpoint.xsOnly">
        <v-btn
          icon
          dark
          @click="$store.commit('closeCookbookDialog')"
          :disabled="saving"
        >
          <v-icon>mdiClose</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="onSave" :disabled="saving || !valid">{{
            editing ? "Save" : "Create"
          }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card :loading="saving" style="height: calc(100vh - 56px);" class="d-flex flex-column">
        <template slot="progress">
          <v-progress-linear
            :value="uploadProgress"
            :indeterminate="uploadProgress == null"
            color="deep-purple accent-4"
          ></v-progress-linear>
        </template>
        <v-card-text class="grow">
          <v-container>
            <v-row justify="center" align="center">
              <v-col cols="auto">
                <v-avatar
                  size="128"
                  :class="{
                    grey: true,
                    'lighten-3': !$vuetify.theme.dark,
                    'darken-2': $vuetify.theme.dark
                  }"
                >
                  <v-img v-if="img" :src="img" />
                  <v-icon v-else x-large>mdiImage</v-icon>
                  <v-btn
                    fab
                    small
                    class="avatar-btn-bottom-right"
                    :disabled="saving"
                    @click="$refs.imgUpload.click()"
                  >
                    <v-icon>mdiCamera</v-icon>
                  </v-btn>
                </v-avatar>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col cols="12" md="8">
                <v-text-field
                  outlined
                  ref="title"
                  label="Cookbook title"
                  required
                  :rules="[() => !!title || 'This field is required']"
                  v-model="title"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="sharedWith"
                  :items="[]"
                  :search-input.sync="shareSearch"
                  label="Shared with"
                  outlined
                  deletable-chips
                  small-chips
                  multiple
                  persistent-hint
                  hint="Type email addresses to share with."
                  :rules="sharedWithRules"
                >
                  <template v-slot:no-data>
                    <v-list-item dense v-if="emailIsValid(shareSearch)">
                      <v-list-item-content>
                        <v-list-item-title>
                          Press <kbd>enter</kbd> to share with "<strong>{{
                            shareSearch
                          }}</strong
                          >"
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template></v-combobox
                >
              </v-col>
            </v-row>
          </v-container>
          <input
            v-show="false"
            ref="imgUpload"
            type="file"
            @change="onImgUpload"
          />
        </v-card-text>
        <v-spacer />
        <v-card-actions
          :class="{ 'justify-center': $vuetify.breakpoint.xsOnly }"
        >
          <v-btn
            text
            color="red darken-1"
            @click="onDelete"
            v-if="editing"
            :disabled="saving"
          >
            Delete cookbook
          </v-btn>
          <v-spacer v-if="!$vuetify.breakpoint.xsOnly"></v-spacer>
          <v-btn
            v-if="!$vuetify.breakpoint.xsOnly"
            color="blue darken-1"
            text
            :disabled="saving"
            @click="$store.commit('closeCookbookDialog')"
            >Close</v-btn
          >
          <v-btn
            color="blue darken-1"
            text
            :disabled="saving || !valid"
            @click="onSave"
            v-if="!$vuetify.breakpoint.xsOnly"
            >{{ editing ? "Save" : "Create" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { v4 as uuid } from "uuid";

import { compressImage, uploadFile } from "@/utils";
import { db, CookbookValue } from "@/firebase";

import {mdiClose, mdiImage, mdiCamera} from "@mdi/js";

export default Vue.extend({
  name: "CookbookDialog",
  data: () => ({
    mdiClose, mdiImage, mdiCamera,
    imgFocus: false,
    img: "",
    imgFile: null as null | File,
    title: "",
    saving: false,
    uploadProgress: null as null | number,
    sharedWith: [] as string[],
    shareSearch: null as null | string,
    valid: false
  }),
  computed: {
    ...mapState(["cookbookDialogActive", "cookbookDialogKey"]),
    editing(): boolean {
      return this.cookbookDialogKey != null;
    },
    sharedWithRules(): Array<boolean | string> {
      return this.sharedWith.map(
        email => this.emailIsValid(email) || `${email} is not a valid email.`
      );
    },
    cookbook(): CookbookValue | null {
      return this.cookbookDialogKey
        ? this.$store.state.cookbooks[this.cookbookDialogKey]
        : null;
    }
  },
  methods: {
    onImgUpload(
      event: any /* https://github.com/microsoft/TypeScript/issues/31816 */
    ) {
      this.imgFile = event.target.files[0];
      this.img = URL.createObjectURL(this.imgFile);
    },
    async onSave(): Promise<void> {
      if (!(this.$refs.form as any).validate()) {
        return;
      }

      this.saving = true;
      if (!this.editing) {
        await this.onCreate();
        return;
      }
      const newCookbook = CookbookValue.fromObject(this.cookbook!.toObject());
      let dirty = false;
      if (this.title !== this.cookbook!.title) {
        dirty = true;
        newCookbook.title = this.title;
      }
      if (this.img !== this.cookbook!.thumbURL) {
        dirty = true;
        newCookbook.thumbURL = await this.handleImage();
      }
      if (this.sharedWith !== this.cookbook!.sharedWith) {
        dirty = true;
        newCookbook.sharedWith = this.sharedWith;
      }

      if (dirty) {
        db.collection("cookbooks")
          .doc(this.cookbookDialogKey)
          .update(newCookbook.toObject())
          .then(() => {
            this.$dialog.message.info("Cookbook updated", {
              position: "bottom"
            });
            this.saving = false;
            this.$store.commit("closeCookbookDialog");
          })
          .catch(error => {
            this.$dialog.message.error("Error updating cookbook", {
              position: "bottom"
            });
            console.error(`Error updating cookbook:`, error);
            this.saving = false;
            this.$store.commit("closeCookbookDialog");
          });
      } else {
        this.saving = false;
        this.$store.commit("closeCookbookDialog");
      }
    },
    async handleImage(): Promise<string> {
      const blob = await compressImage(this.imgFile!, {
        width: 500,
        height: 500
      }).catch(error => {
        this.$dialog.message.error("Error uplading image", {
          position: "bottom"
        });
        console.error(`Error compressing image: `, error);
      });
      if (blob) {
        const downloadURL = await uploadFile(
          blob,
          `images/cookbook/${uuid()}.${this.imgFile!.name.split(".").pop()}`,
          progress => (this.uploadProgress = progress)
        ).catch(error => {
          this.$dialog.message.error("Error uplading image", {
            position: "bottom"
          });
          console.error(`Error uplading image:`, error);
        });
        this.uploadProgress = null;
        if (downloadURL) {
          return downloadURL;
        }
      }
      return "";
    },
    async onCreate() {
      const cookbook = new CookbookValue(
        this.title,
        this.$store.state.account.userInfo!.displayName!,
        this.$store.state.account.userInfo!.uid,
        this.sharedWith,
        this.img ? await this.handleImage() : ""
      );

      db.collection("cookbooks")
        .add(cookbook.toObject())
        .then(docRef => {
          this.$dialog.message.info("Created new cookbook", {
            position: "bottom"
          });
          console.log(`Created new cookbook with id: ${docRef.id}`);
          this.saving = false;
          this.$store.commit("closeCookbookDialog");
          this.$router.push({
            name: "cookbook",
            params: { cookbookId: docRef.id }
          });
        })
        .catch(error => {
          this.$dialog.message.error("Error creating cookbook", {
            position: "bottom"
          });
          this.$store.commit("closeCookbookDialog");
          this.saving = false;
          console.error(`Error creating cookbook:`, error);
        });
    },
    async onDelete() {
      await this.$dialog.confirm({
        text: `Do you really want to delete ${this.title}?<br>This action cannot be undone.`,
        title: "",
        actions: {
          false: "No",
          true: {
            color: "red",
            text: "Yes I do",
            handle: () => {
              return this._deleteCookbook(this.cookbookDialogKey);
            }
          }
        }
      });
    },
    async _deleteCookbook(cookbookId: string) {
      return new Promise(resolve => {
        db.collection("cookbooks")
          .doc(this.cookbookDialogKey)
          .delete()
          .then(() => {
            this.$dialog.message.info("Cookbook deleted", {
              position: "bottom"
            });
            console.log("Cookbook deleted!");
            this.$store.commit("closeCookbookDialog");
            resolve();
          })
          .catch(error => {
            this.$dialog.message.error("Error deleting cookbook", {
              position: "bottom"
            });
            this.$store.commit("closeCookbookDialog");
            resolve();
            console.error(`Error deleting cookbook:`, error);
          });
      });
    },
    emailIsValid(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  },
  mounted(): void {
    this.$store.watch(
      state => state.cookbookDialogActive,
      () => {
        if (this.$refs.form) (this.$refs.form as any).reset();
        if (this.cookbook) {
          this.title = this.cookbook.title;
          this.img = this.cookbook.thumbURL;
          this.sharedWith = this.cookbook.sharedWith;
        } else {
          this.title = "";
          this.img = "";
          this.sharedWith = [];
        }
      }
    );
  }
});
</script>

<style scoped>
.avatar-btn-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
