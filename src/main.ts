import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'


// @ts-ignore
import MdToolbar from 'vue-material/dist/components/MdToolbar';
// @ts-ignore
import MdButton from 'vue-material/dist/components/MdButton';
// @ts-ignore
import MdAvatar from 'vue-material/dist/components/MdAvatar';
// @ts-ignore
import MdMenu from 'vue-material/dist/components/MdMenu';
// @ts-ignore
import MdList from 'vue-material/dist/components/MdList';
// @ts-ignore
import MdIcon from 'vue-material/dist/components/MdIcon';
// @ts-ignore
import MdEmptyState from 'vue-material/dist/components/MdEmptyState';
// @ts-ignore
import MdProgress from 'vue-material/dist/components/MdProgress';
// @ts-ignore
import MdDrawer from 'vue-material/dist/components/MdDrawer';
// @ts-ignore
import MdContent from 'vue-material/dist/components/MdContent';
// @ts-ignore
import MdCard from 'vue-material/dist/components/MdCard';


Vue.use(MdToolbar);
Vue.use(MdButton);
Vue.use(MdAvatar);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdIcon);
Vue.use(MdEmptyState);
Vue.use(MdProgress);
Vue.use(MdDrawer);
Vue.use(MdContent);
Vue.use(MdCard);


Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
