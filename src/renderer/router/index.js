import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/timetracking',
      name: 'timetracking',
      component: require('@/components/Timetracking').default
    },
    {
      path: '/setting',
      name: 'setting',
      component: require('@/components/Setting').default
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: require('@/components/Analysis').default
    },
    {
      path: '*',
      redirect: '/timetracking'
    }
  ]
})
