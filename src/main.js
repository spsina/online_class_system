import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/index';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import '@/styles/_fonts.scss'
import Axios from 'axios'
import toasted from 'vue-toasted';

Vue.use(toasted)

// setup axios common defaults
Axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

// set auth header if logged in
if (store.getters.isLoggedIn){
  Axios.defaults.headers.common['Authorization'] = 'token ' + store.getters.authToken;
}

// setup global error handler
// Axios.interceptors.response.use(
//     function(response) {
//       return response;
//     },
//     function(error) {
//       if (error.response && error.response.status === 401) {
//         Vue.toasted.error("دسترسی غیرمجاز");
//       } else if (error.response && error.response.status === 400){
//         Vue.toasted.error("ورودی های خود را کنترل کنید");
//       }
//     }
// );

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }

  if (to.matched.some(record => record.meta.hideForAuth)) {
    if (store.getters.isLoggedIn) {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }

})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
