import Vue from "vue"
import VueRouter, { Route } from "vue-router"

const Home = () => import(/* webpackChunkName: "Home" */'@/views/Home.vue');
const Cookbook = () => import(/* webpackChunkName: "Cookbook" */'@/views/Recipe.vue');
const Recipe = () => import(/* webpackChunkName: "Recipe" */'@/views/Recipe.vue');

const DefaultNavbar = () => import(/* webpackChunkName: "DefaultNavbar" */'@/components/DefaultNavbar.vue');
const CookbookNavbar = () => import(/* webpackChunkName: "CookbookNavbar" */'@/components/cookbook/CookbookNavbar.vue');
const RecipeNavbar = () => import(/* webpackChunkName: "RecipeNavbar" */'@/components/recipe/RecipeNavbar.vue');

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
    path: "/CookbookNavbar/:cookbookId",
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
  }
];

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
