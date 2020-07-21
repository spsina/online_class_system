import Vue from 'vue'
import VueRouter from 'vue-router'
import ListClass from '../components/class/ListClass.vue'
import AddClass from "../components/class/AddClass";
import HomePage from "../components/home/HomePage";

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomePage
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
