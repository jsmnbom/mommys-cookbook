import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import './plugins/vue-meta';
import './plugins/vue-dompurify-html';

Vue.config.productionTip = false

const app = new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// @ts-ignore
store.$app = app
