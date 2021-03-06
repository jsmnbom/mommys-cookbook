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
        primary: colors.purple.lighten2,
        accent: colors.purple.lighten1,
        secondary: colors.pink.darken1,
        success: colors.green.base,
        info: colors.blue.base,
        warning: colors.orange.darken1,
        error: colors.red.accent2
      },
      light: {
        primary: colors.purple.darken2,
        accent: colors.purple.darken1,
        secondary: colors.pink.darken1,
        success: colors.green.base,
        info: colors.blue.base,
        warning: colors.orange.darken1,
        error: colors.red.accent2
      }
    },
    options: {
      customProperties: true,
    }
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

export default vuetify;
