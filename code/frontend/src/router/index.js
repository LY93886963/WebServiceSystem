import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Timeline from '@/views/Timeline.vue'
import Knowledge from '@/views/Knowledge.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/timeline', component: Timeline },
  { path: '/knowledge', component: Knowledge },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router