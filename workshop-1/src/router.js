import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home'
import Stage1 from './components/Stage1'
import Stage2 from './components/Stage2'
import Stage3 from './components/Stage3'
import Stage4 from './components/Stage4'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/stages/1',
      name: 'Stage 1',
      component: Stage1
    },
    {
      path: '/stages/2',
      name: 'Stage 2',
      component: Stage2
    },
    {
      path: '/stages/3',
      name: 'Stage 3',
      component: Stage3
    },
    {
      path: '/stages/4',
      name: 'Stage 4',
      component: Stage4
    },
    { path: '*', redirect: '/' }
  ],
  scrollBehavior: () => ({ y: 0 })
})

export default router
