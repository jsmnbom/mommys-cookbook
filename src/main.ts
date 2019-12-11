import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import {MdToolbar} from 'vue-material/dist/components';
import {MdButton} from 'vue-material/dist/components';
import {MdAvatar} from 'vue-material/dist/components';
import {MdMenu} from 'vue-material/dist/components';
import {MdIcon} from 'vue-material/dist/components';
import {MdList} from 'vue-material/dist/components';
import {MdEmptyState} from 'vue-material/dist/components';
import {MdProgress} from 'vue-material/dist/components';
import {MdDrawer} from 'vue-material/dist/components';
import {MdApp} from 'vue-material/dist/components';
import {MdContent} from 'vue-material/dist/components';

Vue.use(MdToolbar);
Vue.use(MdButton);
Vue.use(MdAvatar);
Vue.use(MdMenu);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdEmptyState);
Vue.use(MdProgress);
Vue.use(MdDrawer);
Vue.use(MdApp);
Vue.use(MdContent);

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
