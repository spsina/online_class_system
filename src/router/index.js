import Vue from 'vue'
import VueRouter from 'vue-router'
import ListClass from '../components/class/ListClass.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/class/list',
      name: 'Class-List',
      component: ListClass
    },
    {
      path: '/class/list',
      name: 'Class-List',
      component: ListClass
    },
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
