import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

Vue.use(Vuetify);

var vuetify = new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: '#C2185B',
        accent: '#03A9F4',
        secondary: '#009688',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      },
      light: {
        primary: '#EC407A',
        accent: '#03A9F4',
        secondary: '#009688',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      }
    }
  }
});

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

export default vuetify;
