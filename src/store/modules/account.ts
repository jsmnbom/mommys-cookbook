import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { firebase, auth, UserInfo, CookbookValue, CookbookList, RecipeList, QuerySnapshot, RecipeValue, db } from "@/firebase"


@Module({namespaced: true, name: "cookbooks"})
export default class Account extends VuexModule {
  userInfo: UserInfo | null = null
  loggedIn = false
  loaded = false

  @Mutation
  store(userInfo: UserInfo) {
    this.userInfo = userInfo;
    this.loggedIn = true;
  }
  @Mutation
  clear() {
    this.userInfo = null;
    this.loggedIn = false;
  }
  @Mutation
  doneLoading() {
    this.loaded = true;
  }

  @Action
  async login() {
    const provider = new firebase.auth.GoogleAuthProvider()
    try {
      const result = await auth.signInWithPopup(provider)
      this.context.commit("store", result.user!)
    } catch (e) {
      const errorCode = e.code;
      const errorMessage = e.message;
      const email = e.email;
      const credential = e.credential;
      this.context.commit("clear")
    }
  }

  @Action
  async logout() {
    try {
      await auth.signOut()
    } catch (e) {
      const errorCode = e.code;
      const errorMessage = e.message;
    } finally {
      this.context.commit("remove")
    }
  }
}

