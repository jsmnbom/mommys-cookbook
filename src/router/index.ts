import Vue from "vue"
import VueRouter, { Route } from "vue-router"
import Home from "@/views/Home.vue"
import Cookbook from "@/views/Cookbook.vue"
import Recipe from "@/views/Recipe.vue"

import DefaultNavbar from "@/components/DefaultNavbar.vue";
import CookbookNavbar from "@/components/cookbook/CookbookNavbar.vue";
import RecipeNavbar from "@/components/recipe/RecipeNavbar.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    components: {
      default: Home,
      navbar: DefaultNavbar
    }
  },
  {
    path: "/cookbook/:cookbookId",
    name: "cookbook",
    components: {
      default: Cookbook,
      navbar: CookbookNavbar
    },
    props: {
      default: true,
      navbar: true
    }
  },
  {
    path: "/cookbook/:cookbookId/recipe/:recipeId",
    name: "recipe",
    components: {
      default: Recipe,
      navbar: RecipeNavbar
    },
    props: {
      default: true,
      navbar: false
    }
  },
  {
    path: "/cookbook/:cookbookId/recipe/:recipeId/ingredients",
    name: "recipe/ingredients",
    components: {
      default: Recipe,
      navbar: DefaultNavbar
    },
    meta: { transitionName: "slide" },
    props: {
      default: (route: Route) => ({ ingredients: true, ...route.params }),
      navbar: false
    }
  }
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
]

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Default scroll position will be 0, 0 unless overridden by a saved position
    const position = {
      x: 0,
      y: 0
    };

    // Override default with saved position (if it exists)
    if (savedPosition) {
      position.x = savedPosition.x;
      position.y = savedPosition.y;
    }

    if (to.meta.scroll) {
      position.x = to.meta.scroll.x;
      position.y = to.meta.scroll.y;
      delete to.meta.scroll
    }

    // Listen for scrollBeforeEnter event and set scroll position
    return new Promise(resolve => {
      // @ts-ignore
      this.app.$root.$once("scrollBeforeEnter", () => {
        setTimeout(function() {
          resolve(position);
        }, 20);
      });
    });
  }

})

export default router
