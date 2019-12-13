import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

Vue.use(Vuetify);

var vuetify = new Vuetify({
});

Vue.use(VuetifyDialog, {
    context: {
        vuetify
    }
})

export default vuetify;
