import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import Home from '@/views/Home.vue'
import Cookbook from '@/views/Cookbook.vue'
import Recipe from '@/views/Recipe.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/cookbook/:cookbookId',
    name: 'cookbook',
    component: Cookbook,
    props: true
  },
  {
    path: '/cookbook/:cookbookId/recipe/:recipeId',
    name: 'recipe',
    component: Recipe,
    props: true
  },
  {
    path: '/cookbook/:cookbookId/recipe/:recipeId/ingredients',
    name: 'recipe/ingredients',
    component: Recipe,
    meta: { transitionName: 'slide' },
    props: (route: Route) => ({ ingredients: true, ...route.params })
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from, savedPosition);
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
        console.log(position)
        setTimeout(function() {
          resolve(position);
        }, 20);
      });
    });
  }

})

export default router
