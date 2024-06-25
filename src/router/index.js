import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'


//解决控制台报重复路由错误
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/login.vue')
  },
  {
    path: '/AdminIndex',
    component: () => import('../views/AdminIndex.vue'),
    children: [
      {
        path: '/CoachManage',

        component: () => import('../views/CoachManage.vue')
      },
      {
        path: '/AdminSelf',

        component: () => import('../views/AdminSelf.vue')
      },
      {
        path: '/coach/AddCoach',

        component: () => import('../components/coach/AddCoach.vue')
      },
      {
        path: '/CarManage',
        component: () => import('../components/car/CarManage.vue')
      },
      {
        path: '/UserManage',
        component: () => import('../components/user/UserManage.vue')
      },
      {
        path: '/user/AddUser',

        component: () => import('../components/user/AddUser.vue')
      },
      {
        path:'/accountManage',
        component: () => import('../components/account/accountManage.vue')
      },
      {
        path:'/accountManageCoach',
        component: () => import('../components/account/accountManageCoach.vue')
      },
      {
        path:'/Coachscore',
        component: () => import('../components/score/Coachscore.vue')
      },
      {
        path:'/ApplyManage',
        component: () => import('../components/apply/ApplyManage.vue')
      },
    ]
  },
  {
    path: '/CoachIndex',
    component: () => import('../views/CoachIndex.vue'),
    children: [
      {
        path: '/CoachSelf',

        component: () => import('../views/CoachSelf.vue')
      },
      {
        path: '/user/CoachViewUser',
        component: () => import('../components/user/CoachViewUser.vue')
      },
      {
        path: '/coach/StudyTime',
        component: () => import('../components/coach/StudyTime.vue')
      },
      {
        path: '/coach/CarSelect',
        component: () => import('../components/coach/CarSelect.vue')
      },
      {
        path: '/apply/CoachApply',
        component: () => import('../components/apply/CoachApply.vue')
      },
    ]
  },

//用户主页
  {
    path: '/UserIndex',
    component: () => import('../views/UserIndex.vue'),
    children: [
      {
        path: '/UserSelf',

        component: () => import('../components/user/UserSelf.vue')
      },
    
      {
        path: '/MyStudyTime',

        component: () => import('../components/user/MyStudyTime.vue')
      },{
        path: '/MyViewCoach',

        component: () => import('../components/user/MyViewCoach.vue')
      },
      {
        path: '/CoachSelect',

        component: () => import('../components/user/CoachSelect.vue')
      },
      {
        path: '/apply/UserApply.vue',

        component: () => import('../components/apply/UserApply.vue')
      },
    ]
  }


  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  // mode:'history',
  routes
})

export default router
