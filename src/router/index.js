import Vue from 'vue'
import VueRouter from 'vue-router'
import ListClass from '../components/class/ListClass.vue'
import AddClass from "../components/class/AddClass";
import Login from '../components/account/Login'
import Home from "../views/Home";
import ClassRoom from '../components/class/ClassRoom'

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
      path: '/',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      },
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

        {
          path: '/class/:class_id/',
          name: 'Class-Page',
          component: ClassRoom,
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
