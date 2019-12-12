import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

// @ts-ignore
import {MdToolbar} from 'vue-material/dist/components';
// @ts-ignore
import {MdButton} from 'vue-material/dist/components';
// @ts-ignore
import {MdAvatar} from 'vue-material/dist/components';
// @ts-ignore
import {MdMenu} from 'vue-material/dist/components';
// @ts-ignore
import {MdIcon} from 'vue-material/dist/components';
// @ts-ignore
import {MdList} from 'vue-material/dist/components';
// @ts-ignore
import {MdEmptyState} from 'vue-material/dist/components';
// @ts-ignore
import {MdProgress} from 'vue-material/dist/components';
// @ts-ignore
import {MdDrawer} from 'vue-material/dist/components';
// @ts-ignore
import {MdApp} from 'vue-material/dist/components';
// @ts-ignore
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
