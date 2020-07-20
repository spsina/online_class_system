import Vue from 'vue'
import VueRouter from 'vue-router'
import ListClass from '../components/class/ListClass.vue'
import App from '../App'
import AddClass from "../components/class/AddClass";

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: App
    },
    {
      path: '/class/add',
      name: 'Class-Add',
      component: AddClass
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
