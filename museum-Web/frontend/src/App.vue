<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1>博物馆文物时间轴</h1>
        <nav class="main-nav" v-if="isAuthenticated">
          <router-link to="/" exact>首页</router-link>
          <router-link to="/timeline">时间轴</router-link>
          <router-link to="/knowledge-graph">知识图谱</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
        <div class="user-actions" v-if="isAuthenticated">
          <router-link to="/profile" class="user-profile">
            <div class="avatar">
              <img src="https://via.placeholder.com/40?text=头像" alt="用户头像">
            </div>
            <span class="username">文物爱好者</span>
          </router-link>
          <button class="logout-btn" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            退出
          </button>
        </div>
      </div>
    </header>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer" v-if="isAuthenticated">
      <div class="footer-content">
        <p>© {{ new Date().getFullYear() }} 博物馆文物时间轴项目</p>
        <p class="footer-links">
          <a href="#" target="_blank">使用指南</a> | 
          <a href="#" target="_blank">联系我们</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false
    }
  },
  created() {
    // 检查用户是否已登录
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    
    // 监听登录状态变化
    window.addEventListener('storage', this.checkAuth)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuth)
  },
  watch: {
    '$route'() {
      // 当路由变化时，重新检查认证状态
      this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    }
  },
  methods: {
    checkAuth(e) {
      if (e.key === 'isAuthenticated') {
        this.isAuthenticated = e.newValue === 'true'
      }
    },
    logout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('isAuthenticated')
        this.isAuthenticated = false
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>
:root {
  --primary-color: #222;
  --secondary-color: #555;
  --accent-color: #a67c52;
  --background-color: #f8f8f8;
  --text-color: #333;
  --border-color: #ddd;
  --card-bg-color: #fff;
  --header-height: 70px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Noto Serif SC', serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

a {
  color: var(--accent-color);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #866341;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.header h1::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 28px;
  background-color: var(--accent-color);
  margin-right: 15px;
}

.main-nav {
  display: flex;
  gap: 25px;
}

.main-nav a {
  color: #fff;
  font-size: 1rem;
  position: relative;
  padding: 5px 0;
}

.main-nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--accent-color);
  transition: width 0.3s;
}

.main-nav a:hover::after,
.main-nav a.router-link-active::after {
  width: 100%;
}

.main-nav a.router-link-active {
  color: var(--accent-color);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  transition: opacity 0.3s;
}

.user-profile:hover {
  opacity: 0.8;
  color: white;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--accent-color);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 0.9rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ccc;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s;
}

.logout-btn:hover {
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.footer-links a {
  color: #ccc;
  margin-left: 5px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--accent-color);
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .header-content {
    padding: 0 1.5rem;
  }
  
  .main-nav {
    gap: 15px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .header h1::before {
    width: 6px;
    height: 24px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    padding: 0.5rem 1rem;
    height: auto;
  }
  
  .header {
    height: auto;
    position: static;
  }
  
  .header h1 {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .main-nav {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
  
  .main-nav a {
    white-space: nowrap;
  }
  
  .user-actions {
    width: 100%;
    justify-content: flex-end;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style> 