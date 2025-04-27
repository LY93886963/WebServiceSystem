import { createRouter, createWebHistory } from 'vue-router'
import TimelinePage from '../views/TimelinePage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/artifact/:id',
    name: 'ArtifactDetail',
    component: () => import(/* webpackChunkName: "artifact" */ '../views/ArtifactDetail.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: TimelinePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/knowledge-graph',
    name: 'KnowledgeGraph',
    component: () => import(/* webpackChunkName: "knowledge" */ '../views/KnowledgeGraph.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫检查身份验证
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  // 如果路由需要认证且用户未登录，则重定向到登录页面
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    // 如果用户已登录且尝试访问登录页面，则重定向到首页
    if (to.name === 'Login' && isAuthenticated) {
      next({ name: 'Home' })
    } else {
      next()
    }
  }
})

export default router 