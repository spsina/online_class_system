import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/index';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import '@/styles/_fonts.scss'

Vue.config.productionTip = false


new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
