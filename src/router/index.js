import Vue from 'vue'
import VueRouter from 'vue-router'
import ListClass from '../components/class/ListClass.vue'
import AddClass from "../components/class/AddClass";
import Login from '../components/account/Login'
import Home from "../views/Home";


Vue.use(VueRouter)

  const routes = [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        hideForAuth: true
      }
    },
    {
      path: '/admin',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/class/add',
          name: 'Class-Add',
          component: AddClass,
          meta: {
            requiresAuth: true
          }

        },
        {
          path: '/class/list',
          name: 'Class-List',
          component: ListClass,
          meta: {
            requiresAuth: true
          }
        },
      ]
    }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
