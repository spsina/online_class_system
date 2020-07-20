import Vue from 'vue'
import Vuex from 'vuex'
import ClassStore from './class/index'
import UserStore from './users/index'

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
    UserStore
  }
})
