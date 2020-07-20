import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    treeShake: true,
    defaultAssets: {
        font: {
            family: 'Times New Roman'
        },
    },
    rtl: true
});
