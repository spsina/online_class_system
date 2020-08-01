import Vue from 'vue'
import VueRouter from 'vue-router'
import ListClass from '../components/class/ListClass.vue'
import AddClass from "../components/class/AddClass";
import Login from '../components/account/Login'
import Home from "../views/Home";
import ClassRoom from '../views/ClassRoom'
import CreateUpdateQuiz from "../components/quiz/CreateUpdateQuiz";
import takeQuiz from "../views/takeQuiz";
import ScoreQuiz from "../views/ScoreQuiz";

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
      component: Home,
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
          path: 'class/:class_id/quiz/add',
          name: 'Quiz-Add',
          component: CreateUpdateQuiz,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'class/:class_id/quiz/:quiz_id',
          name: 'Quiz-Update',
          component: CreateUpdateQuiz,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'class/:class_id/quiz/:quiz_id/take',
          name: 'Quiz-Take',
          component: takeQuiz,
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
        {
          path: '/quiz/score/:quiz_answer_id/',
          name: 'Quiz-Score',
          component: ScoreQuiz,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/quiz/score/:quiz_answer_id/see/',
          name: 'Quiz-Score-See',
          component: ScoreQuiz,
          props: {editable: false},
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
