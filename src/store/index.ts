import Vue from 'vue'
import Vuex from 'vuex'
import { firebase, auth, UserInfo, CookbookValue, CookbookList, RecipeList, QuerySnapshot, RecipeValue, db } from '@/firebase'

Vue.use(Vuex)

const state: {
  userInfo: UserInfo | null,
  loggedIn: boolean,
  authLoaded: boolean,
  showDrawer: boolean,
  cookbooks: CookbookList,
  recipes: { [id: string]: RecipeList },
  bottomNavActive: string | null,
  actionButton: string | null,
  cookbookDialogActive: boolean,
  cookbookDialogKey: string | null
} = {
  userInfo: null,
  loggedIn: false,
  authLoaded: false,
  showDrawer: false,
  cookbooks: {},
  recipes: {},
  bottomNavActive: null,
  actionButton: null,
  cookbookDialogActive: false,
  cookbookDialogKey: null
};

const store = new Vuex.Store({
  state: state,
  mutations: {
    storeUser(state, userInfo: UserInfo) {
      state.userInfo = userInfo;
      state.loggedIn = true;
    },
    logoutUser(state) {
      state.userInfo = null;
      state.loggedIn = false;
    },
    doneLoadingAuth(state) {
      state.authLoaded = true;
    },
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
    setRecipes(state, { cookbookId, recipes }) {
      Vue.set(state.recipes, cookbookId, recipes);
    },
    setBottomNavActive(state, bottomNavActive) {
      state.bottomNavActive = bottomNavActive;
    },
    setActionButton(state, actionButton) {
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
    }
  },
  actions: {
    login({ commit }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then((result: any) => {
        commit('storeUser', result.user!)
      }).catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        commit('logoutUser')
      });
    },
    logout({ commit }) {
      // @ts-ignore
      auth.signOut().then(() => {
        commit('logoutUser')
      }).catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    },
    fetchRecipes({ commit }, cookbookId) {
      console.log('fetchrecipes', cookbookId);
      commit("clearRecipes", cookbookId);
      const inner = (querySnapshot: QuerySnapshot) => {
        commit("setRecipes", {
          cookbookId,
          recipes: querySnapshot.docs.reduce((map: RecipeList, doc) => {
            const data = doc.data();
            const cookbook = RecipeValue.fromObject(data);
            map[doc.id] = cookbook;
            return map;
          }, {})
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
          }
          if (change.type === "removed") {
            commit("removeCookbook", change.doc.id);
          }
        });
      };
      db.collection("cookbooks")
        .where("authorUid", "==", this.state.userInfo!.uid)
        .onSnapshot(inner);
      db.collection("cookbooks")
        .where("sharedWith", "array-contains", this.state.userInfo!.email)
        .onSnapshot(inner);
    }
  },
  getters: {
    userPhotoURL: state => {
      return state.loggedIn ? state.userInfo!.photoURL : null
    },
    userDisplayName: (state) => {
      return state.loggedIn ? state.userInfo!.displayName : "DisplayName"
    }
  }
});

// @ts-ignore
auth.onAuthStateChanged((user: UserInfo | null) => {
  if (user) {
    store.commit('storeUser', user)
  } else {
    store.commit('logoutUser')
  }
  store.commit('doneLoadingAuth')
});

export default store;