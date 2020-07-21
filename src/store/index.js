import Vue from 'vue'
import Vuex from 'vuex'
import ClassStore from './moduls/class.store'
import UserStore from './moduls/users.store'
import AccountStore from './moduls/account.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {},
  mutations: {
  },
  actions: {
  },
  modules: {
    ClassStore,
    UserStore,
    AccountStore
  }
})
