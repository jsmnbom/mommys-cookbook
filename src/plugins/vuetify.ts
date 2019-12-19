import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

var vuetify = new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: colors.deepPurple.lighten2, //'#C2185B',
        accent: colors.purple.lighten1, //'#03A9F4',
        secondary: colors.pink.darken1, //'#009688',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      },
      light: {
        primary: colors.deepPurple.darken2, //'#EC407A',
        accent: colors.deepPurple.darken1, //'#03A9F4',
        secondary: colors.pink.lighten1, //'#009688',
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
