import Vue from 'vue'
import Vuex from 'vuex'
import { auth, UserInfo } from 'firebase';
import { CookbookValue } from '@/firebase-config';

Vue.use(Vuex)

const state: {
  userInfo: UserInfo | null,
  loggedIn: boolean,
  authLoaded: boolean,
  showDrawer: boolean,
  cookbooks: {[key: string]: CookbookValue},
} = {
  userInfo: null,
  loggedIn: false,
  authLoaded: false,
  showDrawer: false,
  cookbooks: {}
};

const store = new Vuex.Store({
  state: state,
  mutations: {
    storeUser(state, userInfo) {
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
    clearCookbooks(state) {
      state.cookbooks = {}
    },
    addCookbooks(state, cookbooks) {
      state.cookbooks = {
        ...state.cookbooks,
        ...cookbooks
      }
    }
  },
  actions: {
    login({ commit }) {
      const provider = new auth.GoogleAuthProvider();
      auth().signInWithPopup(provider).then((result: any) => {
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
      auth().signOut().then(() => {
        commit('logoutUser')
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
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

auth().onAuthStateChanged((user: UserInfo | null) => {
  if (user) {
    store.commit('storeUser', user)
  } else {
    store.commit('logoutUser')
  }
  store.commit('doneLoadingAuth')
});

export default store;