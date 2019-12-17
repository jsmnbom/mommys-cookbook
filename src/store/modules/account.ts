import { firebase, auth, UserInfo, CookbookValue, CookbookList, RecipeList, QuerySnapshot, RecipeValue, db } from "@/firebase"
import { Module } from 'vuex';

interface AccountState {
  loggedIn: boolean
  userInfo: UserInfo | null
  loaded: boolean
}

const accountModule: Module<AccountState, any> = {
  namespaced: true,
  state: {
    loggedIn: false,
    userInfo: null,
    loaded: false
  },
  mutations: {
    store(state, userInfo) {
      state.userInfo = userInfo;
      state.loggedIn = true;
    },
    clear(state) {
      state.userInfo = null;
      state.loggedIn = false;
    },
    doneLoading(state) {
      state.loaded = true;
    }
  },
  actions: {
    async login({ commit }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      try {
        const result = await auth.signInWithPopup(provider)
        commit("store", result.user!)
      } catch (e) {
        const errorCode = e.code;
        const errorMessage = e.message;
        const email = e.email;
        const credential = e.credential;
        console.error(errorCode, errorMessage, email, credential);
        commit("clear")
      }
    },
    async logout({ commit }) {
      try {
        await auth.signOut()
      } catch (e) {
        const errorCode = e.code;
        const errorMessage = e.message;
        console.error(errorCode, errorMessage);
      } finally {
        commit("clear")
      }
    }
  }
}

export default accountModule