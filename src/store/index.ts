import Vue from "vue"
import Vuex, { Payload, Store } from 'vuex'
import router from "@/router"
import { firebase, auth, UserInfo, CookbookValue, CookbookList, RecipeList, QuerySnapshot, RecipeValue, db } from "@/firebase"
import VuexPersistence from 'vuex-persist'

import account from './modules/account';

Vue.use(Vuex)

type ActionButton = { icon: string, action?: string, mutation?: string }

interface State {
  showDrawer: boolean
  cookbooks: CookbookList
  recipes: { [id: string]: RecipeList }
  bottomNavActive: string | null
  actionButton: ActionButton | null
  cookbookDialogActive: boolean
  cookbookDialogKey: string | null
  currentCookbookId: string | null
  editingRecipe: boolean
  darkTheme: boolean
  cookbookSortBy: string,
  cookbookSortByDesc: boolean,
  cookbookTagFilters: string[],
  cookbookTagFiltersAnd: boolean,
  cookbookSearch: string
}

const state: State = {
  showDrawer: false,
  cookbooks: {},
  recipes: {},
  bottomNavActive: null,
  actionButton: null,
  cookbookDialogActive: false,
  cookbookDialogKey: null,
  currentCookbookId: null,
  editingRecipe: false,
  darkTheme: false,
  cookbookSortBy: "lastEdited",
  cookbookSortByDesc: true,
  cookbookTagFilters: [],
  cookbookTagFiltersAnd: false,
  cookbookSearch: ""
};


const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
  reducer: (state) => ({ darkTheme: state.darkTheme }),
  filter: (mutation) => mutation.type == 'toggleDarkTheme'
})

const store = new Vuex.Store({
  state: state,
  modules: {
    account
  },
  plugins: [vuexLocal.plugin],
  mutations: {
    toggleDrawer(state) {
      state.showDrawer = !state.showDrawer;
    },
    setDrawer(state, open: boolean) {
      state.showDrawer = open;
    },
    clearCookbooks(state) {
      state.cookbooks = {}
    },
    addOrModifyCookbook(state, { cookbookId, cookbook }) {
      state.cookbooks = {
        ...state.cookbooks,
        [cookbookId]: cookbook
      }
    },
    removeCookbook(state, cookbookId) {
      Vue.delete(state.cookbooks, cookbookId);
    },
    clearRecipes(state, cookbookId) {
      Vue.set(state.recipes, cookbookId, {});
    },
    addOrModifyRecipe(state, { cookbookId, recipeId, recipe }) {
      Vue.set(state.recipes, cookbookId, {
        ...state.recipes[cookbookId],
        [recipeId]: recipe
      });
    },
    removeRecipe(state, { cookbookId, recipeId }) {
      Vue.delete(state.recipes[cookbookId], recipeId);
    },
    setBottomNavActive(state, bottomNavActive) {
      state.bottomNavActive = bottomNavActive;
    },
    setActionButton(state, actionButton: ActionButton | null) {
      state.actionButton = actionButton;
    },
    createCookbook(state) {
      state.cookbookDialogKey = null;
      state.cookbookDialogActive = true;
    },
    closeCookbookDialog(state) {
      state.cookbookDialogKey = null;
      state.cookbookDialogActive = false;
    },
    editCookbook(state, cookbookId) {
      state.cookbookDialogKey = cookbookId;
      state.cookbookDialogActive = true;
    },
    editRecipe(state) {
      state.editingRecipe = true;
    },
    saveRecipe(state) {
      state.editingRecipe = false;
    },
    setCurrentCookbookId(state, currentCookbookId) {
      state.currentCookbookId = currentCookbookId;
    },
    toggleDarkTheme(state) {
      state.darkTheme = !state.darkTheme
    },
    setCookbookSortBy(state, cookbookSortBy) {
      state.cookbookSortBy = cookbookSortBy;
    },
    setCookbookSortByDesc(state, cookbookSortByDesc) {
      state.cookbookSortByDesc = cookbookSortByDesc;
    },
    setCookbookTagFilters(state, cookbookTagFilters) {
      state.cookbookTagFilters = cookbookTagFilters;
    },
    setCookbookTagFiltersAnd(state, cookbookTagFiltersAnd) {
      state.cookbookTagFiltersAnd = cookbookTagFiltersAnd;
    },
    setCookbookSearch(state, cookbookSearch) {
      state.cookbookSearch = cookbookSearch;
    }
  },
  getters: {
    cookbookTags: state => (cookbookId: string): string[] => {
      return cookbookId in state.recipes ? [...new Set(Object.values(state.recipes[cookbookId]).map((recipe: any) => recipe.tags).flat())] : []
    }
  },
  actions: {
    fetchRecipes({ commit }, cookbookId) {
      commit("clearRecipes", cookbookId);
      const inner = (querySnapshot: QuerySnapshot) => {
        querySnapshot.docChanges().forEach(function(change) {
          if (change.type === "added" || change.type === "modified") {
            const data = change.doc.data();
            const recipe = RecipeValue.fromObject(data);
            commit("addOrModifyRecipe", { cookbookId, recipeId: change.doc.id, recipe });
          } else if (change.type === "removed") {
            commit("removeRecipe", { cookbookId, recipeId: change.doc.id });
          }
        });
      };
      db.collection("recipes")
        .where("cookbookId", "==", cookbookId)
        .onSnapshot(inner);
    },
    fetchCookbooks({ commit }) {
      const inner = (querySnapshot: QuerySnapshot) => {
        querySnapshot.docChanges().forEach(function(change) {
          if (change.type === "added" || change.type === "modified") {
            const data = change.doc.data();
            const cookbook = CookbookValue.fromObject(data);
            commit("addOrModifyCookbook", { cookbookId: change.doc.id, cookbook });
          } else if (change.type === "removed") {
            commit("removeCookbook", change.doc.id);
          }
        });
      };
      db.collection("cookbooks")
        .where("authorUid", "==", this.state.account.userInfo!.uid)
        .onSnapshot(inner);
      db.collection("cookbooks")
        .where("sharedWith", "array-contains", this.state.account.userInfo!.email)
        .onSnapshot(inner);
    },
    createRecipe({ commit, state }) {
      if (state.currentCookbookId) {
        const recipe = new RecipeValue("", "", "", [], [], 0, 0, state.currentCookbookId, new Date(), "");

        db.collection("recipes").add(recipe.toObject()).then((docRef) => {
          // @ts-ignore
          this.$app.$dialog.message.info("Created new recipe", {
            position: "bottom"
          });
          console.log(`Created new recipe with id: ${docRef.id}`);
          router.push({
            "name": "recipe", params: {
              cookbookId: state.currentCookbookId!,
              recipeId: docRef.id
            }
          });
          commit("editRecipe");

        }).catch((error) => {
          // @ts-ignore
          this.$app.$dialog.message.error("Error creating recipe", {
            position: "bottom"
          });
          console.log("Error creating recipe", error);
        });
      } else {
        console.error("No current cookbook id!")
      }
    }
  }
});

// @ts-ignore
auth.onAuthStateChanged((user: UserInfo | null) => {
  if (user) {
    store.commit("account/store", user)
  } else {
    store.commit("account/clear")
  }
  store.commit("account/doneLoading")
});

export default store;