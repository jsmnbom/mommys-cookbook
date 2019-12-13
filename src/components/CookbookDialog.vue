<template>
  <v-dialog
    :value="cookbookDialogActive"
    persistent
    max-width="500px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :hide-overlay="$vuetify.breakpoint.xsOnly"
    transition="dialog-bottom-transition"
  >
    <v-toolbar dark color="primary" v-if="$vuetify.breakpoint.xsOnly">
      <v-btn
        icon
        dark
        @click="$store.commit('closeCookbookDialog')"
        :disabled="saving"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark text @click="onSave" :disabled="saving">{{
          editing ? "Save" : "Create"
        }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card :loading="saving">
      <v-card-text>
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="auto">
              <v-avatar size="128" color="grey lighten-3">
                <v-img v-if="img" :src="img" />
                <v-icon v-else x-large>mdi-image</v-icon>
                <v-btn
                  fab
                  small
                  class="avatar-btn-bottom-right"
                  :disabled="saving"
                  @click="$refs.imgUpload.click()"
                >
                  <v-icon>mdi-camera</v-icon>
                </v-btn>
              </v-avatar>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col cols="12" md="8">
              <v-text-field
                class="input-center"
                solo
                label="Cookbook title"
                required
                v-model="title"
              ></v-text-field>
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
      <v-card-actions :class="{ 'justify-center': $vuetify.breakpoint.xsOnly }">
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
          :disabled="saving"
          @click="onSave"
          v-if="!$vuetify.breakpoint.xsOnly"
          >{{ editing ? "Save" : "Create" }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import { db, CookbookValue } from "@/firebase";

export default Vue.extend({
  name: "CookbookDialog",
  data: () => ({
    imgFocus: false,
    img: "",
    title: "",
    saving: false
  }),
  computed: {
    ...mapState(["cookbookDialogActive", "cookbookDialogKey"]),
    editing() {
      return this.cookbookDialogKey != null;
    },
    cookbook() {
      return this.cookbookDialogKey
        ? this.$store.state.cookbooks[this.cookbookDialogKey]
        : null;
    }
  },
  methods: {
    onImgUpload(
      event: any /* https://github.com/microsoft/TypeScript/issues/31816 */
    ) {
      this.img = URL.createObjectURL(event.target.files[0]);
    },
    onSave() {
      this.saving = true;
      if (!this.editing) {
        // @ts-ignore
        this.onCreate();
        return;
      }
      const newCookbook = CookbookValue.fromObject(
        (this.cookbook as CookbookValue).toObject()
      );
      let dirty = false;
      if (this.title !== (this.cookbook as CookbookValue).title) {
        dirty = true;
        newCookbook.title = this.title;
      } 

      if (dirty) {
        db.collection("cookbooks")
          .doc(this.cookbookDialogKey)
          .update(newCookbook.toObject())
          .then(() => {
            // notificationSuccess('Cookbook successfully updated!');
            this.saving = false;
            this.$store.commit("closeCookbookDialog");
          })
          .catch(error => {
            // dialogAlert(`Error updating cookbook: ${error}`);
            this.saving = false;
            this.$store.commit("closeCookbookDialog");
          });
      }
    },
    onCreate() {
      const cookbook = new CookbookValue(
        this.title,
        "",
        this.$store.state.userInfo!.displayName!,
        this.$store.state.userInfo!.uid,
        [],
        ""
      );

      console.log("creating", cookbook);

      db.collection("cookbooks")
        .add(cookbook.toObject())
        .then(docRef => {
          //   notificationSuccess(
          //     `Successfully created new cookbook with id: ${docRef.id}`
          //   );
          console.log(docRef);
          this.saving = false;
          this.$store.commit("closeCookbookDialog");
          this.$router.push({
            name: "cookbook",
            params: { cookbookId: docRef.id }
          });
        })
        .catch(error => {
          console.log(error);
          this.$store.commit("closeCookbookDialog");
          this.saving = false;
          //   dialogAlert(`Error creating cookbook: ${error}`);
        });
    },
    async onDelete() {
      let res = await this.$dialog.confirm({
        text: `Do you really want to delete ${this.title}?<br>This action cannot be undone.`,
        title: "",
        actions: {
          false: "No",
          true: {
            color: "red",
            text: "Yes I do",
            handle: () => {
              // @ts-ignore
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
            // notificationSuccess('Cookbook successfully deleted!');
            this.$store.commit("closeCookbookDialog");
            resolve();
          })
          .catch(error => {
            this.$store.commit("closeCookbookDialog");
            resolve();
            // dialogAlert(`Error removing cookbook: ${error}`);
          });
      });
    }
  },
  created() {
    this.$store.watch(
      state => state.cookbookDialogActive,
      () => {
        if (this.cookbook) {
          this.title = (this.cookbook as CookbookValue).title;
          this.img = (this.cookbook as CookbookValue).thumbURL;
        } else {
          this.title = "";
          this.img = "";
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
.input-center >>> .v-label {
  width: 100%;
  text-align: center;
}
.input-center >>> input {
  text-align: center;
}
</style>
